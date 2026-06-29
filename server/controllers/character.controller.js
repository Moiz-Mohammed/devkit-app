const prisma = require('../utils/prisma');

const createCharacter = async (req, res, next) => {
  try {
    const { classSlug, onboardingAnswers } = req.body;
    const userId = req.user.id;

    if (!classSlug) {
      return res.status(400).json({ error: 'Class selection is required' });
    }

    // Check if character already exists for this user
    const existing = await prisma.character.findUnique({
      where: { userId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Character already created' });
    }

    // Find the CareerClass
    const careerClass = await prisma.careerClass.findUnique({
      where: { slug: classSlug }
    });

    if (!careerClass) {
      return res.status(404).json({ error: `Career class '${classSlug}' not found` });
    }

    // Create the character
    const character = await prisma.character.create({
      data: {
        userId,
        classId: careerClass.id,
        evolutionStage: 1 // Recruit stage
      },
      include: {
        class: true
      }
    });

    // Optionally: Store onboarding answers in user settings or a logs table if needed in the future

    res.status(201).json({ character });
  } catch (err) {
    next(err);
  }
};

const getMyCharacter = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const character = await prisma.character.findUnique({
      where: { userId },
      include: { class: true }
    });

    if (!character) {
      return res.status(404).json({ error: 'No character found for this user' });
    }

    res.json({ character });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCharacter, getMyCharacter };
