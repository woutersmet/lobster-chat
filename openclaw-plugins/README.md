# OpenClaw Lobster Chat Plugin

This plugin integrates the Lobster Chat server as a custom channel in OpenClaw, similar to WhatsApp or Telegram channels.

## Overview

The integration has two layers:

**A. Outbound (OpenClaw → Lobster Chat Server)**
When OpenClaw sends a message, the plugin POSTs it to your local Node server so it can be stored and pushed to the mobile app.

**B. Inbound (Lobster Chat Server → OpenClaw)**
When a user sends a message from the mobile app, your Node server calls OpenClaw's webhook endpoint to deliver the message.

---

## Setup Instructions

### 1. Install the Plugin

1. **Copy the plugin file** to your OpenClaw plugins directory:
   ```bash
   # Create a plugins directory if it doesn't exist
   mkdir -p ~/openclaw/plugins

   # Copy the plugin file
   cp openclaw-lobsterchat-plugin.js ~/openclaw/plugins/
   ```

2. **Install the plugin** using OpenClaw CLI:
   ```bash
   openclaw plugins install ./path/to/openclaw-lobsterchat-plugin.js
   ```

   Or if you copied it to the plugins directory:
   ```bash
   openclaw plugins install ~/openclaw/plugins/openclaw-lobsterchat-plugin.js
   ```

3. **Restart OpenClaw Gateway** to load the plugin.

### 2. Configure OpenClaw Channel

Add the Lobster Chat channel configuration to your OpenClaw config file (typically `~/.openclaw/config.json` or similar):

```json
{
  "channels": {
    "myapp": {
      "accounts": {
        "default": {
          "accountId": "lobster-chat-default",
          "serverUrl": "http://localhost:3000"
        }
      }
    }
  }
}
```

### 3. Enable OpenClaw Webhooks (Inbound Messages)

To receive messages from the Lobster Chat server, enable the webhook endpoint in your OpenClaw config:

```json
{
  "hooks": {
    "enabled": true,
    "token": "shared-secret",
    "path": "/hooks"
  }
}
```

**Important:** Replace `"shared-secret"` with a secure token that both OpenClaw and your Lobster Chat server will use to authenticate webhook requests.

### 4. Update the Plugin for Outbound Messages

Edit `openclaw-lobsterchat-plugin.js` to implement the actual HTTP POST to your server:

```javascript
outbound: {
  deliveryMode: "direct",
  sendText: async ({ text, to, account }) => {
    try {
      const serverUrl = account.serverUrl || "http://localhost:3000";
      const response = await fetch(`${serverUrl}/openclaw/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          to,
          from: "openclaw",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { ok: true };
    } catch (error) {
      console.error("Failed to deliver message to Lobster Chat:", error);
      return { ok: false, error: error.message };
    }
  },
},
```

### 5. Update Lobster Chat Server (Inbound Messages)

Add a webhook endpoint to your Node server (`server/server.js`) to send messages to OpenClaw:

```javascript
// Add this endpoint to receive messages from the mobile app
// and forward them to OpenClaw
app.post('/openclaw/send', async (req, res) => {
  const { text, sessionId, sender } = req.body;

  try {
    // Store the message in your database
    const message = db.createMessage(sessionId, text, sender);

    // Forward to OpenClaw webhook
    const openclawUrl = process.env.OPENCLAW_URL || 'http://localhost:8080';
    const webhookToken = process.env.OPENCLAW_WEBHOOK_TOKEN || 'shared-secret';

    await fetch(`${openclawUrl}/hooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`,
      },
      body: JSON.stringify({
        channel: 'myapp',
        from: sender,
        text: text,
        timestamp: new Date().toISOString(),
      }),
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error forwarding to OpenClaw:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
```

### 6. Add Outbound Endpoint to Lobster Chat Server

Add an endpoint to receive messages from OpenClaw (`server/server.js`):

```javascript
// Add this endpoint to receive messages from OpenClaw
app.post('/openclaw/deliver', async (req, res) => {
  const { text, to, from, timestamp } = req.body;

  try {
    // Parse the 'to' field to get sessionId
    // Adjust this based on your addressing scheme
    const sessionId = parseInt(to);

    // Store the message in your database
    const message = db.createMessage(sessionId, text, from || 'openclaw');

    // TODO: Push notification to mobile app if needed
    // You might want to use WebSockets, FCM, or another push mechanism

    res.status(200).json({ ok: true, messageId: message.id });
  } catch (error) {
    console.error('Error receiving from OpenClaw:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
```

---

## Testing the Integration

### Test Outbound (OpenClaw → Lobster Chat)

1. Start your Lobster Chat server:
   ```bash
   cd server
   npm start
   ```

2. In OpenClaw, send a message using the "MyApp" channel:
   ```
   # This depends on your OpenClaw interface
   # The message should appear in your Lobster Chat server logs
   ```

3. Check your server logs to verify the message was received at `/openclaw/deliver`.

### Test Inbound (Lobster Chat → OpenClaw)

1. Ensure OpenClaw Gateway is running with webhooks enabled.

2. Send a test message from your mobile app or web interface.

3. Verify the message appears in OpenClaw.

---

## Environment Variables

Add these to your server's `.env` file:

```bash
# OpenClaw integration
OPENCLAW_URL=http://localhost:8080
OPENCLAW_WEBHOOK_TOKEN=shared-secret
```

---

## Troubleshooting

### Messages not appearing in OpenClaw
- Verify the webhook endpoint is enabled in OpenClaw config
- Check that the webhook token matches in both configs
- Verify the OpenClaw URL is correct
- Check OpenClaw logs for webhook errors

### Messages not appearing in Lobster Chat
- Verify the plugin is installed: `openclaw plugins list`
- Check the server URL in the channel config
- Verify the `/openclaw/deliver` endpoint is accessible
- Check server logs for incoming requests

### Plugin not loading
- Ensure the plugin file is in the correct directory
- Verify the plugin syntax is valid JavaScript
- Check OpenClaw logs for plugin loading errors
- Try reinstalling: `openclaw plugins uninstall openclaw-lobsterchat-plugin && openclaw plugins install ./path/to/plugin`

---

## Architecture Diagram

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Mobile App     │         │  Lobster Chat    │         │    OpenClaw     │
│                 │         │     Server       │         │                 │
│  - React Native │◄────────┤  - Node.js       │◄────────┤  - Gateway      │
│  - Expo         │         │  - Express       │         │  - Plugin       │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                            │
        │  POST /api/sessions/       │                            │
        │  {sessionId}/messages      │                            │
        └───────────────────────────►│                            │
                                     │                            │
                                     │  POST /hooks               │
                                     │  (inbound to OpenClaw)     │
                                     └───────────────────────────►│
                                     │                            │
                                     │  POST /openclaw/deliver    │
                                     │  (outbound from OpenClaw)  │
                                     │◄───────────────────────────┘
                                     │
                                     │  Push to app
                                     └───────────────────────────►
```

---

## Next Steps

1. **Implement push notifications** to notify the mobile app when OpenClaw sends a message
2. **Add authentication** to secure the webhook endpoints
3. **Handle message threading** if your app supports multiple conversations
4. **Add typing indicators** and read receipts
5. **Implement file/media sharing** if needed

---

## References

- [OpenClaw Documentation](https://github.com/openai/openclaw)
- [OpenClaw Plugin API](https://github.com/openai/openclaw/docs/plugins)
- [Lobster Chat Server API](../server/README.md)
