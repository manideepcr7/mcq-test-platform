const cron = require('node-cron');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const evaluateTests = async () => {
  const submissions = await Submission.find({ evaluated: false });

  for (const submission of submissions) {
    let score = 0;
    for (const selection of submission.selections) {
      const question = await Question.findById(selection.questionId);
      if (selection.answer === question.correctOption) {
        score++;
      }
    }

    submission.score = score;
    submission.evaluated = true;
    await submission.save();

    const user = await User.findById(submission.userId);
    sendEmail(user.email, score, user.name);
  }
};

const sendEmail = (to, score, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'Your Test Score',
    text: `Hi ${name},\n\nYou scored ${score} out of 10 in your recent test.\n\nBest regards,\nTest Platform Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const cronJob = cron.schedule('0 * * * *', evaluateTests);

module.exports = cronJob;
