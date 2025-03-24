const Order = require('../models/Order');
const Employee = require('../models/Employee');

// Lấy danh sách đơn hàng theo cửa hàng
const getOrders = (req, res) => {
  Order.find({ store: req.store._id })
    .populate('inChargeId', 'name')
    .sort({ createdAt: -1 })
    .then(orders => res.json(orders))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Lấy danh sách đơn hàng theo nhân viên
const getOrdersByEmployee = async (req, res) => {
  try {
    const orders = await Order.find({ inChargeId: req.employeeId })
      .populate('inChargeId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Không thể tải danh sách đơn hàng' });
  }
};

// Lấy chi tiết đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('inChargeId', 'name');
    
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Không thể tải thông tin đơn hàng' });
  }
};

// Tạo đơn hàng mới bởi nhân viên
const createOrderByEmployee = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      store: req.store._id,
      inChargeId: req.employeeId,
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Không thể tạo đơn hàng' });
  }
};

// Tạo đơn hàng mới bởi admin
const createOrderByAdmin = async (req, res) => {
  try {
    // Kiểm tra nhân viên có thuộc cửa hàng không
    const employee = await Employee.findById(req.body.inChargeId);
    if (!employee || employee.store.toString() !== req.store._id.toString()) {
      return res.status(400).json({ error: 'Nhân viên không hợp lệ' });
    }

    const newOrder = new Order({
      ...req.body,
      store: req.store._id,
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Không thể tạo đơn hàng' });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    // Nếu đang cập nhật trạng thái
    if (req.body.orderStatus) {
      // Nếu đánh dấu hoàn thành và trước đó chưa hoàn thành
      if (req.body.orderStatus === 'completed' && order.orderStatus !== 'completed') {
        req.body.completedAt = new Date();
      }
      // Nếu đánh dấu chưa hoàn thành
      else if (req.body.orderStatus === 'not completed') {
        req.body.completedAt = null;
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('inChargeId', 'name');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Không thể cập nhật đơn hàng' });
  }
};

module.exports = {
  getOrders,
  getOrdersByEmployee,
  getOrderById,
  createOrderByEmployee,
  createOrderByAdmin,
  updateOrder
};