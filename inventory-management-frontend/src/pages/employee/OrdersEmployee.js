import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const OrdersEmployee = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newOrder, setNewOrder] = useState({
        name: '',
        customerPhone: '',
        machineType: '',
        errorDescription: '',
        initialStatus: '',
        price: ''
    });

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

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const licenseKey = localStorage.getItem('licenseKey');
            const response = await axios.get(`${API_ENDPOINTS.ORDERS_BY_EMPLOYEE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'licenseKey': licenseKey
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const licenseKey = localStorage.getItem('licenseKey');
            const response = await axios.post(API_ENDPOINTS.ORDERS, newOrder, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'licenseKey': licenseKey
                }
            });
            setShowModal(false);
            setNewOrder({
                name: '',
                customerPhone: '',
                machineType: '',
                errorDescription: '',
                initialStatus: '',
                price: ''
            });
            // Hiển thị QR code sau khi tạo đơn hàng
            setSelectedOrder(response.data);
            setShowOrderDetailModal(true);
            fetchOrders();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleViewOrderDetail = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailModal(true);
    };

    const handleEdit = (order) => {
        setNewOrder({
            name: order.name,
            customerPhone: order.customerPhone,
            machineType: order.machineType,
            errorDescription: order.errorDescription,
            initialStatus: order.initialStatus,
            price: order.price
        });
        setSelectedOrder(order);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleEditOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${API_ENDPOINTS.ORDERS}/${selectedOrder._id}`,
                newOrder,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'licenseKey': localStorage.getItem('licenseKey')
                    }
                }
            );
            setShowModal(false);
            setIsEditing(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
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
                        <th>Loại máy</th>
                        <th>Mô tả lỗi</th>
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Ngày hoàn thành</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>
                                <Button 
                                    variant="link" 
                                    className="p-0 text-decoration-none text-primary"
                                    onClick={() => handleViewOrderDetail(order)}
                                >
                                    {order.name}
                                </Button>
                            </td>
                            <td>{order.machineType}</td>
                            <td>{order.errorDescription}</td>
                            <td>{order.price}</td>
                            <td>
                                <Button
                                    variant={order.orderStatus === 'completed' ? 'success' : 'warning'}
                                    size="sm"
                                    onClick={() => handleStatusChange(order._id, order.orderStatus === 'completed' ? 'not completed' : 'completed')}
                                >
                                    {order.orderStatus === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                </Button>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.completedAt ? new Date(order.completedAt).toLocaleDateString() : 'Chưa hoàn thành'}</td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => handleViewOrderDetail(order)}
                                >
                                    Chi tiết
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(order)}
                                >
                                    Sửa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal tạo/sửa đơn hàng */}
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setIsEditing(false);
                setNewOrder({
                    name: '',
                    customerPhone: '',
                    machineType: '',
                    errorDescription: '',
                    initialStatus: '',
                    price: ''
                });
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={isEditing ? handleEditOrder : handleCreateOrder}>
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
                            <Form.Label>Số điện thoại</Form.Label>
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
                                rows={3}
                                value={newOrder.errorDescription}
                                onChange={(e) => setNewOrder({ ...newOrder, errorDescription: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái ban đầu</Form.Label>
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
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Lưu thay đổi' : 'Tạo đơn hàng'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal chi tiết đơn hàng với QR Code */}
            <Modal show={showOrderDetailModal} onHide={() => setShowOrderDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div>
                            <div className="mb-4">
                                <h5 className="mb-3">Thông tin khách hàng</h5>
                                <p><strong>Tên khách hàng:</strong> {selectedOrder.name}</p>
                                <p><strong>Số điện thoại:</strong> {selectedOrder.customerPhone}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h5 className="mb-3">Thông tin thiết bị</h5>
                                <p><strong>Loại máy:</strong> {selectedOrder.machineType}</p>
                                <p><strong>Tình trạng ban đầu:</strong> {selectedOrder.initialStatus}</p>
                                <p><strong>Mô tả lỗi:</strong> {selectedOrder.errorDescription}</p>
                            </div>

                            <div className="mb-4">
                                <h5 className="mb-3">Thông tin sửa chữa</h5>
                                <p><strong>Giá:</strong> {selectedOrder.price}</p>
                                <p>
                                    <strong>Trạng thái:</strong>{' '}
                                    <span className={`badge bg-${selectedOrder.orderStatus === 'completed' ? 'success' : 'warning'}`}>
                                        {selectedOrder.orderStatus === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                    </span>
                                </p>
                                <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                <p><strong>Ngày hoàn thành:</strong> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleDateString() : 'Chưa hoàn thành'}</p>
                            </div>

                            <div className="text-center mt-4">
                                <p><strong>Mã QR đơn hàng</strong></p>
                                <QRCodeSVG
                                    value={`${window.location.origin}/order/${selectedOrder._id}`}
                                    size={200}
                                    level="H"
                                    className="mx-auto d-block"
                                />
                                <p className="text-muted mt-2">Quét mã QR để xem chi tiết đơn hàng</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderDetailModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrdersEmployee;