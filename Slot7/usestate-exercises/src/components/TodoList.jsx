import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function TodoList() {
  // Khởi tạo state với 2 công việc có sẵn giống trong hình mẫu
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Học lập trình .NET' },
    { id: 2, text: 'Học lập trình Java' }
  ]);
  
  // State quản lý ô nhập liệu
  const [inputValue, setInputValue] = useState('');

  // Hàm xử lý thêm Todo
  const handleAdd = () => {
    if (inputValue.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: inputValue }]);
    setInputValue(''); // Xóa ô input sau khi thêm
  };

  // Hàm xử lý xóa Todo
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div
      style={{
        backgroundColor: '#282c34', // Nền tối
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          gap: '60px', // Khoảng cách giữa phần nhập và phần danh sách
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {/* Phần bên trái: Ô input và nút Add Todo */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Control
            type="text"
            placeholder="Please input a Task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: '280px', borderRadius: '4px' }}
          />
          <Button
            onClick={handleAdd}
            style={{ 
              backgroundColor: '#dc3545', // Màu đỏ giống mẫu
              borderColor: '#dc3545',
              padding: '6px 20px'
            }}
          >
            Add Todo
          </Button>
        </div>

        {/* Phần bên phải: Thẻ Todo List */}
        <div
          style={{
            backgroundColor: '#f8f9fa', // Nền trắng xám nhạt của thẻ
            padding: '25px',
            borderRadius: '8px',
            minWidth: '350px'
          }}
        >
          <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#000' }}>
            Todo List
          </h5>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map(task => (
              <div 
                key={task.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  padding: '10px 15px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  color: '#000'
                }}
              >
                <span>{task.text}</span>
                <Button
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    borderColor: '#dc3545',
                    padding: '4px 15px'
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}