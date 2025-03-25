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
      store: storeId,
      isActive: true
    });

    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const employeeId = req.params.id;

    // Tìm nhân viên
    const employee = await Employee.findOne({ _id: employeeId, store: req.store._id });
    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    // Kiểm tra username trùng (nếu thay đổi)
    if (username && username !== employee.username) {
      const existingUser = await Employee.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username đã tồn tại' });
      }
    }

    // Cập nhật thông tin
    employee.name = name || employee.name;
    employee.username = username || employee.username;
    employee.role = role || employee.role;

    // Cập nhật mật khẩu nếu có
    if (password) {
      employee.password = await bcrypt.hash(password, 10);
    }

    await employee.save();
    res.json(employee);
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

// Cập nhật trạng thái nhân viên
const updateEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, store: req.store._id });
    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    employee.isActive = !employee.isActive;
    await employee.save();
    res.json({ message: 'Cập nhật trạng thái nhân viên thành công', employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  addTaskToEmployee,
  updateEmployeeStatus
};