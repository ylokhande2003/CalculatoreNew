require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/cuser'); // Import User model
const Log = require('./models/Log'); // Import Log model
const Sequence = require('./models/Sequence'); // Import Sequence model
const authRoutes = require('./routes/auth');
const logRoutes= require('./routes/logs') // Import auth routes
const authenticateToken = require('./middleware/auth'); // Import auth middleware

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes)

// Function to get the next sequence value
// const getNextSequenceValue = async (sequenceName) => {
//   const sequence = await Sequence.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );
//   return sequence.sequence_value;
// };

// // Protected Routes Below
// // Get all logs (protected)
// app.get('/api/logs', authenticateToken, async (req, res) => {
//   try {
   
    
//     const logs = await Log.find().sort({ createdOn: -1 });
   
//     // Map logs to format 'createdOn' and convert 'isValid' to 'Yes'/'No'
//     const formattedLogs = logs.map(log => ({
//       ...log._doc,
//       createdOn: log.createdOn.toISOString().split('T')[0],
//       isValid: log.isValid ? 'Yes' : 'No'
//     }));
   

//     res.json(formattedLogs);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching logs', error: err });
//   }
// });

// // Delete logs (protected)
app.delete('/api/logs', authenticateToken, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const result = await Log.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Logs deleted successfully', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting logs', error: err });
  }
});

// Add a new log (protected)
// app.post('/api/logs', authenticateToken, async (req, res) => {
//   const { expression, isValid, output } = req.body;

//   if (typeof expression !== 'string' || typeof isValid !== 'boolean' || (output !== null && typeof output !== 'number')) {
//     return res.status(400).json({ message: 'Invalid input' });
//   }

//   try {
//     const nextId = await getNextSequenceValue('logId');

//     const logEntry = new Log({
//       _id: nextId,
//       expression,
//       isValid,
//       output,
//     });

//     await logEntry.save();
//     res.status(201).json(logEntry);
//   } catch (err) {
//     res.status(500).json({ message: 'Error saving log', error: err });
//   }
// });

// Profile Routes (Protected)
// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  const { email_address } = req.query;
  try {
    const user = await User.findOne({ email: email_address.toLowerCase() }).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { email_address } = req.query;
  const updateData = { ...req.body };

  // Handle password update if present
  if (updateData.password) {
    if (updateData.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    try {
      updateData.password = await bcrypt.hash(updateData.password, 10); // Hash password
    } catch (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }
  }

  // Add validation checks if necessary (e.g., for email or age)
  if (!updateData.email || !updateData.firstName || !updateData.lastName) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    // Find and update the user by email
    const updatedUser = await User.findOneAndUpdate(
      { email: email_address.toLowerCase() }, // Match the email
      {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email.toLowerCase(), // Ensure email is lowercased
        password: updateData.password, // If password is updated
        age: updateData.age,
        homeAddress: updateData.homeAddress,
        primaryColor: updateData.primaryColor || '#000000', // Default if not provided
        secondaryColor: updateData.secondaryColor || '#000000', // Default if not provided
        logo: updateData.logo, // Logo update
      },
      { new: true, runValidators: true, context: 'query' } // Return the updated document
    ).select('-password'); // Exclude password from response

    // If user is not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated user data (excluding password)
    res.json(updatedUser);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
});


// Logout Route (Optional)
app.post('/api/logout', authenticateToken, (req, res) => {
  // console.log("hii");
  
  res.json({ message: 'Logged out successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
