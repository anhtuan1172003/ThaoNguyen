const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { checkLicenseKey } = require('../middleware/auth');

// Áp dụng middleware cho tất cả các route
router.use(checkLicenseKey);

// Lấy danh sách sản phẩm
router.get('/', productController.getProducts);

// Thêm sản phẩm mới
router.post('/', productController.addProduct);

// Cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;