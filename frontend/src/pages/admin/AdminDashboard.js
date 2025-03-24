import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Package, Users, ShoppingCart, QrCode } from 'lucide-react';
import axios from 'axios';
import QRScanner from '../../components/QRScanner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    employees: 0,
    orders: 0
  });
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const licenseKey = localStorage.getItem('licenseKey');
      const token = localStorage.getItem('token');

      try {
        // Lấy số lượng sản phẩm
        const productsResponse = await axios.get('https://thaonguyen-full-stack.onrender.com/products', {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Lấy số lượng nhân viên
        const employeesResponse = await axios.get('https://thaonguyen-full-stack.onrender.com/employees', {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });

        // Lấy số lượng đơn hàng
        const ordersResponse = await axios.get('https://thaonguyen-full-stack.onrender.com/orders', {
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
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bảng điều khiển</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowScanner(true)}
          className="d-flex align-items-center gap-2"
        >
          <QrCode size={20} />
          Quét QR đơn hàng
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tổng sản phẩm</h6>
                  <h2 className="mt-2 mb-0">{stats.products}</h2>
                </div>
                <Package size={40} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tổng nhân viên</h6>
                  <h2 className="mt-2 mb-0">{stats.employees}</h2>
                </div>
                <Users size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tổng đơn hàng</h6>
                  <h2 className="mt-2 mb-0">{stats.orders}</h2>
                </div>
                <ShoppingCart size={40} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <QRScanner 
        show={showScanner} 
        onHide={() => setShowScanner(false)} 
      />
    </div>
  );
};

export default AdminDashboard;