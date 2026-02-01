const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'chat.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDatabase = () => {
  // Create sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      sender TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
};

// Initialize database on module load
initDatabase();

// Session operations
const sessionQueries = {
  getAll: db.prepare('SELECT id, title, created_at as createdAt FROM sessions ORDER BY created_at DESC'),
  
  getById: db.prepare('SELECT id, title, created_at as createdAt FROM sessions WHERE id = ?'),
  
  create: db.prepare('INSERT INTO sessions (title, created_at) VALUES (?, ?)'),
  
  delete: db.prepare('DELETE FROM sessions WHERE id = ?')
};

// Message operations
const messageQueries = {
  getAllBySession: db.prepare(`
    SELECT id, session_id as sessionId, text, sender, created_at as createdAt 
    FROM messages 
    WHERE session_id = ? 
    ORDER BY created_at ASC
  `),
  
  create: db.prepare('INSERT INTO messages (session_id, text, sender, created_at) VALUES (?, ?, ?, ?)'),
  
  delete: db.prepare('DELETE FROM messages WHERE id = ?')
};

// Exported database operations
module.exports = {
  // Session operations
  getAllSessions: () => {
    return sessionQueries.getAll.all();
  },

  getSessionById: (id) => {
    return sessionQueries.getById.get(id);
  },

  createSession: (title) => {
    const createdAt = new Date().toISOString();
    const result = sessionQueries.create.run(title, createdAt);
    return {
      id: result.lastInsertRowid,
      title,
      createdAt
    };
  },

  deleteSession: (id) => {
    return sessionQueries.delete.run(id);
  },

  // Message operations
  getMessagesBySession: (sessionId) => {
    return messageQueries.getAllBySession.all(sessionId);
  },

  createMessage: (sessionId, text, sender = 'user') => {
    const createdAt = new Date().toISOString();
    const result = messageQueries.create.run(sessionId, text, sender, createdAt);
    return {
      id: result.lastInsertRowid,
      sessionId,
      text,
      sender,
      createdAt
    };
  },

  deleteMessage: (id) => {
    return messageQueries.delete.run(id);
  },

  // Close database connection
  close: () => {
    db.close();
  }
};

