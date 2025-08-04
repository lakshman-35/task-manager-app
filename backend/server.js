const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { router: taskRoutes, initializeRouter } = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key-here';
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'taskmate'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL (taskmate DB)');
    createTokensTable();
  }
});


const createTokensTable = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME DEFAULT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  db.query(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating tokens table:', err);
    } else {
      console.log('Tokens table ready');
    }
  });
};


const generateToken = (userId) => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24h
  };
  return jwt.sign(payload, JWT_SECRET);
};


const storeToken = (userId, token) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sql = 'INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(sql, [userId, token, expiresAt], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


app.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [fullName, email, hashedPassword], (err) => {
      if (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }
      res.status(201).json({ message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUserSQL = 'SELECT * FROM users WHERE email = ?';
    db.query(findUserSQL, [email], async (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken(user.id);
      try {
        await storeToken(user.id, token);
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email
          }
        });
      } catch (tokenError) {
        console.error('Token storage error:', tokenError);
        res.status(500).json({ message: 'Login failed' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const checkTokenSQL = 'SELECT * FROM tokens WHERE token = ? AND is_active = TRUE AND expires_at > NOW()';
    db.query(checkTokenSQL, [token], (err, results) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(500).json({ message: 'Token verification failed' });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Profile route
app.get('/profile', verifyToken, (req, res) => {
  const sql = 'SELECT id, full_name, email FROM users WHERE id = ?';
  db.query(sql, [req.userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: results[0] });
  });
});

// Logout
app.post('/logout', verifyToken, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const deactivateTokenSQL = 'UPDATE tokens SET is_active = FALSE WHERE token = ?';
  db.query(deactivateTokenSQL, [token], (err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Initialize task routes with database and middleware
initializeRouter(db, verifyToken);

// Use task routes
app.use('/tasks', taskRoutes);

// Start server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
