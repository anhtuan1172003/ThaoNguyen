import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: ''
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EMPLOYEES, {
        headers: {
          'licenseKey': localStorage.getItem('licenseKey'),
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Không thể tải danh sách nhân viên');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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

      await axios.post(API_ENDPOINTS.EMPLOYEES, formData, { headers });

      setShowModal(false);
      setFormData({ name: '', username: '', password: '', role: '' });
      fetchEmployees();
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi thêm nhân viên');
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axios.delete(API_ENDPOINTS.EMPLOYEE(employeeId), {
          headers: {
            'licenseKey': localStorage.getItem('licenseKey'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchEmployees();
      } catch (error) {
        setError('Không thể xóa nhân viên');
      }
    }
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

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên nhân viên</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.username}</td>
              <td>{employee.role}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(employee._id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </div>
  );
};

export default Employees;