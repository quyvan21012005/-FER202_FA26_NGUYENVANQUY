import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';

export default function ToggleVisibility() {
  // State quản lý trạng thái ẩn/hiện, mặc định ban đầu là ẩn (false)
  const [isVisible, setIsVisible] = useState(false);

  // Hàm toggle chuyển đổi qua lại giữa true và false
  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div
      style={{
        backgroundColor: '#282c34', // Nền tối theo đúng mẫu bài tập
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
      }}
    >
      <Container className="text-center">
        {/* Nút bấm chuyển đổi Show / Hide */}
        <Button
          variant="light"
          onClick={handleToggle}
          style={{
            padding: '10px 24px',
            fontSize: '22px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '28px',
            color: '#000000',
          }}
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>

        {/* Đoạn text hiển thị khi isVisible = true */}
        {isVisible && (
          <div style={{ fontSize: '42px', fontWeight: '500' }}>
            Toggle me!
          </div>
        )}
      </Container>
    </div>
  );
}
