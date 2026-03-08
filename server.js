import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Local Vite development
  'http://localhost:5174', // Fallback Vite port
  'http://localhost:3000',
  process.env.FRONTEND_URL // Will be injected by Render environment variables
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for images/markdown

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

// --- AUTH MOCK ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'saurabhmj11@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456789sl';
const generateToken = () => "mock-jwt-token-" + Math.random().toString(36).substr(2);

// Middleware for requiring auth
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer secret-token-123') { // Simplified for this demo
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
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
// Post Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ token: 'secret-token-123' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get All Posts (Public)
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  // Filter out drafts for public view if query param ?public=true is present
  // For admin, we return all. Assuming frontend handles filtering or we add a query param.
  // Let's just return all for now and frontend sorts it out, or basic filtering:
  const { publishedOnly } = req.query;
  if (publishedOnly === 'true') {
    res.json(posts.filter(p => p.status === 'published'));
  } else {
    res.json(posts);
  }
});

// Get Single Post
app.get('/api/posts/:slug', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.slug === req.params.slug);
  if (post) res.json(post);
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

Summary: LLM Engineer with ~2 years of hands-on experience building production-grade AI systems using Large Language Models, Retrieval-Augmented Generation (RAG), and multi-agent architectures. Specialized in local-first LLM deployment (Ollama), agentic workflows (LangChain / LangGraph), and scalable FastAPI backends. Experienced in designing end-to-end AI pipelines including document ingestion, semantic chunking, embeddings, vector search, agent orchestration, and grounded answer generation.

Core Skills:
- LLM Systems & RAG: End-to-end RAG architectures, Semantic chunking & Embeddings, Vector DBs (FAISS, Qdrant, Pinecone)
- AI Agents: LangChain, LangGraph, CrewAI
- LLMs & GenAI: Ollama (Local), OpenAI (GPT), Claude, Gemini, Mistral
- Backend & Engineering: Python (Advanced), FastAPI, Docker

Key Projects:
1. HireMeOS: Autonomous AI career system with multi-agent pipelines for resume analysis.
2. Autonomous Research Agent: Multi-agent RAG system for researching and writing reports using LangGraph and Ollama.
3. DataOS: Local-first AI assistant for structured dataset analysis.
4. NeuroAdaptive Quiz Engine: Context-aware learning system.

Experience:
Freelance & Product Projects (Jan 2024 - Present): Built multiple production-grade LLM systems, complete RAG workflows, multi-agent planners, and FastAPI backends.

Education: B.Tech in Computer Science (First Class), Amravati University (2019-2023)
`;

// Default fallback response logic (used if API key is missing or fails)
const getFallbackResponse = (input) => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('skill') || lowerInput.includes('tools')) {
    return "Core Expertise: LLM Systems & RAG, AI Agents (LangChain, LangGraph). Proficient in Python (FastAPI), Local LLMs (Ollama), and Vector DBs.";
  } else if (lowerInput.includes('project')) {
    return "Saurabh's Flagships: HireMeOS, Autonomous Research Agent, DataOS, and NeuroAdaptive Quiz Engine.";
  } else if (lowerInput.includes('contact') || lowerInput.includes('email')) {
    return "Contact Saurabh directly: saurabhmj11@gmail.com | +91-7767913887";
  }
  return "I am currently running in offline mode. Please contact Saurabh at saurabhmj11@gmail.com for more details!";
};

// Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  // Safety check - we need an array of messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages array provided.' });
  }

  const lastMessage = messages[messages.length - 1].text;

  if (!ai) {
    // Fallback if no API key
    return res.json({ response: getFallbackResponse(lastMessage) });
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
      response: "I'm having a little trouble connecting to my neural net right now. You can always email Saurabh at saurabhmj11@gmail.com!"
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
