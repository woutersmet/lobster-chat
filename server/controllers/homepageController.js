const getHomepage = (req, res) => {
  const PORT = process.env.PORT || 3000;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Drawer Hello API Server</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          margin-bottom: 10px;
        }
        .subtitle {
          opacity: 0.9;
          font-size: 14px;
        }
        .container {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .sidebar {
          width: 300px;
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 15px;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .sidebar-header h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .new-session-form {
          display: flex;
          gap: 5px;
        }
        .new-session-form input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        .new-session-form button {
          padding: 8px 15px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .new-session-form button:hover {
          background: #5568d3;
        }
        .sessions-list {
          flex: 1;
          overflow-y: auto;
        }
        .session-item {
          padding: 15px;
          border-bottom: 1px solid #dee2e6;
          cursor: pointer;
          transition: background 0.2s;
        }
        .session-item:hover {
          background: #e9ecef;
        }
        .session-item.active {
          background: #667eea;
          color: white;
        }
        .session-title {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .session-date {
          font-size: 12px;
          opacity: 0.7;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }
        .chat-header {
          padding: 15px 20px;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }
        .chat-header h2 {
          font-size: 18px;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }
        .message {
          margin-bottom: 15px;
          padding: 12px 15px;
          border-radius: 8px;
          max-width: 70%;
        }
        .message.user {
          background: #667eea;
          color: white;
          margin-left: auto;
        }
        .message.assistant {
          background: white;
          border: 1px solid #dee2e6;
        }
        .message-sender {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
          opacity: 0.8;
        }
        .message-text {
          word-wrap: break-word;
        }
        .message-time {
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.7;
        }
        .input-container {
          padding: 20px;
          background: white;
          border-top: 1px solid #dee2e6;
        }
        .message-form {
          display: flex;
          gap: 10px;
        }
        .message-form input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 14px;
        }
        .message-form button {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .message-form button:hover {
          background: #5568d3;
        }
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6c757d;
          font-size: 16px;
        }
        .api-docs {
          padding: 20px;
          background: #fff3cd;
          border-top: 1px solid #ffc107;
          font-size: 13px;
        }
        .api-docs h3 {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .endpoint {
          margin: 5px 0;
          font-family: 'Courier New', monospace;
        }
        .method {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: bold;
          font-size: 11px;
          margin-right: 8px;
        }
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
      </style>
    </head>
    <body>
      <header>
        <h1>🚀 Drawer Hello API Server</h1>
        <div class="subtitle">Backend API server for the Drawer Hello mobile application - Running on port ${PORT}</div>
      </header>

      <div class="container">
        <div class="sidebar">
          <div class="sidebar-header">
            <h2>Sessions</h2>
            <form class="new-session-form" id="newSessionForm">
              <input type="text" id="sessionTitle" placeholder="New session title..." required>
              <button type="submit">Create</button>
            </form>
          </div>
          <div class="sessions-list" id="sessionsList">
            <div class="empty-state">No sessions yet</div>
          </div>
        </div>

        <div class="main-content">
          <div class="chat-header">
            <h2 id="chatTitle">Select a session</h2>
          </div>
          <div class="messages-container" id="messagesContainer">
            <div class="empty-state">Select a session to view messages</div>
          </div>
          <div class="input-container">
            <form class="message-form" id="messageForm">
              <input type="text" id="messageText" placeholder="Type a message..." disabled>
              <button type="submit" disabled>Send</button>
            </form>
          </div>
        </div>
      </div>

      <div class="api-docs">
        <h3>📋 API Endpoints</h3>
        <div class="endpoint"><span class="method get">GET</span> /api/health - Health check</div>
        <div class="endpoint"><span class="method get">GET</span> /api/sessions - Get all sessions</div>
        <div class="endpoint"><span class="method post">POST</span> /api/sessions - Create session</div>
        <div class="endpoint"><span class="method get">GET</span> /api/sessions/:id/messages - Get messages</div>
        <div class="endpoint"><span class="method post">POST</span> /api/sessions/:id/messages - Add message</div>
      </div>

      <script>
        let currentSessionId = null;

        // Load sessions on page load
        async function loadSessions() {
          try {
            const response = await fetch('/api/sessions');
            const sessions = await response.json();
            renderSessions(sessions);
          } catch (error) {
            console.error('Error loading sessions:', error);
          }
        }

        // Render sessions list
        function renderSessions(sessions) {
          const sessionsList = document.getElementById('sessionsList');

          if (sessions.length === 0) {
            sessionsList.innerHTML = '<div class="empty-state">No sessions yet</div>';
            return;
          }

          sessionsList.innerHTML = sessions.map(session => \`
            <div class="session-item \${session.id === currentSessionId ? 'active' : ''}"
                 onclick="selectSession(\${session.id}, '\${session.title.replace(/'/g, "\\\\'")}')">
              <div class="session-title">\${session.title}</div>
              <div class="session-date">\${new Date(session.createdAt).toLocaleString()}</div>
            </div>
          \`).join('');
        }

        // Select a session
        async function selectSession(sessionId, title) {
          currentSessionId = sessionId;
          document.getElementById('chatTitle').textContent = title;
          document.getElementById('messageText').disabled = false;
          document.querySelector('#messageForm button').disabled = false;

          await loadMessages(sessionId);
          await loadSessions(); // Refresh to update active state
        }

        // Load messages for a session
        async function loadMessages(sessionId) {
          try {
            const response = await fetch(\`/api/sessions/\${sessionId}/messages\`);
            const messages = await response.json();
            renderMessages(messages);
          } catch (error) {
            console.error('Error loading messages:', error);
          }
        }

        // Render messages
        function renderMessages(messages) {
          const container = document.getElementById('messagesContainer');

          if (messages.length === 0) {
            container.innerHTML = '<div class="empty-state">No messages yet. Start the conversation!</div>';
            return;
          }

          container.innerHTML = messages.map(msg => \`
            <div class="message \${msg.sender}">
              <div class="message-sender">\${msg.sender}</div>
              <div class="message-text">\${msg.text}</div>
              <div class="message-time">\${new Date(msg.createdAt).toLocaleTimeString()}</div>
            </div>
          \`).join('');

          // Scroll to bottom
          container.scrollTop = container.scrollHeight;
        }

        // Create new session
        document.getElementById('newSessionForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const titleInput = document.getElementById('sessionTitle');
          const title = titleInput.value.trim();

          if (!title) return;

          try {
            const response = await fetch('/api/sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title })
            });

            const newSession = await response.json();
            titleInput.value = '';
            await loadSessions();
            selectSession(newSession.id, newSession.title);
          } catch (error) {
            console.error('Error creating session:', error);
          }
        });

        // Send message
        document.getElementById('messageForm').addEventListener('submit', async (e) => {
          e.preventDefault();

          if (!currentSessionId) return;

          const textInput = document.getElementById('messageText');
          const text = textInput.value.trim();

          if (!text) return;

          try {
            await fetch(\`/api/sessions/\${currentSessionId}/messages\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, sender: 'user' })
            });

            textInput.value = '';
            await loadMessages(currentSessionId);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });

        // Initial load
        loadSessions();
      </script>
    </body>
    </html>
  `);
};

module.exports = { getHomepage };