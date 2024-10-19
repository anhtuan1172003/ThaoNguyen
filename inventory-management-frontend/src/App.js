import React from 'react';
import ProductManagement from './components/ProductManagement';
import EmployeeManagement from './components/EmployeeManagement';

function App() {
  return (
    <div>
      <h1>Hệ thống quản lý cửa hàng</h1>
      <ProductManagement />
      <EmployeeManagement />
    </div>
  );
}

export default App;
