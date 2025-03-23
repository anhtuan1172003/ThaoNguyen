import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Package, Users, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    employees: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const licenseKey = localStorage.getItem('licenseKey');
      const token = localStorage.getItem('token');

      try {
        // Lấy số lượng sản phẩm
        const productsResponse = await axios.get('http://localhost:3001/products', {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Lấy số lượng nhân viên
        const employeesResponse = await axios.get('http://localhost:3001/employees', {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });

        // Lấy số lượng đơn hàng
        const ordersResponse = await axios.get('http://localhost:3001/orders', {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });

        setStats({
          products: productsResponse.data.length,
          employees: employeesResponse.data.length,
          orders: ordersResponse.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      window.location.reload();
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary p-3 rounded">
                  <Package size={24} color="white" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Tổng sản phẩm</h6>
                  <h3 className="mb-0">{stats.products}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success p-3 rounded">
                  <Users size={24} color="white" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Tổng nhân viên</h6>
                  <h3 className="mb-0">{stats.employees}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning p-3 rounded">
                  <ShoppingCart size={24} color="white" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Tổng đơn hàng</h6>
                  <h3 className="mb-0">{stats.orders}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;