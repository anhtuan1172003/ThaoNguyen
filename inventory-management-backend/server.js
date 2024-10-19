require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  status: String
});

const Product = mongoose.model('Product', productSchema);

// Định nghĩa schema cho nhân viên và công việc
const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  tasks: [{ description: String, status: String }]
});

const Employee = mongoose.model('Employee', employeeSchema);

// API để lấy danh sách sản phẩm
app.get('/products', (req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API để thêm sản phẩm
app.post('/products', (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save()
    .then(product => res.json(product))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API để lấy danh sách nhân viên
app.get('/employees', (req, res) => {
  Employee.find()
    .then(employees => res.json(employees))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API để thêm công việc cho nhân viên
app.post('/employees/:id/tasks', (req, res) => {
  Employee.findById(req.params.id)
    .then(employee => {
      employee.tasks.push(req.body);
      employee.save()
        .then(updatedEmployee => res.json(updatedEmployee))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// API để cập nhật sản phẩm theo ID
app.put('/products/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedProduct => res.json(updatedProduct))
      .catch(err => res.status(500).json({ error: err.message }));
  });

// API để xóa sản phẩm theo ID
app.delete('/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
      .then(() => res.json({ message: 'Product deleted successfully' }))
      .catch(err => res.status(500).json({ error: err.message }));
  });

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});