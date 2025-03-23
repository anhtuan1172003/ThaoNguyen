import React from 'react';
import { Container } from 'react-bootstrap';
import EmployeeNavigation from '../components/EmployeeNavigation';

const EmployeeLayout = ({ children }) => {
  return (
    <div className="employee-layout">
      <EmployeeNavigation />
      <Container fluid className="mt-3">
        {children}
      </Container>
    </div>
  );
};

export default EmployeeLayout;