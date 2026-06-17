import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to bundle user IDs into secure JWTs valid for 7 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new platform user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  // 1. EXTRACT ALL FIELDS (Including the new name parameter)
  const { name, email, password } = req.body;

  try {
    // 2. CHECK ALL MANDATORY FIELDS
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required credentials' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Identity registration conflict encountered' });
    }

    // 3. PERSIST THE RECORD WITH THE NAME PARAMETER
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    // Logging the actual error on your server console window will help you track future validation hiccups easily
    console.error('[Registration Engine Crash]:', error);
    return res.status(500).json({ message: 'Internal server error during user ingestion' });
  }
};

// @desc    Authenticate credentials and issue token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password structures' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    }

    return res.status(401).json({ message: 'Invalid dynamic authentication context signature matching' });
  } catch (error) {
    console.error('[Login Engine Crash]:', error);
    return res.status(500).json({ message: 'Internal engine authentication lifecycle disruption' });
  }
};