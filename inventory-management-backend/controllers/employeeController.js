const Employee = require('../models/Employee');
const Store = require('../models/Store');
const bcrypt = require('bcrypt');

// Lấy danh sách nhân viên theo cửa hàng
const getEmployees = (req, res) => {
  Employee.find({ store: req.store._id })
    .then(employees => res.json(employees))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Thêm nhân viên mới
const addEmployee = async (req, res) => {
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
};

// Thêm công việc cho nhân viên
const addTaskToEmployee = (req, res) => {
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
};

const deleteEmployee = (req, res) => {
  Employee.findOneAndDelete({ _id: req.params.id, store: req.store._id })
    .then(() => res.json({ message: 'Xóa nhân viên thành công' }))
    .catch(err => res.status(500).json({ error: err.message }));
};

module.exports = {
  getEmployees,
  addEmployee,
  addTaskToEmployee,
  deleteEmployee
};