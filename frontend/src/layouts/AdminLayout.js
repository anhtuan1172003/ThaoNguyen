import React from 'react';
import { Container } from 'react-bootstrap';
import AdminNavigation from '../components/AdminNavigation';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminNavigation />
      <Container fluid className="mt-3">
        {children}
      </Container>
    </div>
  );
};

export default AdminLayout;