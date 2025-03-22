require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema cho cửa hàng
const storeSchema = new mongoose.Schema({
  name: String,
  licenseKey: String,
  licenseStatus: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  adminAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

const Store = mongoose.model('Store', storeSchema);

// Schema cho admin
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
});

const Admin = mongoose.model('Admin', adminSchema);

// Schema cho nhân viên
const employeeSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const Employee = mongoose.model('Employee', employeeSchema);

// Schema cho sản phẩm
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  status: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
});

const Product = mongoose.model('Product', productSchema);

// Schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  customerPhone: String,
  machineType: String,
  errorDescription: String,
  initialStatus: String,
  price: Number,
  orderStatus: {
    type: String,
    enum: ['not completed', 'completed'],
    default: 'not completed'
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

const Order = mongoose.model('Order', orderSchema);

// Middleware kiểm tra bản quyền
// const checkLicenseKey = async (req, res, next) => {
//   try {
//     const { licenseKey } = req.headers['licensekey'];

//     if (!licenseKey) {
//       console.log('License Key Missing');
//       return res.status(401).json({ error: 'Thiếu key bản quyền' });
//     }
//     console.log('License Key Received:', licensekey);

//     const store = await Store.findOne({ licenseKey: licenseKey });
//     console.log('Store Found:', store);

//     if (!store || store.licenseStatus !== 'active') {
//       console.log('License Key Invalid or Expired');
//       return res.status(403).json({ error: 'Key bản quyền không hợp lệ hoặc đã hết hạn' });
//     }

//     req.store = store;
//     next();
//   } catch (err) {
//     console.error('Middleware error:', err.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const checkLicenseKey = async (req, res, next) => {
  try {
    const licenseKey = req.headers['licensekey'] || req.headers['licenseKey'];

    if (!licenseKey) {
      return res.status(401).json({ error: 'Thiếu key bản quyền' });
    }

    const store = await Store.findOne({ licenseKey: licenseKey });

    if (!store || store.licenseStatus !== 'active') {
      return res.status(403).json({ error: 'Key bản quyền không hợp lệ hoặc đã hết hạn' });
    }

    req.store = store;
    next();
  } catch (err) {
    console.error('Middleware error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// app.use(checkLicenseKey);
app.use('/products', checkLicenseKey);
app.use('/employees', checkLicenseKey);
app.use('/orders', checkLicenseKey);

// app.use('/products', checkLicenseKey); // Áp dụng middleware cho tất cả route trong /products

const authenticateEmployee = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Thiếu token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employeeId = decoded.employeeId; // Gán employeeId vào req
    req.storeId = decoded.storeId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Thiếu token' });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    req.storeId = decoded.storeId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token không hợp lệ' });
  }
};

