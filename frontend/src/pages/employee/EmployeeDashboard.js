import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Package, ShoppingCart, QrCode } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0
  });
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const licenseKey = localStorage.getItem('licenseKey');
      const token = localStorage.getItem('token');

      try {
        // Lấy số lượng sản phẩm
        const productsResponse = await axios.get(`${API_ENDPOINTS.GET_EMPLOYEE_PRODUCTS}`, {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });

        // Lấy số lượng đơn hàng
        const ordersResponse = await axios.get(`${API_ENDPOINTS.GET_ORDERS_BY_EMPLOYEE}`, {
          headers: {
            'licenseKey': licenseKey,
            'Authorization': `Bearer ${token}`
          }
        });

        setStats({
          products: productsResponse.data.length,
          orders: ordersResponse.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    
  }, []);

  return (
    <div>
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
        <Col md={6}>
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
        <Col md={6}>
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
      <QRScanner 
        show={showScanner} 
        onHide={() => setShowScanner(false)} 
      />
    </div>
  );
};

export default EmployeeDashboard;