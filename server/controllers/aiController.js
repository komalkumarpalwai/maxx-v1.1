const Test = require('../models/Test');
const { logAction } = require('./auditLogController');




// Placeholder for AI question generation
const generateAIQuestions = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'AI question generation is currently disabled. Please contact the administrator or try again later.'
  });
};

module.exports = {
  generateAIQuestions
};
