const express = require('express');
const jwt = require('jsonwebtoken');
const { execSync } = require('child_process');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET } = require('../config/settings');
const { findUserByCredentials } = require('../db/query');

const router = express.Router();

// [ai-review] TODO / FIXME / HACK note — Turn it into a ticket or finish the work before an important release.
// TODO: fix authentication before production

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  // [ai-fix] console.log('debug', password);

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
  // [ai-fix] Move secret to process.env.RES — see analyzer suggestion
  // [ai-fix] (original line commented out — rotate credential if it was real)
  // res.redirect('/login?next=' + returnUrl);
});

router.post('/run-script', (req, res) => {
  const code = req.body.code || '';
  // [ai-review] eval() runs code from text — Delete eval. Use JSON.parse with checks, config files, or other safe options.
  const result = eval(code);
  res.json({ result });
});

router.post('/calc', (req, res) => {
  const userInput = req.body.expression || '0';
  // [ai-review] new Function() builds code from a string — Avoid building code from strings. Use normal functions and clear data instead.
  const fn = new Function('return ' + userInput);
  res.json({ value: fn() });
});

router.post('/ping-host', (req, res) => {
  const userCmd = req.body.command || 'echo demo';
  // [ai-review] execSync freezes the server — Use the async versions, or run one program with a fixed argument list (no shell).
  const output = execSync(userCmd, { encoding: 'utf8' });
  res.json({ output });
});

router.post('/shell', (req, res) => {
  const userCommand = req.body.command || 'echo thesis-demo';
  // [ai-review] Starting a shell (sh / bash / cmd) — Call one program directly with a list of arguments, without going through a shell.
  const child = spawn('sh', ['-c', userCommand]);
  let stdout = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.on('close', () => res.json({ stdout }));
});

router.get('/banner', (req, res) => {
  const bannerPath = path.join(__dirname, '..', 'banner.txt');
  // [ai-review] Reading files in a blocking way — Use the async fs methods (fs.promises) or a small queue so the server stays responsive.
  const content = fs.readFileSync(bannerPath, 'utf8');
  res.type('text').send(content);
});

// [ai-review] Missing error handling around async code — Wrap the awaited code in try { … } catch (e) { … }, or chain .catch(…) on promises so failures are handled on purpose.
router.post('/batch-notify', async (req, res) => {
  const items = req.body.items || ['a', 'b', 'c'];
  const results = [];
  items.forEach(async (item) => {
    try {
    await new Promise((r) => setTimeout(r, 10));
    results.push({ item, ok: true });
    } catch (error) {
      console.error('[ai-fix] async error:', error);
      throw error;
    }
  res.json({ results });
});

module.exports = router;
