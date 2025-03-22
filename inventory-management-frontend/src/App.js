import React from 'react';
import ProductManagement from './components/ProductManagement';
import EmployeeManagement from './components/EmployeeManagement';
import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout.js'


const [currentPage, setCurrentPage] = useState('products');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [licenseKey, setLicenseKey] = useState('');

const renderCurrentPage = () => {
  switch(currentPage) {
    case 'products':
      return <ProductsPage />;
    case 'employees':
      return <EmployeesPage />;
    case 'orders':
      return <OrdersPage />;
    default:
      return <ProductsPage />;
  }
};

const AppContext = React.createContext();

export const useAppContext = () => React.useContext(AppContext);

function App() {
  return (
    <AppContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      isAuthenticated, 
      setIsAuthenticated,
      licenseKey,
      setLicenseKey
    }}>
      {!isAuthenticated ? (
        <LoginPage/>
      ) : (
        <Layout>
          {renderCurrentPage()}
        </Layout>
      )}
    </AppContext.Provider>
  );
}

export default App;
