const db = require('../db/database');

// GET /api/sessions - Get all sessions
const getSessions = (req, res) => {
  try {
    const sessions = db.getAllSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
};

// POST /api/sessions - Create a new session
const createSession = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newSession = db.createSession(title);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// GET /api/sessions/:sessionId/messages - Get all messages for a session
const getMessages = (req, res) => {
  const sessionId = parseInt(req.params.sessionId);

  try {
    const session = db.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = db.getMessagesBySession(sessionId);
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// POST /api/sessions/:sessionId/messages - Add a message to a session
const createMessage = (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const { text, sender } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const session = db.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const newMessage = db.createMessage(sessionId, text, sender || 'user');
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

// Health check endpoint
const healthCheck = (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
};

module.exports = {
  getSessions,
  createSession,
  getMessages,
  createMessage,
  healthCheck
};

