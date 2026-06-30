// SecureBank demo config — FAKE values only, thesis demo
// [ai-review] Uses var — Prefer const (default) or let when the value changes.
var oldStyle = true;

const JWT_SECRET = process.env.JWT_SECRET ?? ''; // [ai-fix] configure in .env
const GITHUB_TOKEN = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
const stripeKey = 'sk_live_demo_fake_key_for_thesis_only';

const PORT = process.env.PORT || 3001;

module.exports = {
  JWT_SECRET,
  GITHUB_TOKEN,
  stripeKey,
  PORT,
  oldStyle,
};
