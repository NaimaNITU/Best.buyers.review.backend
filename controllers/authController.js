const User = require('../models/User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ 
        email: email.trim().toLowerCase(),
        isActive: true 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Login successful for:', user.email);
      
      return res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error('💥 Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  getMe: async (req, res) => {
    try {
      return res.json({
        success: true,
        user: {
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      console.error('Get me error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = authController;