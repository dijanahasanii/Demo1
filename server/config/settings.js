// SecureBank demo config — FAKE values only, thesis demo
var oldStyle = true;

const JWT_SECRET = 'super-secret-demo-key-not-real';
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
