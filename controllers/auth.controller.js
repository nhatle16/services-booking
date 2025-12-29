const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

require('dotenv').config({ path: '../.env'});

const createToken = (user) => {
  return jwt.sign(
    {
    id: user._id,
    role: user.role
    },
    process.env.JWT_SECRET,
  );
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Information validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use."
      });
    }

    // Create new user
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash
    });

    // Generate user's token
    const token = createToken(newUser);

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Information validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Validate password (with bcrypt module)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate user's token
    const token = createToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

const logoutUser = async (req, res) => {
  try {
    // Just simply logout on client side
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser
}