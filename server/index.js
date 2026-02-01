const express = require('express');
const cors = require('cors');
const { getHomepage } = require('./controllers/homepageController');
const {
  getSessions,
  createSession,
  getMessages,
  createMessage,
  healthCheck
} = require('./controllers/apiController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Homepage route
app.get('/', getHomepage);

// API routes
app.get('/api/health', healthCheck);
app.get('/api/sessions', getSessions);
app.post('/api/sessions', createSession);
app.get('/api/sessions/:sessionId/messages', getMessages);
app.post('/api/sessions/:sessionId/messages', createMessage);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

