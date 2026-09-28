import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function TodoList() {
  // Khởi tạo state danh sách công việc ban đầu đúng theo hình mẫu đề bài
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Học lập trình .NET' },
    { id: 2, text: 'Học lập trình Java' },
  ]);

  // State quản lý giá trị ô nhập liệu (Controlled Input)
  const [inputValue, setInputValue] = useState('');

  // Hàm thêm công việc mới (dùng functional update để đảm bảo an toàn state)
  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed }]);
    setInputValue(''); // Reset ô input về rỗng
  };

  // Hàm xóa công việc theo id
  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Hỗ trợ bấm phím Enter để thêm công việc
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#282c34', // Nền tối chuẩn theo hình mẫu
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '50px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Khối bên trái: Ô input và nút Add Todo */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Form.Control
            type="text"
            placeholder="Please input a Task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '300px',
              height: '42px',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          <Button
            onClick={handleAdd}
            style={{
              backgroundColor: '#dc3545', // Màu đỏ giống đề bài
              borderColor: '#dc3545',
              height: '42px',
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '6px',
            }}
          >
            Add Todo
          </Button>
        </div>

        {/* Khối bên phải: Card Todo List */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            width: '380px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <h4
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#000000',
            }}
          >
            Todo List
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  color: '#000000',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: '400' }}>
                  {task.text}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    borderColor: '#dc3545',
                    padding: '4px 16px',
                    fontSize: '14px',
                    borderRadius: '4px',
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}

            {tasks.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#6c757d',
                  padding: '12px',
                  fontStyle: 'italic',
                }}
              >
                No tasks available. Add some above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}