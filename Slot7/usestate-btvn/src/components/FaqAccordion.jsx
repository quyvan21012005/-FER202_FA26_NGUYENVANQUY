import React, { useState } from 'react';
import { Card, Form, Button, Container, Alert, Badge } from 'react-bootstrap';
import FaqItem from './FaqItem';

// Dữ liệu câu hỏi FAQ theo đề bài
const faqs = [
  {
    id: 1,
    question: 'React là gì?',
    answer: 'Thư viện JavaScript để xây dựng giao diện người dùng theo component.',
  },
  {
    id: 2,
    question: 'State khác props thế nào?',
    answer: 'Props do cha truyền xuống và chỉ đọc; state do chính component quản lý và thay đổi được.',
  },
  {
    id: 3,
    question: 'Vì sao phải dùng setState?',
    answer: 'Vì chỉ khi gọi hàm set, React mới biết dữ liệu đổi để render lại giao diện.',
  },
];

export default function FaqAccordion() {
  // State quản lý chế độ: false = mở nhiều câu độc lập, true = chỉ mở 1 câu tại một thời điểm
  const [singleMode, setSingleMode] = useState(false);

  // State lưu id của câu đang mở ở chế độ singleMode (null nghĩa là không câu nào mở)
  const [openId, setOpenId] = useState(null);

  // Hàm xử lý mở/đóng câu hỏi theo id (dùng functional update)
  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  // Khi chuyển công tắc: đổi chế độ và reset openId về null (React 18+ tự động batch 2 state)
  const handleSwitchMode = (e) => {
    setSingleMode(e.target.checked);
    setOpenId(null);
  };

  // Nút đóng tất cả câu hỏi trong chế độ singleMode
  const handleCloseAll = () => {
    setOpenId(null);
  };

  return (
    <Container className="py-4" style={{ maxWidth: '720px' }}>
      {/* Tiêu đề ứng dụng */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Bài 1: FAQ Accordion</h2>
        <p className="text-muted">
          Thực hành State boolean, Toggle, Instance State & Lifting State Up
        </p>
      </div>

      {/* Thanh điều khiển: Công tắc Single Mode + Nút Đóng tất cả */}
      <Card className="p-3 mb-4 bg-white shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Form.Check
            type="switch"
            id="single-mode-switch"
            label={
              <span className="fw-semibold">
                Chỉ mở một câu tại một thời điểm{' '}
                <Badge bg={singleMode ? 'primary' : 'secondary'} className="ms-1">
                  {singleMode ? 'BẬT' : 'TẮT'}
                </Badge>
              </span>
            }
            checked={singleMode}
            onChange={handleSwitchMode}
          />

          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleCloseAll}
            disabled={!singleMode || openId === null}
          >
            Đóng tất cả
          </Button>
        </div>
      </Card>

      {/* Danh sách FAQ Cards */}
      <div className="faq-list">
        {singleMode ? (
          // Chế độ BẬT: Nâng state lên cha (openId), chỉ mở 1 câu tại một thời điểm
          faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <Card key={faq.id} className="mb-3 shadow-sm border">
                <Card.Header
                  role="button"
                  onClick={() => handleToggle(faq.id)}
                  className="d-flex justify-content-between align-items-center bg-white py-3"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <span className="fw-semibold text-dark fs-6">{faq.question}</span>
                  <span className="fs-5 fw-bold text-primary">{isOpen ? '−' : '+'}</span>
                </Card.Header>
                {isOpen && (
                  <Card.Body className="bg-light text-secondary border-top">
                    {faq.answer}
                  </Card.Body>
                )}
              </Card>
            );
          })
        ) : (
          // Chế độ TẮT: Mỗi FaqItem tự giữ state riêng, có thể mở nhiều câu cùng lúc
          faqs.map((faq) => (
            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))
        )}
      </div>

      {/* Ghi chú giải thích kiến thức theo mục A11 của tài liệu */}
      <Alert variant="info" className="mt-4 shadow-sm">
        <div className="fw-bold mb-1">💡 Quan sát kiến thức mục A11 (useState):</div>
        <small>
          Khi ở chế độ thường (Tắt), bạn mở câu hỏi rồi gạt công tắc Bật/Tắt, các câu đang mở sẽ tự động đóng lại.
          Nguyên nhân: Component <code>&lt;FaqItem /&gt;</code> bị gỡ khỏi cây giao diện (unmount) khi đổi chế độ,
          nên toàn bộ state nội bộ của nó bị hủy và reset về giá trị ban đầu.
        </small>
      </Alert>
    </Container>
  );
}
