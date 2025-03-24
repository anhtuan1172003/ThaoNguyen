const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkLicenseKey, authenticateEmployee, authenticate } = require('../middleware/auth');

// // Áp dụng middleware cho các route cần xác thực
// router.use(checkLicenseKey);

// Lấy danh sách đơn hàng
router.get('/', checkLicenseKey, orderController.getOrders);

// Lấy danh sách đơn hàng theo nhân viên (phải đặt trước route /:id)
router.get('/employee', checkLicenseKey, authenticateEmployee, orderController.getOrdersByEmployee);

// Tạo đơn hàng mới bởi admin (yêu cầu xác thực admin)
router.post('/admin', checkLicenseKey, authenticate, orderController.createOrderByAdmin);

// Tạo đơn hàng mới (yêu cầu xác thực nhân viên)
router.post('/', checkLicenseKey, authenticateEmployee, orderController.createOrderByEmployee);

// Cập nhật đơn hàng (yêu cầu xác thực nhân viên)
router.put('/:id', checkLicenseKey, authenticate, orderController.updateOrder);

// Lấy chi tiết đơn hàng theo ID (public route - đặt sau các route cụ thể)
router.get('/:id', orderController.getOrderById);

module.exports = router;