import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import FaqAccordion from './components/FaqAccordion';
import ReviewForm from './components/ReviewForm';
import BmiCalculator from './components/BmiCalculator';
import StudentManager from './components/StudentManager';
import QuizApp from './components/QuizApp';

function App() {
  // State chuyển đổi giữa 5 bài tập: 'ex1' | 'ex2' | 'ex3' | 'ex4' | 'ex5'
  const [activeTab, setActiveTab] = useState('ex5');

  return (
    <div className="min-vh-100 bg-light">
      {/* Header điều hướng giữa tất cả các bài tập trong Slot 7 */}
      <div className="bg-white border-bottom shadow-sm py-2 mb-3 sticky-top">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="fw-bold text-primary fs-5">
            FER202 - Slot 7 (BTVN useState)
          </span>
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="flex-wrap"
          >
            <Nav.Item>
              <Nav.Link eventKey="ex1" className="fw-medium">
                Bài 1: FAQ Accordion
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ex2" className="fw-medium">
                Bài 2: Đánh giá sao
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ex3" className="fw-medium">
                Bài 3: Máy tính BMI
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ex4" className="fw-medium">
                Bài 4: Quản lý điểm SV
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ex5" className="fw-medium">
                Bài 5: Quiz trắc nghiệm
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </div>

      {/* Nội dung bài tập được chọn */}
      <div>
        {activeTab === 'ex1' && <FaqAccordion />}
        {activeTab === 'ex2' && <ReviewForm />}
        {activeTab === 'ex3' && <BmiCalculator />}
        {activeTab === 'ex4' && <StudentManager />}
        {activeTab === 'ex5' && <QuizApp />}
      </div>
    </div>
  );
}

export default App;
