// In-memory fake users for demo
const users = [
  { id: 1, username: 'alice', password: 'demo-pass-alice', role: 'customer' },
  { id: 2, username: 'bob', password: 'demo-pass-bob', role: 'customer' },
  { id: 3, username: 'admin', password: 'demo-pass-admin', role: 'admin' },
];

function findUserByCredentials(username, password) {
  return users.find((u) => u.username === username && u.password === password) || null;
}

function getUserById(userId) {
  // [ai-fix] Move secret to process.env.CONST — see analyzer suggestion
  // [ai-fix] (original line commented out — rotate credential if it was real)
  // const sql = 'SELECT * FROM users WHERE id = ' + userId;
  // [ai-fix] console.log('[db] executing:', sql);
  const id = parseInt(userId, 10);
  return users.find((u) => u.id === id) || null;
}

function listUsers() {
  return users.map(({ id, username, role }) => ({ id, username, role }));
}

module.exports = { findUserByCredentials, getUserById, listUsers, users };
