# Drawer Hello - Server

This is the backend API server for the Drawer Hello project, built with Node.js and Express.

## Features

- RESTful API for managing chat sessions and messages
- In-memory data storage
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

For development with auto-reload, you can use:

```bash
npm run dev
```

## API Endpoints

### Sessions

#### Get all sessions
```
GET /sessions
```

Returns a list of all chat sessions.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Session Title",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create a new session
```
POST /sessions
```

**Request Body:**
```json
{
  "title": "New Session"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "New Session",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Messages

#### Get all messages for a session
```
GET /sessions/:sessionId/messages
```

Returns all messages for the specified session.

**Response:**
```json
[
  {
    "id": 1,
    "sessionId": 1,
    "text": "Hello!",
    "sender": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Add a message to a session
```
POST /sessions/:sessionId/messages
```

**Request Body:**
```json
{
  "text": "Hello!",
  "sender": "user"
}
```

**Response:**
```json
{
  "id": 1,
  "sessionId": 1,
  "text": "Hello!",
  "sender": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Health Check

```
GET /health
```

Returns the server status.

## Technologies Used

- Node.js
- Express.js
- CORS middleware

## Notes

- This server uses in-memory storage, so all data will be lost when the server restarts
- For production use, consider implementing a proper database (e.g., PostgreSQL, MongoDB)

