
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// ✅ Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// ✅ SQLite DB setup
const db = new sqlite3.Database('./user.db', (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');

    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    // ✅ Create journals table
    db.run(`
      CREATE TABLE IF NOT EXISTS journals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }
});

// ✅ SignUp
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to create user' });
        res.json({ message: 'User registered successfully', user_id: this.lastID });
      }
    );
  });
});

// ✅ SignIn
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist. Please sign up first.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', name: user.name, user_id: user.id });
  });
});

// ✅ Add Journal Entry (append only)
app.post('/api/journals', (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) {
    return res.status(400).json({ error: 'User ID and content required' });
  }

  db.run(
    'INSERT INTO journals (user_id, content) VALUES (?, ?)',
    [user_id, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, user_id, content });
    }
  );
});

// ✅ Get Journals for a User
app.get('/api/journals/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.all(
    'SELECT * FROM journals WHERE user_id = ? ORDER BY timestamp DESC',
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ✅ Gemini AI Chat
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: 'v1beta' });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: message }] }],
    });

    const response = await result.response.text();
    res.json({ reply: response });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message || error);
    res.status(500).json({ error: 'Failed to connect to Gemini API' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
