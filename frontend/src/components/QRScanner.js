import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const QRScanner = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      try {
        // Extract the order ID from the URL
        const url = new URL(data.text);
        const orderId = url.pathname.split('/').pop();
        
        if (orderId) {
          onHide();
          navigate(`/order/${orderId}`);
        }
      } catch (error) {
        // If URL parsing fails, try to extract ID directly from path
        const pathParts = data.text.split('/');
        const orderId = pathParts[pathParts.length - 1];
        
        if (orderId) {
          onHide();
          navigate(`/order/${orderId}`);
        } else {
          setError('Mã QR không hợp lệ');
        }
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError('Không thể truy cập camera hoặc có lỗi xảy ra');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Quét mã QR đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {error && <div className="alert alert-danger">{error}</div>}
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
            constraints={{
              audio: false,
              video: { facingMode: "environment" }
            }}
          />
          <p className="mt-3">Đặt mã QR vào khung hình để quét</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;
