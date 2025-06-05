require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ======================
// DATABASE HELPERS
// ======================
const DB_PATH = path.join(__dirname, 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeUsers(users) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

// ======================
// ROUTES
// ======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/transfer', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'transfer.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsers();
  
  if (!users[email] || !(await bcrypt.compare(password, users[email].password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  req.session.user = users[email];
  res.json({ success: true, redirect: '/dashboard' });
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const users = await readUsers();
  
  if (users[email]) {
    return res.json({ success: false, message: 'Email exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[email] = { name, password: hashedPassword, balance: 1000 };
  
  await writeUsers(users);
  req.session.user = users[email];
  res.json({ success: true, redirect: '/dashboard' });
});

app.get('/user-data', (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });
  res.json({ user: req.session.user });
});

app.post('/transfer', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });
  
  const { recipient, amount } = req.body;
  const users = await readUsers();
  
  // Validate
  if (!users[recipient]) {
    return res.json({ success: false, message: 'Recipient not found' });
  }
  if (users[req.session.user.email].balance < amount) {
    return res.json({ success: false, message: 'Insufficient funds' });
  }

  // Update balances
  users[req.session.user.email].balance -= amount;
  users[recipient].balance += amount;
  
  await writeUsers(users);
  req.session.user.balance = users[req.session.user.email].balance;
  res.json({ success: true });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});