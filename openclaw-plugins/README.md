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

### 4. Configure Hook Mappings (Route Replies Back to Your App)

To make OpenClaw's agent replies flow back to your app channel, configure hook mappings in your OpenClaw config. This tells OpenClaw to deliver agent responses to your custom channel:

```json
{
  "hooks": {
    "enabled": true,
    "token": "shared-secret",
    "path": "/hooks",
    "mappings": [
      {
        "path": "/hooks/wake",
        "actions": [
          {
            "deliver": true,
            "channel": "myapp",
            "to": "{{from}}"
          }
        ]
      }
    ]
  }
}
```

This mapping ensures that when `/hooks/wake` is triggered, the agent's reply is delivered back to the `myapp` channel (your plugin), which will call your plugin's `sendText()` function, which POSTs to your Node server.

### 5. Update the Plugin for Outbound Messages

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

### 6. Update Lobster Chat Server (Wake the Agent)

Add a webhook endpoint to your Node server (`server/server.js`) to "wake" the OpenClaw agent when a user sends a message. This uses OpenClaw's webhook system for external triggers:

```javascript
// Add this endpoint to receive messages from the mobile app
// and wake the OpenClaw agent
app.post('/openclaw/send', async (req, res) => {
  const { text, sessionId, sender } = req.body;

  try {
    // Store the message in your database
    const message = db.createMessage(sessionId, text, sender);

    // Wake the OpenClaw agent via webhook
    const openclawUrl = process.env.OPENCLAW_URL || 'http://127.0.0.1:18789';
    const webhookToken = process.env.OPENCLAW_WEBHOOK_TOKEN || 'shared-secret';

    const response = await fetch(`${openclawUrl}/hooks/wake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`,
      },
      body: JSON.stringify({
        from: sender,
        text: text,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenClaw webhook failed: ${response.status}`);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error waking OpenClaw agent:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
```

**How it works:**
1. User sends a message from the mobile app
2. Your Node server stores the message in the database
3. Server POSTs to `http://127.0.0.1:18789/hooks/wake` (authenticated with the webhook token)
4. OpenClaw agent processes the message
5. Agent's reply is routed back via the hook mapping (configured in step 4)
6. Hook mapping triggers your plugin's `sendText()` which POSTs to your server
7. Your server stores the reply and the mobile app fetches/displays it

### 7. Add Outbound Endpoint to Lobster Chat Server

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

## Incremental Implementation Strategy

If you want to build this integration step-by-step, here's a recommended milestone approach:

### Milestone 1: Basic OpenClaw Setup
1. Install and run OpenClaw Gateway
2. Access the OpenClaw control UI
3. Verify basic chat functionality works in the OpenClaw UI

### Milestone 2: Wake the Agent (Inbound Only)
1. Enable webhooks in OpenClaw config (step 3)
2. Add the `/openclaw/send` endpoint to your Node server (step 6)
3. Test triggering the agent from your app by POSTing to `/hooks/wake`
4. Verify the agent responds (you'll see responses in OpenClaw's UI at this stage)

**At this point, you can trigger the agent from your app, but replies only show in OpenClaw's UI.**

### Milestone 3: Full Bidirectional Flow
1. Create and install the custom channel plugin (steps 1-2)
2. Configure hook mappings to route replies to your channel (step 4)
3. Implement the outbound endpoint `/openclaw/deliver` (step 7)
4. Update the plugin's `sendText()` to POST to your server (step 5)
5. Test the complete round-trip: app → server → OpenClaw → server → app

**Now replies land back in your app instead of only in OpenClaw's UI.**

This incremental approach lets you validate each piece before adding complexity.

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
OPENCLAW_URL=http://127.0.0.1:18789
OPENCLAW_WEBHOOK_TOKEN=shared-secret
```

**Note:** The default OpenClaw Gateway runs on port `18789`. Adjust if your setup uses a different port.

---

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
