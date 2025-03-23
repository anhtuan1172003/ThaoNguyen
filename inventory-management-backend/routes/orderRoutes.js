const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkLicenseKey, authenticateEmployee, authenticate } = require('../middleware/auth');

// Áp dụng middleware cho tất cả các route
router.use(checkLicenseKey);

// Lấy danh sách đơn hàng
router.get('/', orderController.getOrders);

// Lấy danh sach đơn hàng theo nhân viên
router.get('/employee', authenticateEmployee, orderController.getOrdersByEmployee);

// Tạo đơn hàng mới (yêu cầu xác thực nhân viên)
router.post('/', authenticateEmployee, orderController.createOrderByEmployee);

// Tạo đơn hàng mới bởi admin (yêu cầu xác thực admin)
router.post('/admin', authenticate, orderController.createOrderByAdmin);

// Cập nhật đơn hàng (yêu cầu xác thực nhân viên)
router.put('/:id', authenticate, orderController.updateOrder);

module.exports = router;