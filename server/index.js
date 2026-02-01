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

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Drawer Hello API Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        h2 {
          color: #34495e;
          margin-top: 30px;
        }
        .endpoint {
          background: #f8f9fa;
          border-left: 4px solid #3498db;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: bold;
          font-size: 12px;
          margin-right: 10px;
        }
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
        .route {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #2c3e50;
        }
        .description {
          margin-top: 8px;
          color: #555;
        }
        .info {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>🚀 Drawer Hello API Server</h1>
      <p>This is the backend API server for the Drawer Hello mobile application. It provides endpoints for managing chat sessions and messages.</p>

      <div class="info">
        <strong>Server Status:</strong> Running on port ${PORT}<br>
        <strong>Storage:</strong> In-memory (data will be lost on restart)
      </div>

      <h2>📋 API Endpoints</h2>

      <div class="endpoint">
        <div>
          <span class="method get">GET</span>
          <span class="route">/health</span>
        </div>
        <div class="description">Health check endpoint - returns server status</div>
      </div>

      <h3>Sessions</h3>

      <div class="endpoint">
        <div>
          <span class="method get">GET</span>
          <span class="route">/sessions</span>
        </div>
        <div class="description">Get a list of all chat sessions</div>
      </div>

      <div class="endpoint">
        <div>
          <span class="method post">POST</span>
          <span class="route">/sessions</span>
        </div>
        <div class="description">Create a new chat session. Requires <code>title</code> in request body</div>
      </div>

      <h3>Messages</h3>

      <div class="endpoint">
        <div>
          <span class="method get">GET</span>
          <span class="route">/sessions/:sessionId/messages</span>
        </div>
        <div class="description">Get all messages for a specific session</div>
      </div>

      <div class="endpoint">
        <div>
          <span class="method post">POST</span>
          <span class="route">/sessions/:sessionId/messages</span>
        </div>
        <div class="description">Add a new message to a session. Requires <code>text</code> and optional <code>sender</code> in request body</div>
      </div>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
      <p style="text-align: center; color: #888; font-size: 14px;">
        Drawer Hello API Server v1.0.0
      </p>
    </body>
    </html>
  `);
});

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

