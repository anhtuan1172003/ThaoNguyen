import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', status: 'pending' });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Lấy danh sách nhân viên từ backend
  useEffect(() => {
    axios.get('http://localhost:3001/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  // Hàm thêm công việc cho nhân viên
  const handleAddTask = (employeeId) => {
    axios.post(`http://localhost:3001/employees/${employeeId}/tasks`, newTask)
      .then(response => {
        const updatedEmployees = employees.map(emp => {
          if (emp._id === employeeId) {
            emp.tasks.push(response.data);
          }
          return emp;
        });
        setEmployees(updatedEmployees);
      })
      .catch(error => console.error('Error adding task:', error));
  };

  return (
    <div>
      <h1>Quản lý nhân viên</h1>
      <ul>
        {employees.map(employee => (
          <li key={employee._id}>
            {employee.name} ({employee.role}) - Số lượng công việc: {employee.tasks.length}
            <button onClick={() => setSelectedEmployeeId(employee._id)}>Giao việc</button>
            {selectedEmployeeId === employee._id && (
              <div>
                <input 
                  type="text" 
                  placeholder="Mô tả công việc" 
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                />
                <button onClick={() => handleAddTask(employee._id)}>Thêm công việc</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeManagement;
