import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function Counter() {
  // State quản lý giá trị đếm, bắt đầu từ 0
  const [count, setCount] = useState(0);

  // Tăng 1 mỗi lần click
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div
      style={{
        backgroundColor: '#282c34', // Nền tối đúng theo mẫu đề bài
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
      }}
    >
      <Container className="text-center">
        {/* Nút bấm Increment */}
        <Button
          variant="light"
          onClick={handleIncrement}
          style={{
            padding: '10px 24px',
            fontSize: '22px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '28px',
            color: '#000000',
          }}
        >
          Increment
        </Button>

        {/* Hiển thị số đếm */}
        <div style={{ fontSize: '42px' }}>
          Count: {count}
        </div>
      </Container>
    </div>
  );
}