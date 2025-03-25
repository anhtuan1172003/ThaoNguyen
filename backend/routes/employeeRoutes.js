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

// Cập nhật thông tin nhân viên (yêu cầu xác thực admin)
router.put('/:id', authenticate, employeeController.updateEmployee);

// Thêm công việc cho nhân viên
router.post('/:id/tasks', employeeController.addTaskToEmployee);

// Cập nhật trạng thái nhân viên
router.patch('/:id/status', authenticate, employeeController.updateEmployeeStatus);

module.exports = router;