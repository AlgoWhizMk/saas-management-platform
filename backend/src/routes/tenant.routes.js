const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// Get tenant details
router.get('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tenant
router.put('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { name } = req.body;
    
    const result = await pool.query(
      'UPDATE tenants SET name = $1 WHERE id = $2 RETURNING *',
      [name, tenantId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all tenants (admin only)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
