import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables

const app = express();
// Render (and most hosts) sit behind one reverse proxy: take the client IP from
// X-Forwarded-For so per-IP limits are actually per visitor.
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Local Vite development
  'http://localhost:5174', // Fallback Vite port
  'http://localhost:4173', // vite preview
  'http://localhost:3000',
  process.env.FRONTEND_URL // Will be injected by Render environment variables
];

app.use(cors({
  origin: function (origin, callback) {
    // Only this site (and its own Netlify deploy previews) — not every *.netlify.app.
    const isOwnSite = origin && /^https:\/\/([a-z0-9-]+--)?saurabh-a-lokhande\.netlify\.app$/.test(origin);
    if (!origin || allowedOrigins.includes(origin) || isOwnSite) {
      callback(null, true);
    } else {
      // Deny quietly: no CORS headers, the browser blocks it — no 500 / stack trace.
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '100kb' })); // chat + contact + markdown posts; 50 MB invited abuse

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');

// Helper to read posts
const readPosts = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper to write posts
const writePosts = (posts) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

// --- AUTH ---
// Credentials come only from the environment. With no ADMIN_EMAIL/ADMIN_PASSWORD
// set, admin login is disabled rather than falling back to a default.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// AUTH_SECRET signs admin tokens. If unset, a random per-process secret is used,
// so tokens simply stop working after a restart (safe default).
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.AUTH_SECRET) {
  console.log('⚠ AUTH_SECRET not set — using a random secret; admin sessions end on restart');
}

const safeEqual = (a, b) => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

const sign = (data) => crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');

const issueToken = (email) => {
  const payload = Buffer.from(JSON.stringify({ sub: email, exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};

const verifyToken = (token) => {
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
};

// Middleware for requiring auth
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (verifyToken(token)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Basic in-memory login throttle: 5 failed attempts per IP per 15 minutes.
const loginFailures = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const tooManyFailures = (ip) => {
  const entry = loginFailures.get(ip);
  if (!entry || Date.now() - entry.first > LOGIN_WINDOW_MS) return false;
  return entry.count >= 5;
};
const recordFailure = (ip) => {
  const entry = loginFailures.get(ip);
  if (!entry || Date.now() - entry.first > LOGIN_WINDOW_MS) loginFailures.set(ip, { first: Date.now(), count: 1 });
  else entry.count += 1;
};


// Email (Resend) — optional, only works if RESEND_API_KEY is set
let resend = null;
try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✓ Resend email service initialized');
  } else {
    console.log('⚠ RESEND_API_KEY not set — email sending disabled');
  }
} catch (err) {
  console.log('⚠ Resend module not available — email sending disabled');
}

// POST route for form submission
app.post('/send-message', async (req, res) => {
  if (!resend) {
    return res.status(503).json({ error: 'Email service not configured. Set RESEND_API_KEY in .env' });
  }
  const { name, email, message } = req.body;

  try {
    // 1. Send notification email to portfolio owner
    const data = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: process.env.RECIPIENT_EMAIL || 'saurabhmj11@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      reply_to: email,
    });

    // 2. Send confirmation receipt email to the visitor
    try {
      await resend.emails.send({
        from: 'Saurabh Lokhande <onboarding@resend.dev>',
        to: email, // <--- Sent to the user who filled the form
        subject: `Thanks for reaching out, ${name}! — Message Received`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 16px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%); padding: 40px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0; font-weight: 700;">Message Received ✓</h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Your transmission has been logged successfully</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi <strong style="color: #818cf8;">${name}</strong>,
              </p>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0;">
                Thank you for reaching out! I've received your message and will get back to you within <strong style="color: #e2e8f0;">24 hours</strong>.
              </p>

              <!-- Message echo box -->
              <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                <p style="color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">Your Message</p>
                <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
                If you need to follow up, simply reply to this email or reach me at
                <a href="mailto:saurabhmj11@gmail.com" style="color: #818cf8; text-decoration: none;">saurabhmj11@gmail.com</a>.
              </p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #1f2937; padding: 20px 32px; text-align: center;">
              <p style="color: #4b5563; font-size: 11px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                Saurabh Lokhande — AI/ML Engineer
              </p>
            </div>
          </div>
        `,
        reply_to: process.env.RECIPIENT_EMAIL || 'saurabhmj11@gmail.com', // <--- So they can reply to YOU
      });
      console.log(`✓ Confirmation receipt sent to ${email}`);
    } catch (receiptError) {
      // Log the error but don't fail the whole request — the main email was sent
      console.error('⚠ Failed to send confirmation receipt:', receiptError);
    }

    res.status(200).json({ message: 'Message sent successfully!', data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send the message' });
  }
});

// --- BLOG API ---

// Post Login
app.post('/api/auth/login', (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin login is not configured' });
  }
  const ip = req.ip;
  if (tooManyFailures(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }
  const { email, password } = req.body || {};
  if (safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD)) {
    loginFailures.delete(ip);
    res.json({ token: issueToken(ADMIN_EMAIL) });
  } else {
    recordFailure(ip);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get All Posts (Public)
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  // Filter out drafts for public view if query param ?public=true is present
  // For admin, we return all. Assuming frontend handles filtering or we add a query param.
  // Let's just return all for now and frontend sorts it out, or basic filtering:
  // Drafts are visible only to a signed-in admin; everyone else gets published posts.
  const authHeader = req.headers.authorization || '';
  const isAdmin = authHeader.startsWith('Bearer ') && Boolean(verifyToken(authHeader.slice(7)));
  const { publishedOnly } = req.query;
  if (publishedOnly === 'true' || !isAdmin) {
    res.json(posts.filter(p => p.status === 'published'));
  } else {
    res.json(posts);
  }
});

// Get Single Post
app.get('/api/posts/:slug', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.slug === req.params.slug);
  const authHeader = req.headers.authorization || '';
  const isAdmin = authHeader.startsWith('Bearer ') && Boolean(verifyToken(authHeader.slice(7)));
  // Drafts exist only for the signed-in admin.
  if (post && (post.status === 'published' || isAdmin)) res.json(post);
  else res.status(404).json({ error: 'Post not found' });
});

// Create Post (Admin)
app.post('/api/posts', requireAuth, (req, res) => {
  const posts = readPosts();
  const newPost = req.body;

  // Simple validation
  if (!newPost.slug || !newPost.title) {
    return res.status(400).json({ error: 'Missing defined fields' });
  }

  if (posts.find(p => p.slug === newPost.slug)) {
    return res.status(400).json({ error: 'Slug already exists' });
  }

  posts.push(newPost);
  writePosts(posts);
  res.json(newPost);
});

// Update Post (Admin)
app.put('/api/posts/:slug', requireAuth, (req, res) => {
  let posts = readPosts();
  const index = posts.findIndex(p => p.slug === req.params.slug);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Update fields
  posts[index] = { ...posts[index], ...req.body };
  writePosts(posts);
  res.json(posts[index]);
});

// Delete Post (Admin)
app.delete('/api/posts/:slug', requireAuth, (req, res) => {
  let posts = readPosts();
  const filteredPosts = posts.filter(p => p.slug !== req.params.slug);

  if (posts.length === filteredPosts.length) {
    return res.status(404).json({ error: 'Post not found' });
  }

  writePosts(filteredPosts);
  res.json({ success: true });
});


import { GoogleGenAI } from '@google/genai';

// Initialize Gemini if API key is present
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('✓ Gemini API initialized');
} else {
  console.log('⚠ GEMINI_API_KEY not set — chatbot will use fallback responses');
}

// System prompt defining the AI's persona and knowledge base
const SYSTEM_PROMPT = `
You are an AI assistant representing Saurabh Lokhande, an LLM Engineer.
Your job is to answer questions about his professional background, skills, and projects in a friendly, concise, and professional tone.
Do NOT invent information. If you don't know the answer based on the provided context, gracefully admit it and suggest contacting him directly.
Keep your answers relatively short (under 4-5 sentences ideally) as they are displayed in a small chat widget on his portfolio.

--- Context about Saurabh ---
Name: Saurabh Lokhande
Title: LLM Engineer | RAG • AI Agents • LLM Systems
Email: saurabhmj11@gmail.com
Phone: +91-7767913887
Location: Open to Relocation | Immediate Joiner

Summary: LLM Engineer building AI systems since 2022 using Large Language Models, Retrieval-Augmented Generation (RAG), and multi-agent architectures. Specialized in local-first LLM deployment (Ollama), agentic workflows (LangChain / LangGraph), and scalable FastAPI backends. Experienced in designing end-to-end AI pipelines including document ingestion, semantic chunking, embeddings, vector search, agent orchestration, and grounded answer generation.

Core Skills:
- LLM Systems & RAG: End-to-end RAG architectures, Semantic chunking & Embeddings, Vector DBs (FAISS, Qdrant, Pinecone)
- AI Agents: LangChain, LangGraph, CrewAI
- LLMs & GenAI: Ollama (Local), OpenAI (GPT), Claude, Gemini, Mistral
- Backend & Engineering: Python (Advanced), FastAPI, Docker

Key Projects (only discuss these; never invent metrics):
1. Doc AI: cited document Q&A with hybrid BM25 + vector retrieval, RRF fusion and cross-encoder reranking. The large-corpus engine (open-source models, CPU-only) is evaluated on 12 PDFs / 4,584 pages with a 40-question synthetic set: Recall@3 97.5%, MRR@10 0.867, retrieval p50 0.55 s; full answers tuned from ~31 s to 6.7 s p50. The live demo (doc-ai-frontend.onrender.com) runs the original Gemini pipeline.
2. Hire Me OS 2.0: Multi-tenant job-search SaaS (Next.js 16, Supabase, Prisma) with a 6-block job evaluation, 10 scored dimensions and an A–F grade. The hosted demo is paused; the source is public.
3. Multi-Agent Research: a linear LangGraph pipeline (planner → researcher → verifier → writer) running locally on Ollama with DuckDuckGo search.
4. DataOS: Browser-based simulation of an agentic data-analysis platform with Gemini-powered Q&A.

Experience:
- Gen AI / LLM Engineer, OneOfficeAutomation (Jan 2024 - Present): LLM agents and RAG pipelines (LangGraph, FastAPI) alongside the company's RPA and SAP automation platform.
- ML Engineer, Freelance (2023 - 2024): vision transformer and recommendation-engine models.
- Data & AI Intern, Pantech Solutions (2022 - 2023): semantic retrieval and early vector search systems.

Education: Bachelor's Degree in Engineering, Amravati University (2019-2023)
`;

// Default fallback response logic (used if API key is missing or fails)
const getFallbackResponse = (input) => {
  // Whole-word matching, so "which" doesn't count as "hi".
  const has = (...words) => words.some(w => new RegExp(`\\b${w}\\b`, 'i').test(input));
  if (has('skill', 'skills', 'tools', 'stack', 'tech')) {
    return "Retrieval and agent systems: hybrid BM25 + vector RAG with reranking and citations, LangGraph agents, FastAPI backends, ChromaDB/FAISS, Ollama and hosted LLMs.";
  } else if (has('project', 'projects', 'work', 'built', 'portfolio')) {
    return "Selected work: Doc AI (hybrid RAG, evaluated on 4,584 pages: Recall@3 97.5%), Hire Me OS 2.0 (job-search SaaS), Multi-Agent Research (LangGraph) and DataOS. Each has a case study in Selected Work.";
  } else if (has('contact', 'email', 'hire', 'reach')) {
    return "Email saurabhmj11@gmail.com or use the contact form at the bottom of the page.";
  }
  return "I'm running in quick-answer mode right now. Try asking about his projects, skills or how to contact him — or email saurabhmj11@gmail.com.";
};

// Chatbot Endpoint
// Chat abuse limits: per-IP burst + a global daily cap protect the LLM quota.
const CHAT_PER_MINUTE = 10;
const CHAT_DAILY_CAP = 500;
const chatHits = new Map();
let chatDay = new Date().toISOString().slice(0, 10);
let chatToday = 0;
const chatLimited = (ip) => {
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== chatDay) { chatDay = today; chatToday = 0; chatHits.clear(); }
  if (chatToday >= CHAT_DAILY_CAP) return true;
  const recent = (chatHits.get(ip) || []).filter(t => now - t < 60_000);
  if (recent.length === 0) chatHits.delete(ip);
  if (recent.length >= CHAT_PER_MINUTE) { chatHits.set(ip, recent); return true; }
  recent.push(now); chatHits.set(ip, recent); chatToday += 1;
  return false;
};

/** 1–20 messages, each { sender?: 'user'|'bot', text: string ≤ 2000 chars }. */
export const validChatMessages = (messages) =>
  Array.isArray(messages) && messages.length >= 1 && messages.length <= 20 &&
  messages.every(m => m && typeof m.text === 'string' && m.text.trim().length > 0 && m.text.length <= 2000 &&
    (m.sender === undefined || m.sender === 'user' || m.sender === 'bot'));

app.post('/api/chat', async (req, res) => {
  const messages = req.body?.messages;

  if (!validChatMessages(messages)) {
    return res.status(400).json({ error: 'Send 1–20 messages, each with a non-empty text of at most 2,000 characters.' });
  }
  if (chatLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many messages — please try again in a minute.' });
  }

  const lastMessage = messages[messages.length - 1].text;

  if (!ai) {
    // Fallback if no API key
    // mode tells the client this is a keyword quick answer, not the LLM.
    return res.json({ response: getFallbackResponse(lastMessage), mode: 'fallback' });
  }

  try {
    // Format previous messages for Gemini context (optional, but good for follow-ups)
    // Gemini expects 'user' or 'model' roles. We'll construct a single combined prompt for simplicity 
    // in this free tier implementation to ensure context is always strongly grounded.

    let conversationHistory = "";
    // Only take the last 5 messages to avoid blowing up the context window unnecessarily
    const recentMessages = messages.slice(-5);
    recentMessages.forEach(msg => {
      conversationHistory += `\n${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`;
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nRecent Conversation:${conversationHistory}\n\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.3, // keep responses grounded and factual
      }
    });

    return res.json({ response: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.json({
      response: getFallbackResponse(lastMessage),
      mode: 'fallback',
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
