import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Local Vite development
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
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for images/markdown

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


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// POST route for form submission
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL, // The recipient's email address
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
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
