const Test = require('../models/Test');
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// Get All Tests
exports.getTests = async (req, res) => {
  const tests = await Test.find({});
  res.json(tests);
};

// Get Questions for a Specific Test
exports.getQuestions = async (req, res) => {
  const testId = req.params.id;
  const questions = await Question.find({ testId });
  res.json(questions);
};

// Submit Test
exports.submitTest = async (req, res) => {
  const { testId, selections } = req.body;

  const submission = await Submission.create({
    userId: req.user._id,
    testId,
    selections,
    endedAt: Date.now(),
  });

  res.status(201).json({ message: 'Test submitted successfully' });
};
