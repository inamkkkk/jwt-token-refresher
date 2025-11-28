const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, generateAccessToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

module.exports = router;