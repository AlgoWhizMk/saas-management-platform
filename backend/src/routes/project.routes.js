const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { pool } = require('../server');

// Create project
router.post('/', async (req, res) => {
  try {
    const { tenantId, name, description } = req.body;
    const projectId = uuidv4();
    
    const result = await pool.query(
      'INSERT INTO projects (id, tenant_id, name, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [projectId, tenantId, name, description || '', 'active']
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE status = $1 ORDER BY created_at DESC', ['active']);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project
router.put('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    
    const result = await pool.query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name, description, projectId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    await pool.query('UPDATE projects SET status = $1 WHERE id = $2', ['deleted', projectId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
