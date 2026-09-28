import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

// Component con FaqItem: Mỗi câu tự quản lý state isOpen độc lập ở chế độ thường
export default function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-3 shadow-sm border">
      <Card.Header
        role="button"
        onClick={() => setIsOpen((open) => !open)}
        className="d-flex justify-content-between align-items-center bg-white py-3"
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span className="fw-semibold text-dark fs-6">{question}</span>
        <span className="fs-5 fw-bold text-primary">{isOpen ? '−' : '+'}</span>
      </Card.Header>
      {isOpen && (
        <Card.Body className="bg-light text-secondary border-top">
          {answer}
        </Card.Body>
      )}
    </Card>
  );
}
