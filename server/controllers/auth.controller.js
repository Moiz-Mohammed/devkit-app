const bcrypt    = require('bcryptjs');
const { z }     = require('zod');
const prisma    = require('../utils/prisma');
const { createTokenPair, verifyRefresh } = require('../utils/jwt');

// ─── Validation schemas ────────────────────────────────────────────────────
const signupSchema = z.object({
  email:    z.string().email('Invalid email'),
  username: z.string()
              .min(3, 'Username must be at least 3 characters')
              .max(20, 'Username too long')
              .regex(/^[a-zA-Z0-9_-]+$/, 'Username: letters, numbers, _ and - only'),
  password: z.string()
              .min(8, 'Password must be at least 8 characters')
              .regex(/[A-Z]/, 'Password needs an uppercase letter')
              .regex(/\d/, 'Password needs a number'),
});

const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

// ─── Helper: sanitise user for response ───────────────────────────────────
const sanitiseUser = (user) => ({
  id:        user.id,
  email:     user.email,
  username:  user.username,
  isAdmin:   user.isAdmin,
  createdAt: user.createdAt,
  character: user.character ?? null,
  xp:        user.xp ?? null,
  streak:    user.streak ?? null,
});

// ─── POST /api/auth/signup ─────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const { email, username, password } = parsed.data;

    // Check uniqueness
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      return res.status(409).json({ error: `That ${field} is already taken` });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Create user with initial XP and streak in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          username,
          passwordHash,
          xp: {
            create: { totalXP: 0, level: 1, xpToNext: 100 },
          },
          streak: {
            create: { currentStreak: 0, longestStreak: 0 },
          },
        },
        include: { xp: true, streak: true, character: { include: { class: true } } },
      });
      return newUser;
    });

    const tokens = createTokenPair(user);

    res.status(201).json({
      user: sanitiseUser(user),
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { xp: true, streak: true, character: { include: { class: true } } },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update streak last active
    await prisma.streak.update({
      where: { userId: user.id },
      data:  { lastActiveAt: new Date() },
    });

    const tokens = createTokenPair(user);
    res.json({ user: sanitiseUser(user), ...tokens });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/refresh ────────────────────────────────────────────────
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    let payload;
    try {
      payload = verifyRefresh(refreshToken);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { xp: true, streak: true, character: { include: { class: true } } },
    });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = createTokenPair(user);
    res.json({ user: sanitiseUser(user), ...tokens });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ──────────────────────────────────────────────────────
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { xp: true, streak: true, character: { include: { class: true } } },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: sanitiseUser(user) });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ─────────────────────────────────────────────────
const logout = async (req, res) => {
  // Stateless JWT — client clears tokens
  // In future: add token blacklist via Redis
  res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, refresh, me, logout };
