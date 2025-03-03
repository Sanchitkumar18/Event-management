const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwt_secret = "dance123";
const fetchuser = require('../middleware/fetchusers');
const { body, validationResult } = require('express-validator');

//Route-1: Register a User (Organizer or Attendee)  POST-"/api/auth/createuser" - No Login Required
router.post(
  '/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('role', 'Role must be either "organizer" or "attendee"').isIn(['organizer', 'attendee'])
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create new user with role
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        role: req.body.role
      });

      const data = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      const authtoken = jwt.sign(data, jwt_secret);
      success = true;
      res.json({ success, authtoken });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success, error: 'Internal Server Error' });
    }
  }
);

//Route-2: Login a User POST-"/api/auth/login"- No Login Required
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const data = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      const authtoken = jwt.sign(data, jwt_secret);
      success = true;
      res.json({ success, authtoken });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

//Route-3: Get User Details POST-"/api/auth/getuser"- Login Required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
