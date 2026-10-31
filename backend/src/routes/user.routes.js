const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { pool } = require('../server');

// Add user to tenant
router.post('/:tenantId/users', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email, password, role } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (id, tenant_id, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, tenantId, email, hashedPassword, role || 'user', 'active']
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get tenant users
router.get('/:tenantId/users', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE tenant_id = $1', [tenantId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET role = COALESCE($1, role), status = COALESCE($2, status) WHERE id = $3 RETURNING *',
      [role, status, userId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
