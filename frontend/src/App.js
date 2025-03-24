import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Products from './pages/Products';
import Employees from './pages/Employees';
import AdminOrders from './pages/admin/OrdersAdmin';
import EmployeeOrders from './pages/employee/OrdersEmployee';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import OrdersEmployee from './pages/employee/OrdersEmployee';
import OrderDetail from './pages/OrderDetail';

// Protected Route Components
const AdminRoute = ({ children }) => {
  const loginType = localStorage.getItem('loginType');
  return loginType === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

const EmployeeRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const RoleBasedRoute = ({ children }) => {
  const loginType = localStorage.getItem('loginType');
  if (!loginType) return <Navigate to="/login" replace />;
  
  return loginType === 'admin' ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <EmployeeLayout>{children}</EmployeeLayout>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/dashboard" element={
            <RoleBasedRoute>
              {localStorage.getItem('loginType') === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
            </RoleBasedRoute>
          } />
          <Route path="/products" element={
            <RoleBasedRoute>
              <Products />
            </RoleBasedRoute>
          } />
          <Route path="/employees" element={
            <AdminRoute>
              <AdminLayout>
                <Employees />
              </AdminLayout>
            </AdminRoute>
          } />
          {/* <Route path="/orders" element={
            <RoleBasedRoute>
              {localStorage.getItem('loginType') === 'admin' ? <OrdersAdmin/> : <OrdersEmployee/>}
            </RoleBasedRoute>
          } /> */}
          <Route path="/orders" element={
            <RoleBasedRoute>
              <OrdersEmployee/>
            </RoleBasedRoute>
          } />
          <Route path="/Aorders" element={
            <RoleBasedRoute>
              <OrdersAdmin/>
            </RoleBasedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
