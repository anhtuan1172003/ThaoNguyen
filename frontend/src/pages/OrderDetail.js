import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format thời gian để hiển thị
  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const licenseKey = localStorage.getItem('licenseKey');
        const storeId = localStorage.getItem('storeId');
        
        // Gửi headers nếu có token hoặc licenseKey
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        if (licenseKey) {
          headers['licenseKey'] = licenseKey;
        }

        const response = await axios.get(`${API_ENDPOINTS.GET_ORDER_DETAIL(id)}`, { headers });
        setOrder(response.data);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Đang tải...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return <Navigate to="/" />;
  }

  // Kiểm tra xem có quyền xem chi tiết không
  const hasFullAccess = localStorage.getItem('token') || 
                       (localStorage.getItem('licenseKey') && 
                        localStorage.getItem('storeId') === order.store);

  return (
    <Container className="py-5">
      <Card>
        <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span>Chi tiết đơn hàng</span>
          <span className={`badge bg-${order.orderStatus === 'completed' ? 'success' : 'warning'}`}>
            {order.orderStatus === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
          </span>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-12">
              <h5 className="mb-3">Thông tin khách hàng</h5>
              <p className="h4 mb-4">{order.name}</p>
            </div>
          </div>

          {/* Chi tiết bổ sung chỉ hiển thị khi có quyền truy cập */}
          {hasFullAccess && (
            <>
              <hr className="my-4" />
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">Thông tin thiết bị</h5>
                  <p><strong>Loại máy:</strong> {order.machineType}</p>
                  <p><strong>Tình trạng ban đầu:</strong> {order.initialStatus}</p>
                  <p><strong>Mô tả lỗi:</strong> {order.errorDescription}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="mb-3">Thông tin sửa chữa</h5>
                  <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
                  <p><strong>Giá:</strong> {order.price}</p>
                  <p><strong>Nhân viên phụ trách:</strong> {order.inChargeId?.name || 'Chưa phân công'}</p>
                  <p><strong>Thời gian nhận:</strong> {formatDateTime(order.receiveTime)}</p>
                  <p><strong>Thời gian hoàn thành:</strong> {formatDateTime(order.completedTime)}</p>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetail;
