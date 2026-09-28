import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import FaqAccordion from './components/FaqAccordion';
import ReviewForm from './components/ReviewForm';

function App() {
  // State chuyển đổi giữa các bài tập: 'ex1' hoặc 'ex2'
  const [activeTab, setActiveTab] = useState('ex2');

  return (
    <div className="min-vh-100 bg-light">
      {/* Header điều hướng giữa các bài tập trong Slot 7 */}
      <div className="bg-white border-bottom shadow-sm py-2 mb-3">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="fw-bold text-primary fs-5">
            FER202 - Slot 7 (BTVN useState)
          </span>
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav.Item>
              <Nav.Link eventKey="ex1" className="fw-medium">
                Bài 1: FAQ Accordion
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ex2" className="fw-medium">
                Bài 2:  Đánh giá sao
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </div>

      {/* Nội dung bài tập */}
      <div>
        {activeTab === 'ex1' && <FaqAccordion />}
        {activeTab === 'ex2' && <ReviewForm />}
      </div>
    </div>
  );
}

export default App;
