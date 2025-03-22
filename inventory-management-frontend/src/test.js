import React, { useState, useEffect } from 'react';
import { Menu, Package, Users, ShoppingCart, LogOut } from 'lucide-react';

// Components
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
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
              <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
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

const NavButton = ({ page, icon, text, isOpen }) => {
  const { setCurrentPage } = useAppContext();
  return (
    <button 
      onClick={() => setCurrentPage(page)}
      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
    >
      <span className="mr-3">{icon}</span>
      {isOpen && <span>{text}</span>}
    </button>
  );
};

// Context for managing current page
const AppContext = React.createContext();

export const useAppContext = () => React.useContext(AppContext);

// Products Page
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    price: 0,
    status: 'available'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products', {
        headers: {
          'licenseKey': 'abc123xyz'
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'licenseKey': 'abc123xyz'
        },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      setProducts([...products, data]);
      setIsAddModalOpen(false);
      setNewProduct({ name: '', quantity: 0, price: 0, status: 'available' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Products</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-semibold mb-4">Add New Product</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full p-2 border rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full p-2 border rounded"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full p-2 border rounded"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
              <select
                className="w-full p-2 border rounded"
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Employees Page
const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/employees', {
        headers: {
          'licenseKey': 'abc123xyz'
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Employees</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {employee.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.role}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h5 className="font-semibold mb-2">Tasks</h5>
              <ul className="space-y-2">
                {employee.tasks.map((task, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{task.description}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders Page
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from API (implementation needed)
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Orders</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          New Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Customer Phone</th>
              <th className="px-6 py-3 text-left">Machine Type</th>
              <th className="px-6 py-3 text-left">Error Description</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.customerPhone}</td>
                <td className="px-6 py-4">{order.machineType}</td>
                <td className="px-6 py-4">{order.errorDescription}</td>
                <td className="px-6 py-4">${order.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('products');

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

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage }}>
      <Layout>
        {renderCurrentPage()}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
