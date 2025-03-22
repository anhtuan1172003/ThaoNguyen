import { Menu, Package, Users, ShoppingCart, LogOut } from 'lucide-react';
import { useState, useEffect, useAppContext } from "react";
import {NavButton} from 'react-bootstrap';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { setIsAuthenticated } = useAppContext();
    
    const handleLogout = () => {
      setIsAuthenticated(false);
    };
  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Store Manager</h1>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu size={24} />
              </button>
            </div>
          </div>
          <nav className="mt-4">
            <NavButton page="products" icon={<Package />} text="Products" isOpen={isSidebarOpen} />
            <NavButton page="employees" icon={<Users />} text="Employees" isOpen={isSidebarOpen} />
            <NavButton page="orders" icon={<ShoppingCart />} text="Orders" isOpen={isSidebarOpen} />
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={20} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    );
  };
  
  export default Layout;