import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

export default function ControlledInput() {
  // State lưu trữ giá trị người dùng nhập vào ô input
  const [text, setText] = useState('');

  return (
    <div
      style={{
        backgroundColor: '#282c34', // Nền tối đúng theo mẫu bài tập
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
      }}
    >
      <Container className="d-flex flex-column align-items-center text-center">
        {/* Ô Input có điều khiển (Controlled Component) */}
        <Form.Control
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '360px',
            fontSize: '22px',
            padding: '8px 14px',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #ced4da',
            outline: 'none',
          }}
        />

        {/* Hiển thị văn bản realtime theo thời gian thực */}
        <div
          style={{
            fontSize: '42px',
            marginTop: '36px',
            fontWeight: '400',
            letterSpacing: '0.5px',
          }}
        >
          Input text: {text}
        </div>
      </Container>
    </div>
  );
}
