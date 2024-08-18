const express = require('express');
const { getTests, getQuestions, submitTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getTests);
router.get('/:id/questions', protect, getQuestions);
router.post('/submit', protect, submitTest);

module.exports = router;
