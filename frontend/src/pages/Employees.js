import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: ''
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_EMPLOYEES_BY_ADMIN, {
        headers: {
          'licenseKey': localStorage.getItem('licenseKey'),
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Không thể tải danh sách nhân viên');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = [...employees];

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => 
        statusFilter === 'active' ? emp.isActive : !emp.isActive
      );
    }

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, statusFilter, employees]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const headers = {
        'licenseKey': localStorage.getItem('licenseKey'),
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (editingEmployee) {
        // Cập nhật nhân viên
        await axios.put(
          `${API_ENDPOINTS.UPDATE_EMPLOYEE(editingEmployee._id)}`,
          formData,
          { headers }
        );
      } else {
        // Thêm nhân viên mới
        await axios.post(API_ENDPOINTS.CREATE_EMPLOYEE_BY_ADMIN, formData, { headers });
      }

      setShowModal(false);
      setShowEditModal(false);
      setEditingEmployee(null);
      setFormData({ name: '', username: '', password: '', role: '' });
      fetchEmployees();
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi lưu thông tin nhân viên');
    }
  };

  const handleStatusChange = async (employeeId) => {
    try {
      const headers = {
        'licenseKey': localStorage.getItem('licenseKey'),
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      await axios.patch(`${API_ENDPOINTS.UPDATE_EMPLOYEE_STATUS(employeeId)}`, {}, { headers });
      fetchEmployees();
    } catch (error) {
      setError('Không thể cập nhật trạng thái nhân viên');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      username: employee.username,
      password: '', // Để trống mật khẩu khi sửa
      role: employee.role
    });
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý nhân viên</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Thêm nhân viên
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <div className="d-flex gap-3 mb-4">
        <InputGroup>
          <InputGroup.Text>
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm theo tên, username hoặc vai trò..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <InputGroup style={{ width: 'auto' }}>
          <InputGroup.Text>
            <Filter size={20} />
          </InputGroup.Text>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang làm việc</option>
            <option value="inactive">Đã nghỉ việc</option>
          </Form.Select>
        </InputGroup>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên nhân viên</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.username}</td>
              <td>{employee.role}</td>
              <td>
                <Button
                  variant={employee.isActive ? "success" : "danger"}
                  size="sm"
                  onClick={() => handleStatusChange(employee._id)}
                >
                  {employee.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
                </Button>
              </td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(employee)}
                >
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm nhân viên mới */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhân viên mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Thêm
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal sửa nhân viên */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới (để trống nếu không muốn thay đổi)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Employees;