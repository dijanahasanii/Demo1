const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/settings');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const publicDir = path.join(__dirname, '..', 'public');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/info', (req, res) => {
  res.json({
    name: 'SecureBank API',
    version: '0.1.0-demo',
    note: 'Thesis security demo — intentionally vulnerable',
    endpoints: {
      login: 'POST /api/auth/login',
      me: 'GET /api/users/me',
      user: 'GET /api/users/:id',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`SecureBank API demo listening on http://localhost:${PORT}`);
});
