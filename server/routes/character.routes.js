const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createCharacter, getMyCharacter } = require('../controllers/character.controller');

router.post('/', protect, createCharacter);
router.get('/me', protect, getMyCharacter);

module.exports = router;
