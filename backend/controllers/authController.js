const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Đăng nhập cho admin
const adminLogin = async (req, res) => {
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
      { expiresIn: '1h' }
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
};

// Đăng nhập cho nhân viên
const employeeLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm nhân viên theo username
    const employee = await Employee.findOne({ username }).populate('store');

    if (!employee) {
      return res.status(401).json({ error: 'Tên đăng nhập không tồn tại' });
    }

    // Kiểm tra trạng thái nhân viên
    if (!employee.isActive) {
      return res.status(403).json({ error: 'Tài khoản đã bị vô hiệu hóa' });
    }

    // Kiểm tra mật khẩu
    if (!password || !employee.password) {
      return res.status(401).json({ error: 'Thiếu thông tin đăng nhập' });
    }

    // So sánh mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    // Kiểm tra store
    if (!employee.store || employee.store.licenseStatus !== 'active') {
      return res.status(403).json({ error: 'Cửa hàng không tồn tại hoặc license đã hết hạn' });
    }

    // Tạo token
    const token = jwt.sign(
      { 
        employeeId: employee._id, 
        storeId: employee.store._id,
        licenseKey: employee.store.licenseKey
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Đặt header chứa licenseKey
    res.set('licenseKey', employee.store.licenseKey);

    res.json({ 
      token, 
      employeeName: employee.name, 
      storeName: employee.store.name,
      licenseKey: employee.store.licenseKey
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  adminLogin,
  employeeLogin
};