const Product = require('../models/Product');

// Lấy danh sách sản phẩm theo cửa hàng
const getProducts = (req, res) => {
  Product.find({ store: req.store._id })
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Thêm sản phẩm mới
const addProduct = (req, res) => {
  const newProduct = new Product({
    ...req.body,
    store: req.store._id
  });

  newProduct.save()
    .then(product => res.json(product))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Cập nhật sản phẩm theo ID
const updateProduct = (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.id, store: req.store._id }, 
    req.body, 
    { new: true }
  )
    .then(updatedProduct => res.json(updatedProduct))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Xóa sản phẩm theo ID
const deleteProduct = (req, res) => {
  Product.findOneAndDelete({ _id: req.params.id, store: req.store._id })
    .then(() => res.json({ message: 'Xóa sản phẩm thành công' }))
    .catch(err => res.status(500).json({ error: err.message }));
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};