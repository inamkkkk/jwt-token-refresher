const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

let refreshTokens = [];

const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: 'Cannot find user' });
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken({ username: user.username, id: user._id });
      const refreshToken = generateRefreshToken({ username: user.username, id: user._id });
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username, id: user.id });
    res.json({ accessToken: accessToken });
  });
};

const logout = (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};