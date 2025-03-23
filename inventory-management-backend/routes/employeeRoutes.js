const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { checkLicenseKey, authenticate } = require('../middleware/auth');

// Áp dụng middleware cho tất cả các route
router.use(checkLicenseKey);

// Lấy danh sách nhân viên
router.get('/', employeeController.getEmployees);

// Thêm nhân viên mới (yêu cầu xác thực admin)
router.post('/', authenticate, employeeController.addEmployee);

// Thêm công việc cho nhân viên
router.post('/:id/tasks', employeeController.addTaskToEmployee);

// Xoá nhân viên
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;