// API lấy danh sách sản phẩm theo cửa hàng
app.get('/products', (req, res) => {
  Product.find({ store: req.store._id })
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API thêm sản phẩm
app.post('/products', (req, res) => {
  const newProduct = new Product({
    ...req.body,
    store: req.store._id
  });

  newProduct.save()
    .then(product => res.json(product))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API cập nhật sản phẩm theo ID
app.put('/products/:id', (req, res) => {
  Product.findOneAndUpdate({ _id: req.params.id, store: req.store._id }, req.body, { new: true })
    .then(updatedProduct => res.json(updatedProduct))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API xóa sản phẩm theo ID
app.delete('/products/:id', (req, res) => {
  Product.findOneAndDelete({ _id: req.params.id, store: req.store._id })
    .then(() => res.json({ message: 'Xóa sản phẩm thành công' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API lấy danh sách nhân viên theo cửa hàng
app.get('/employees', (req, res) => {
  Employee.find({ store: req.store._id })
    .then(employees => res.json(employees))
    .catch(err => res.status(500).json({ error: err.message }));
});

// API thêm nhân viên
// app.post('/employees', (req, res) => {
//   const newEmployee = new Employee({
//     ...req.body,
//     store: req.store._id
//   });

//   newEmployee.save()
//     .then(employee => res.json(employee))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

app.post('/employees', authenticate, async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const storeId = req.storeId; // Lấy storeId từ token

    if (!storeId) {
      return res.status(400).json({ error: 'Không xác định được storeId' });
    }

    // Kiểm tra username trùng
    const existingUser = await Employee.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    // Kiểm tra store có hợp lệ không
    const store = await Store.findById(storeId);
    if (!store || store.licenseStatus !== 'active') {
      return res.status(403).json({ error: 'Cửa hàng không hợp lệ hoặc license đã hết hạn' });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo nhân viên mới
    const newEmployee = new Employee({
      name,
      username,
      password: hashedPassword,
      role,
      store: storeId
    });

    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API thêm công việc cho nhân viên
app.post('/employees/:id/tasks', (req, res) => {
  Employee.findOne({ _id: req.params.id, store: req.store._id })
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ error: 'Nhân viên không tồn tại trong cửa hàng này' });
      }

      employee.tasks.push(req.body);
      employee.save()
        .then(updatedEmployee => res.json(updatedEmployee))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// API tạo đơn hàng bởi nhân viên
app.post('/orders', authenticateEmployee, async (req, res) => {
  try {
    const { customerPhone, machineType, errorDescription, initialStatus, price } = req.body;

    const newOrder = new Order({
      customerPhone,
      machineType,
      errorDescription,
      initialStatus,
      price,
      store: req.storeId,
      createdBy: req.employeeId // Lấy từ token
    });

    const savedOrder = await newOrder.save();

    // Thêm order vào danh sách công việc của nhân viên
    await Employee.findOneAndUpdate(
      { _id: req.employeeId },
      { $push: { tasks: savedOrder._id } }
    );

    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API cập nhật trạng thái đơn hàng
// app.put('/orders/:id', (req, res) => {
//   Order.findOneAndUpdate({ _id: req.params.id, store: req.store._id }, req.body, { new: true })
//     .then(updatedOrder => res.json(updatedOrder))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

app.put('/orders/:id', authenticateEmployee, async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, store: req.storeId, createdBy: req.employeeId },
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(403).json({ error: 'Bạn không có quyền cập nhật đơn hàng này' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm route đăng nhập
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm admin account
    const admin = await Admin.findOne({ email })
      .populate('store'); // Populate để lấy thông tin store kèm licenseKey

    if (!admin) {
      return res.status(401).json({ error: 'Email không tồn tại' });
    }

    // So sánh mật khẩu mà người dùng nhập vào với mật khẩu đã lưu (plain text)
    if (password !== admin.password) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    // Kiểm tra store và license status
    if (!admin.store || admin.store.licenseStatus !== 'active') {
      return res.status(403).json({ error: 'Store không tồn tại hoặc license đã hết hạn' });
    }

    // Tạo JWT token
    let token = jwt.sign(
      { 
        adminId: admin._id,
        storeId: admin.store._id,
        licenseKey: admin.store.licenseKey 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    // Đặt header chứa licenseKey
    res.set('licenseKey', admin.store.licenseKey);

    // Trả về thông tin cần thiết
    res.json({
      token,
      licenseKey: admin.store.licenseKey,
      storeName: admin.store.name
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/employee-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm nhân viên theo username
    const employee = await Employee.findOne({ username }).populate('store');

    if (!employee) {
      return res.status(401).json({ error: 'Tên đăng nhập không tồn tại' });
    }

    // So sánh mật khẩu
    const isValidPassword = await bcrypt.compare(password, employee.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    // Kiểm tra store
    if (!employee.store || employee.store.licenseStatus !== 'active') {
      return res.status(403).json({ error: 'Cửa hàng không tồn tại hoặc license đã hết hạn' });
    }

    // Tạo token
    const token = jwt.sign(
      { employeeId: employee._id, storeId: employee.store._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, employeeName: employee.name, storeName: employee.store.name });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
