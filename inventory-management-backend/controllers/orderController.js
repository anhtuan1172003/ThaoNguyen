const Order = require('../models/Order');
const Employee = require('../models/Employee');

// Lấy danh sách đơn hàng theo cửa hàng
const getOrders = (req, res) => {
  Order.find({ store: req.store._id }).populate('inChargeId', 'name')
    .then(orders => res.json(orders))
    .catch(err => res.status(500).json({ error: err.message }));
};


const getOrdersByEmployee = async (req, res) => {
  try {
    Order.find({ inChargeId: req.employeeId })

      .then(orders => res.json(orders))
      .catch(err => res.status(500).json({ error: err.message }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Không thể tải danh sách đơn hàng' });
  }
}
// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const { name, customerPhone, machineType, errorDescription, initialStatus, price, inChargeId } = req.body;

    // Xác định inCharge dựa vào role của người tạo đơn
    let employeeInCharge;
    if (req.loginType === 'admin') {
      // Admin chọn employee từ danh sách
      if (!inChargeId) {
        return res.status(400).json({ error: 'Vui lòng chọn nhân viên phụ trách đơn hàng' });
      }
      employeeInCharge = inChargeId;
    } else {
      // Employee tự động được gán là người phụ trách
      employeeInCharge = req.employeeId;
    }

    const newOrder = new Order({
      name,
      customerPhone,
      machineType,
      errorDescription,
      initialStatus,
      price,
      store: req.storeId,
      inChargeId: employeeInCharge
    });

    const savedOrder = await newOrder.save();

    // Thêm order vào danh sách công việc của nhân viên phụ trách
    await Employee.findOneAndUpdate(
      { _id: employeeInCharge },
      { $push: { tasks: savedOrder._id } }
    );

    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật đơn hàng
const updateOrder = async (req, res) => {
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
};

const createOrderByEmployee = async (req, res) => {
  try {
    const { name, customerPhone, machineType, errorDescription, initialStatus, price } = req.body;

    const newOrder = new Order({
      name,
      customerPhone,
      machineType,
      errorDescription,
      initialStatus,
      price,
      store: req.storeId,
      inChargeId: req.employeeId // Tự động gán cho nhân viên đang đăng nhập
    });

    const savedOrder = await newOrder.save();
    await Employee.findOneAndUpdate(
      { _id: req.employeeId },
      { $push: { tasks: savedOrder._id } }
    );
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrderByAdmin = async (req, res) => {
  try {
    const { name, customerPhone, machineType, errorDescription, initialStatus, price, inChargeId } = req.body;

    if (!inChargeId) {
      return res.status(400).json({ error: 'Vui lòng chọn nhân viên phụ trách' });
    }

    console.log('Request body:', req.body);
    console.log('inChargeId from request:', inChargeId);
    console.log('StoreId from token:', req.storeId);

    // Kiểm tra nhân viên có thuộc cửa hàng quản lý bởi admin
    const employee = await Employee.findOne({ 
      _id: inChargeId,
      store: req.storeId
    });
    console.log('Employee check result:', employee);

    if (!employee) {
      return res.status(400).json({ error: 'Nhân viên không tồn tại hoặc không thuộc cửa hàng này' });
    }

    const newOrder = new Order({
      name,
      customerPhone,
      machineType,
      errorDescription,
      initialStatus,
      price,
      store: req.storeId,
      inChargeId
    });

    const savedOrder = await newOrder.save();
    await Employee.findOneAndUpdate(
      { _id: inChargeId },
      { $push: { tasks: savedOrder._id } }
    );
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrders,
  createOrderByAdmin,
  createOrderByEmployee,
  createOrder,
  updateOrder,
  getOrdersByEmployee
};