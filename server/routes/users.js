const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/settings');
const { getUserById, listUsers } = require('../db/query');

const router = express.Router();

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/me', authMiddleware, (req, res) => {
  const row = getUserById(req.user.sub);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ id: row.id, username: row.username, role: row.role });
});

router.get('/:id', authMiddleware, async (req, res) => {
  const row = getUserById(req.params.id);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ id: row.id, username: row.username, role: row.role });
});

router.get('/', authMiddleware, (req, res) => {
  res.json({ users: listUsers() });
});

router.post('/import', authMiddleware, async (req, res) => {
  try {
    const payload = req.body.data;
    await Promise.resolve(JSON.parse(payload));
    res.json({ imported: true });
  } catch (e) {
  }
  res.json({ imported: false });
});

router.get('/health/async', async (req, res) => {
  await new Promise((r) => setTimeout(r, 5));
  res.json({ status: 'ok', service: 'SecureBank API' });
});

module.exports = router;
