const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authenticateToken = require('../middleware/auth');
const Sequence = require('../models/Sequence');

// Add a new log (protected)
// Add a new log (protected)
const getNextSequenceValue = async (sequenceName) => {
    const sequence = await Sequence.findByIdAndUpdate(
      sequenceName,
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return sequence.sequence_value;
  };
router.post('/', authenticateToken, async (req, res) => {
    const { expression, isValid, output } = req.body;
  
    if (typeof expression !== 'string' || typeof isValid !== 'boolean' || (output !== null && typeof output !== 'number')) {
      return res.status(400).json({ message: 'Invalid input' });
    }
    const nextId = await getNextSequenceValue('logId');
    try {
      const logEntry = new Log({
        _id:nextId,
        expression,
        isValid,
        output,
        user: req.user.id // Ensure this is correctly set
      });
  
      await logEntry.save();
      res.status(201).json(logEntry);
    } catch (err) {
      res.status(500).json({ message: 'Error saving log', error: err });
    }
  });
  
// Get all logs (protected)
router.get('/', authenticateToken, async (req, res) => {
    try {
      const logs = await Log.find({ user: req.user.id }).sort({ createdOn: -1 });
  
      // Map logs to format 'createdOn' and convert 'isValid' to 'Yes'/'No'
      const formattedLogs = logs.map(log => {
        const createdOn = log.createdOn instanceof Date ? log.createdOn : new Date(log.createdOn);
  
        return {
          ...log._doc,
          createdOn: createdOn.toISOString().split('T')[0],
          isValid: log.isValid ? 'Yes' : 'No'
        };
      });
  
      res.json(formattedLogs);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching logs', error: err });
    }
  });
  
  module.exports = router;