const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { pool } = require('../server');

// Register tenant
router.post('/register-tenant', async (req, res) => {
  const { tenantName, adminEmail, adminPassword } = req.body;
  try {
    const tenantId = uuidv4();
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = uuidv4();
    
    // Insert tenant
    await pool.query(
      'INSERT INTO tenants (id, name, subdomain, status) VALUES ($1, $2, $3, $4)',
      [tenantId, tenantName, tenantName.toLowerCase(), 'active']
    );
    
    // Insert admin user
    await pool.query(
      'INSERT INTO users (id, tenant_id, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, tenantId, adminEmail, hashedPassword, 'admin', 'active']
    );
    
    res.json({ success: true, tenantId, userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );
    
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
