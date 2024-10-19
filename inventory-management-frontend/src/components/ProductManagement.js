import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, price: 0, status: 'available' });

    // Lấy danh sách sản phẩm từ backend
    useEffect(() => {
        axios.get('http://localhost:3001/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Hàm thêm sản phẩm mới
    const handleAddProduct = () => {
        axios.post('http://localhost:3001/products', newProduct)
            .then(response => setProducts([...products, response.data]))
            .catch(error => console.error('Error adding product:', error));
    };

    // Hàm chỉnh sửa sản phẩm
    const handleEditProduct = (id) => {
        const productToEdit = products.find(product => product._id === id);
        setEditProduct({ ...productToEdit });
    };

    // Hàm xóa sản phẩm
    const handleDeleteProduct = (id) => {
        axios.delete(`http://localhost:3001/products/${id}`)
            .then(() => {
                setProducts(products.filter(product => product._id !== id));
            })
            .catch(error => console.error('Error deleting product:', error));
    };


    // Hàm lưu thay đổi sản phẩm
    const handleSaveProduct = () => {
        axios.put(`http://localhost:3001/products/${editProduct._id}`, editProduct)
            .then(response => {
                setProducts(products.map(product => product._id === response.data._id ? response.data : product));
                setEditProduct(null);
            })
            .catch(error => console.error('Error saving product:', error));
    };

    return (
        <div>
            <h1>Quản lý sản phẩm</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        {editProduct && editProduct._id === product._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editProduct.quantity}
                                    onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                                />
                                <button onClick={handleSaveProduct}>Lưu</button>
                            </>
                        ) : (
                            <>
                                {product.name} - Số lượng: {product.quantity} - Giá: {product.price}$
                                <button onClick={() => handleEditProduct(product._id)}>Sửa</button>
                                <button onClick={() => handleDeleteProduct(product._id)}>Xóa</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <h2>Thêm sản phẩm mới</h2>
            <input
                type="text"
                placeholder="Tên sản phẩm"
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
                type="number"
                placeholder="Số lượng"
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
            />
            <input
                type="number"
                placeholder="Giá"
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
            <button onClick={handleAddProduct}>Thêm sản phẩm</button>
        </div>
    );
}

export default ProductManagement;
