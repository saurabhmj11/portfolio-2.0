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
        to: email,
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
        reply_to: process.env.RECIPIENT_EMAIL || 'saurabhmj11@gmail.com',
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


// Default route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
