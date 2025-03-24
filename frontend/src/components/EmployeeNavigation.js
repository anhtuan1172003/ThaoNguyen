import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const EmployeeNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('licenseKey');
    localStorage.removeItem('storeName');
    localStorage.removeItem('loginType');
    localStorage.removeItem('employeeName');
    navigate('/login');
    window.location.reload();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          Quản lý kho (Nhân viên)
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/products">Sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/orders">Đơn hàng</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default EmployeeNavigation;