const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/users',       require('./routes/user.routes'));
app.use('/api/characters',  require('./routes/character.routes'));
app.use('/api/quests',      require('./routes/quest.routes'));
app.use('/api/weapons',     require('./routes/weapon.routes'));
app.use('/api/resources',   require('./routes/resource.routes'));
app.use('/api/skill-tree',  require('./routes/skillTree.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/duels',       require('./routes/duel.routes'));
app.use('/api/challenges',  require('./routes/challenge.routes'));
app.use('/api/subjects',    require('./routes/subject.routes'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => console.log(`🚀 DEVKIT API running on port ${PORT}`));

module.exports = app;
