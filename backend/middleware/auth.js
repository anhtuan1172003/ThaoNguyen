const jwt = require('jsonwebtoken');
const Store = require('../models/Store');

// Middleware kiểm tra bản quyền
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

// Middleware xác thực nhân viên
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

// Middleware xác thực admin
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

module.exports = {
  checkLicenseKey,
  authenticateEmployee,
  authenticate
};