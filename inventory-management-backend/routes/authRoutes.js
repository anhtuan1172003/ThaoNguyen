const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route đăng nhập cho admin
router.post('/login', authController.adminLogin);

// Route đăng nhập cho nhân viên
router.post('/employee-login', authController.employeeLogin);

module.exports = router;