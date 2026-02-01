const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let sessions = [];
let messages = {};
let sessionIdCounter = 1;
let messageIdCounter = 1;

// Sessions endpoints

// GET /sessions - Get all sessions
app.get('/sessions', (req, res) => {
  res.json(sessions);
});

// POST /sessions - Create a new session
app.post('/sessions', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newSession = {
    id: sessionIdCounter++,
    title,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);
  messages[newSession.id] = [];

  res.status(201).json(newSession);
});

// Messages endpoints

// GET /sessions/:sessionId/messages - Get all messages for a session
app.get('/sessions/:sessionId/messages', (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(messages[sessionId] || []);
});

// POST /sessions/:sessionId/messages - Add a message to a session
app.post('/sessions/:sessionId/messages', (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const { text, sender } = req.body;

  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newMessage = {
    id: messageIdCounter++,
    sessionId,
    text,
    sender: sender || 'user',
    createdAt: new Date().toISOString()
  };

  if (!messages[sessionId]) {
    messages[sessionId] = [];
  }

  messages[sessionId].push(newMessage);

  res.status(201).json(newMessage);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

