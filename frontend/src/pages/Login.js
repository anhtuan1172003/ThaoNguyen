import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('employee'); // 'employee' or 'admin'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

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
      const endpoint = loginType === 'admin' ? '/login' : '/employee-login';
      const payload = loginType === 'admin'
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password };

      const response = await axios.post(`https://thaonguyen-full-stack.onrender.com${endpoint}`, payload);
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('licenseKey', response.data.licenseKey);
      localStorage.setItem('storeName', response.data.storeName);
      localStorage.setItem('loginType', loginType);
      if (loginType === 'employee') {
        localStorage.setItem('employeeName', response.data.employeeName);
      }

      // Chuyển hướng sau khi đăng nhập thành công
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Đăng nhập</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row className="mb-3">
              <Col>
                <div className="d-flex justify-content-center gap-3">
                  <Form.Check
                    type="radio"
                    label="Nhân viên"
                    name="loginType"
                    checked={loginType === 'employee'}
                    onChange={() => setLoginType('employee')}
                  />
                  <Form.Check
                    type="radio"
                    label="Admin"
                    name="loginType"
                    checked={loginType === 'admin'}
                    onChange={() => setLoginType('admin')}
                  />
                </div>
              </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
              {loginType === 'admin' ? (
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              ) : (
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
              )}

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

              <Button variant="primary" type="submit" className="w-100">
                Đăng nhập
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;