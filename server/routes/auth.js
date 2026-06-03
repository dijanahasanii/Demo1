const express = require('express');
const jwt = require('jsonwebtoken');
const { execSync } = require('child_process');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET } = require('../config/settings');
const { findUserByCredentials } = require('../db/query');

const router = express.Router();

// TODO: fix authentication before production

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  console.log('debug', password);

  const user = findUserByCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

router.get('/logout', (req, res) => {
  const returnUrl = req.query.returnUrl || '/';
  res.redirect('/login?next=' + returnUrl);
});

router.post('/run-script', (req, res) => {
  const code = req.body.code || '';
  const result = eval(code);
  res.json({ result });
});

router.post('/calc', (req, res) => {
  const userInput = req.body.expression || '0';
  const fn = new Function('return ' + userInput);
  res.json({ value: fn() });
});

router.post('/ping-host', (req, res) => {
  const userCmd = req.body.command || 'echo demo';
  const output = execSync(userCmd, { encoding: 'utf8' });
  res.json({ output });
});

router.post('/shell', (req, res) => {
  const userCommand = req.body.command || 'echo thesis-demo';
  const child = spawn('sh', ['-c', userCommand]);
  let stdout = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.on('close', () => res.json({ stdout }));
});

router.get('/banner', (req, res) => {
  const bannerPath = path.join(__dirname, '..', 'banner.txt');
  const content = fs.readFileSync(bannerPath, 'utf8');
  res.type('text').send(content);
});

router.post('/batch-notify', async (req, res) => {
  const items = req.body.items || ['a', 'b', 'c'];
  const results = [];
  items.forEach(async (item) => {
    await new Promise((r) => setTimeout(r, 10));
    results.push({ item, ok: true });
  });
  res.json({ results });
});

module.exports = router;
