const getHomepage = (req, res) => {
  const PORT = process.env.PORT || 3000;

  // Get local IP address
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';

  // Find the first non-internal IPv4 address
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
    if (localIP !== 'localhost') break;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lobster Chat API Server</title>
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
          background: white;
          padding: 40px 20px;
        }
        .wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .instructions {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 40px;
        }
        .instructions h2 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          padding-bottom: 0;
          border-bottom: none;
        }
        .instructions p {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .instructions .server-url {
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px 12px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #333;
          margin-top: 8px;
          display: inline-block;
        }
        .header-section {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 40px;
        }
        .header-text {
          flex: 1;
        }
        .lobster-image {
          width: 150px;
          height: auto;
          border-radius: 8px;
        }
        section {
          margin-bottom: 50px;
        }
        h2 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd;
        }
        .container {
          display: flex;
          border: 1px solid #ddd;
          height: 500px;
        }

        .sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 15px;
          background: white;
          border-bottom: 1px solid #e5e5e5;
        }
        .sidebar-header h3 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #333;
        }
        .new-session-form {
          display: flex;
          gap: 5px;
        }
        .new-session-form input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 2px;
          font-size: 13px;
        }
        .new-session-form button {
          padding: 6px 12px;
          background: #333;
          color: white;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          font-size: 13px;
        }
        .new-session-form button:hover {
          background: #555;
        }
        .sessions-list {
          flex: 1;
          overflow-y: auto;
        }
        .session-item {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
          transition: background 0.15s;
        }
        .session-item:hover {
          background: #f0f0f0;
        }
        .session-item.active {
          background: #e8e8e8;
        }
        .session-title {
          font-weight: 500;
          margin-bottom: 3px;
          font-size: 13px;
          color: #333;
        }
        .session-date {
          font-size: 11px;
          color: #888;
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
          border-bottom: 1px solid #ddd;
        }
        .chat-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: white;
        }
        .message {
          margin-bottom: 12px;
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 70%;
        }
        .message.user {
          background: #e5e5e5;
          color: #333;
          margin-left: auto;
        }
        .message.assistant {
          background: white;
          border: 1px solid #ddd;
          color: #333;
        }
        .message-sender {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 3px;
          opacity: 0.7;
        }
        .message.user .message-sender {
          display: none;
        }
        .message-text {
          word-wrap: break-word;
          font-size: 13px;
        }
        .message-time {
          font-size: 10px;
          margin-top: 3px;
          opacity: 0.6;
        }
        .input-container {
          padding: 15px 20px;
          background: white;
          border-top: 1px solid #ddd;
        }
        .message-form {
          display: flex;
          gap: 8px;
        }
        .message-form input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #ddd;
          border-radius: 20px;
          background: #f5f5f5;
          font-size: 13px;
        }
        .message-form input:focus {
          outline: none;
          border-color: #ccc;
        }
        .message-form button {
          padding: 10px 20px;
          background: #333;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
        }
        .message-form button:hover {
          background: #555;
        }
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header-section">
          <div class="header-text">
            <h1>You are online!</h1>
            <p class="subtitle">This means the server is running on port ${PORT}</p>
          </div>
          <img src="/lobster_with_phone.png" alt="Lobster with Phone" class="lobster-image">
        </div>

        <div class="instructions">
          <h2>Connect Your Mobile App</h2>
          <p>You're seeing this page because the API is running and ready for your chat app to connect to.</p>
          <p><strong>To connect:</strong></p>
          <ol style="margin-left: 20px; margin-top: 8px;">
            <li style="margin-bottom: 6px;">Open your mobile <strong>Lobster Chat</strong> app</li>
            <li style="margin-bottom: 6px;">Go to <strong>Settings</strong></li>
            <li style="margin-bottom: 6px;">Point the server to:</li>
          </ol>
          <div class="server-url">http://${localIP}:${PORT}</div>
        </div>

        <section>
          <h2>Chat Preview</h2>
          <div class="container">
            <div class="sidebar">
              <div class="sidebar-header">
                <h3>Conversations</h3>
                <form class="new-session-form" id="newSessionForm">
                  <input type="text" id="sessionTitle" placeholder="New conversation..." required>
                  <button type="submit">Create</button>
                </form>
              </div>
              <div class="sessions-list" id="sessionsList">
                <div class="empty-state">No conversations yet</div>
              </div>
            </div>

            <div class="main-content">
              <div class="chat-header">
                <h3 id="chatTitle">Select a conversation</h3>
              </div>
              <div class="messages-container" id="messagesContainer">
                <div class="empty-state">Select a conversation to view messages</div>
              </div>
              <div class="input-container">
                <form class="message-form" id="messageForm">
                  <input type="text" id="messageText" placeholder="Type a message..." disabled>
                  <button type="submit" disabled>Send</button>
                </form>
              </div>
            </div>
          </div>
        </section>
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
            sessionsList.innerHTML = '<div class="empty-state">No conversations yet</div>';
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