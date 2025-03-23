import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ORDER(orderId),
        { orderStatus: newStatus },
        {
          headers: {
            'licenseKey': localStorage.getItem('licenseKey'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    name: '',
    customerPhone: '',
    machineType: '',
    errorDescription: '',
    initialStatus: '',
    price: '',
    inChargeId: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchEmployees();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS, {
        headers: {
          'licenseKey': localStorage.getItem('licenseKey'),
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);

    } catch (error) {
      console.error('Error fetching orders:', error);
    }

  };

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
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...newOrder,
        inChargeId: newOrder.inChargeId || null
      };

      await axios.post(API_ENDPOINTS.CREATE_ORDER_BY_ADMIN, submitData, {
        headers: {
          'licenseKey': localStorage.getItem('licenseKey'),
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowModal(false);
      setNewOrder({
        name: '',
        customerPhone: '',
        machineType: '',
        errorDescription: '',
        initialStatus: '',
        price: '',
        inChargeId: ''
      });
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý đơn hàng</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Tạo đơn hàng mới
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên KH</th>
            <th>Số điện thoại KH</th>
            <th>Loại máy</th>
            <th>Mô tả lỗi</th>
            <th>Trạng thái ban đầu</th>
            <th>Giá</th>
            <th>Nhân viên phụ trách</th>
            <th>Trạng thái đơn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td><Button variant="link" onClick={() => setSelectedOrder(order)}>{order.name}</Button></td>
              <td>{order.customerPhone}</td>
              <td>{order.machineType}</td>
              <td>{order.errorDescription}</td>
              <td>{order.initialStatus}</td>
              <td>{order.price}</td>
              <td>{order.inChargeId?.name || 'Chưa phân công'}</td>
              <td>
                <Button
                variant={order.orderStatus === 'completed' ? 'secondary' : 'success'}
                size="sm"
                onClick={() => handleStatusChange(order._id, order.orderStatus === 'completed' ? 'not completed' : 'completed')}
              >
                {order.orderStatus === 'completed' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
              </Button>
              </td>
              <td>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo đơn hàng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrder}>
            <Form.Group className="mb-3">
              <Form.Label>Tên khách hàng</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.name}
                onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại khách hàng</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại máy</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.machineType}
                onChange={(e) => setNewOrder({ ...newOrder, machineType: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả lỗi</Form.Label>
              <Form.Control
                as="textarea"
                value={newOrder.errorDescription}
                onChange={(e) => setNewOrder({ ...newOrder, errorDescription: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Control
                type="text"
                value={newOrder.initialStatus}
                onChange={(e) => setNewOrder({ ...newOrder, initialStatus: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={newOrder.price}
                onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhân viên phụ trách</Form.Label>
              <Form.Select
                value={newOrder.inChargeId}
                onChange={(e) => setNewOrder({ ...newOrder, inChargeId: e.target.value })}
              >
                <option value="">Chọn nhân viên</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>{employee.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Tạo đơn hàng
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={selectedOrder} onHide={() => setSelectedOrder(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên khách hàng</Form.Label>
                <Form.Control plaintext readOnly value={selectedOrder.name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control plaintext readOnly value={selectedOrder.customerPhone} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Loại máy</Form.Label>
                <Form.Control plaintext readOnly value={selectedOrder.machineType} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả lỗi</Form.Label>
                <Form.Control plaintext readOnly value={selectedOrder.errorDescription} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày tạo</Form.Label>
                <Form.Control
                  plaintext
                  readOnly
                  value={new Date(selectedOrder.createdAt).toLocaleDateString()}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  plaintext
                  readOnly
                  value={selectedOrder.notes || 'Không có ghi chú'}
                  style={{ height: '100px' }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrdersAdmin;