// In-memory data store
let sessions = [];
let messages = {};
let sessionIdCounter = 1;
let messageIdCounter = 1;

// GET /api/sessions - Get all sessions
const getSessions = (req, res) => {
  res.json(sessions);
};

// POST /api/sessions - Create a new session
const createSession = (req, res) => {
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
};

// GET /api/sessions/:sessionId/messages - Get all messages for a session
const getMessages = (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(messages[sessionId] || []);
};

// POST /api/sessions/:sessionId/messages - Add a message to a session
const createMessage = (req, res) => {
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
};

// Health check endpoint
const healthCheck = (req, res) => {
  res.json({ status: 'ok' });
};

module.exports = {
  getSessions,
  createSession,
  getMessages,
  createMessage,
  healthCheck
};

