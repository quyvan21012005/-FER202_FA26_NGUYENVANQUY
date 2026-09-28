import React, { useState } from 'react';
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Badge,
  Alert,
  ListGroup,
} from 'react-bootstrap';

// Dữ liệu câu hỏi trắc nghiệm theo đúng tài liệu
const QUESTIONS = [
  {
    id: 'q1',
    text: 'Hook nào dùng để lưu trạng thái cục bộ?',
    options: ['useEffect', 'useState', 'useRef', 'useMemo'],
    answer: 1, // 'useState'
  },
  {
    id: 'q2',
    text: 'Gọi setCount(count + 1) ba lần trong một sự kiện, count tăng bao nhiêu?',
    options: ['1', '2', '3', '0'],
    answer: 0, // '1'
  },
  {
    id: 'q3',
    text: 'Cách đúng để thêm phần tử vào mảng state?',
    options: [
      'list.push(x)',
      'setList(list.push(x))',
      'setList([...list, x])',
      'list[list.length] = x',
    ],
    answer: 2, // 'setList([...list, x])'
  },
  {
    id: 'q4',
    text: 'Checkbox có điều khiển dùng prop nào?',
    options: ['value', 'checked', 'selected', 'defaultValue'],
    answer: 1, // 'checked'
  },
];

// Thuật toán xáo trộn Fisher–Yates trên bản sao mảng [...array]
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Component con Quiz nhận callback onRestart từ cha
function Quiz({ onRestart }) {
  // 1. Lazy initializer: Chỉ xáo trộn câu hỏi 1 lần duy nhất khi Quiz khởi tạo
  // Không bị xáo trộn lại khi component re-render lúc chọn đáp án
  const [questions] = useState(() => shuffle(QUESTIONS));

  // 2. State điều hướng và lưu câu trả lời
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [finished, setFinished] = useState(false);

  // 3. Dữ liệu dẫn xuất (Derived State)
  const total = questions.length;
  const current = questions[index];
  const selected = answers[current.id]; // Lưu ý: 0 là index hợp lệ
  const answeredCount = Object.keys(answers).length;
  const score = questions.filter((q) => answers[q.id] === q.answer).length;

  // Chọn đáp án bằng cú pháp Computed Property
  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: optionIndex,
    }));
  };

  // MÀN HÌNH KẾT QUẢ KHI NỘP BÀI (finished = true)
  if (finished) {
    return (
      <Card className="p-4 bg-white shadow-sm border">
        {/* Kết quả tổng quan */}
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Kết quả làm bài</h3>
          <h4
            className={
              score === total
                ? 'text-success fw-bold'
                : score >= total / 2
                ? 'text-primary fw-bold'
                : 'text-danger fw-bold'
            }
          >
            Bạn đúng {score}/{total} câu ({(score / total) * 100}%)
          </h4>
        </div>

        {/* Danh sách từng câu hỏi và đáp án chi tiết */}
        <div className="d-flex flex-column gap-3 mb-4">
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.answer;

            return (
              <Card
                key={q.id}
                className={`border ${
                  isCorrect ? 'border-success' : 'border-danger'
                }`}
              >
                <Card.Header
                  className={`d-flex justify-content-between align-items-center py-2 ${
                    isCorrect
                      ? 'bg-success-subtle text-success-emphasis'
                      : 'bg-danger-subtle text-danger-emphasis'
                  }`}
                >
                  <span className="fw-semibold">
                    Câu {idx + 1}: {q.text}
                  </span>
                  <Badge bg={isCorrect ? 'success' : 'danger'}>
                    {isCorrect ? 'ĐÚNG' : 'SAI'}
                  </Badge>
                </Card.Header>
                <Card.Body className="py-2">
                  <div className="small">
                    <div>
                      <strong>Bạn chọn:</strong>{' '}
                      <span
                        className={
                          isCorrect
                            ? 'text-success fw-semibold'
                            : 'text-danger fw-semibold'
                        }
                      >
                        {userAnswer !== undefined
                          ? q.options[userAnswer]
                          : 'Chưa trả lời'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <strong>Đáp án đúng:</strong>{' '}
                        <span className="text-success fw-semibold">
                          {q.options[q.answer]}
                        </span>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Nút Làm lại: Báo lên cha để tăng attempt đổi key, không reset state thủ công */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onRestart}
            className="px-5 fw-semibold"
          >
            🔄 Làm lại bài thi
          </Button>
        </div>
      </Card>
    );
  }

  // MÀN HÌNH LÀM BÀI TRẮC NGHIỆM
  return (
    <Card className="p-4 bg-white shadow-sm border">
      {/* Thanh tiến độ */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
          <span>Tiến độ làm bài</span>
          <span>
            Đã trả lời: <strong>{answeredCount}</strong>/{total} câu
          </span>
        </div>
        <ProgressBar
          now={(answeredCount / total) * 100}
          variant="primary"
          style={{ height: '8px' }}
        />
      </div>

      {/* Nội dung câu hỏi */}
      <h5 className="fw-bold text-dark mb-3">
        Câu {index + 1}: {current.text}
      </h5>

      {/* Danh sách 4 lựa chọn */}
      <ListGroup className="mb-4">
        {current.options.map((option, optIdx) => {
          const isSelected = selected === optIdx;
          return (
            <ListGroup.Item
              key={optIdx}
              action
              active={isSelected}
              onClick={() => handleSelect(optIdx)}
              className="py-3 px-3 fs-6 d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-bold me-1">
                {String.fromCharCode(65 + optIdx)}.
              </span>
              <span>{option}</span>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* Nút điều hướng */}
      <div className="d-flex justify-content-between align-items-center">
        {/* Nút Trước (disabled ở câu đầu tiên) */}
        <Button
          variant="outline-secondary"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
        >
          ← Trước
        </Button>

        {/* Nút Tiếp / Nộp bài */}
        {index < total - 1 ? (
          <Button
            variant="primary"
            onClick={() => setIndex((i) => i + 1)}
            disabled={selected === undefined}
          >
            Tiếp →
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={() => setFinished(true)}
            disabled={answeredCount < total}
            className="fw-semibold"
          >
            ✓ Nộp bài
          </Button>
        )}
      </div>
    </Card>
  );
}

// Component cha: Quản lý số lần làm bài (attempt) và reset qua prop key
export default function QuizApp() {
  const [attempt, setAttempt] = useState(1);

  return (
    <Container className="py-4" style={{ maxWidth: '720px' }}>
      {/* Tiêu đề ứng dụng */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Bài 5: Quiz trắc nghiệm</h2>
        <div className="mt-2">
          <Badge bg="secondary" className="fs-6 py-2 px-3 fw-normal">
            Lượt làm bài thứ <strong>{attempt}</strong>
          </Badge>
        </div>
      </div>

      {/* Component Quiz với prop key={attempt} để reset toàn bộ state khi tăng attempt */}
      <Quiz key={attempt} onRestart={() => setAttempt((a) => a + 1)} />

      {/* Ghi chú kiến thức */}
      <Alert variant="info" className="mt-4 shadow-sm">
        <div className="fw-bold mb-1">💡 Kiến thức trọng tâm:</div>
        <small>
          - <strong>Lazy Initializer:</strong> Dùng <code>useState(() =&gt; shuffle(QUESTIONS))</code>{' '}
          giúp câu hỏi chỉ bị xáo 1 lần khi bắt đầu, không bị xáo lại mỗi lần chọn đáp án.<br />
          - <strong>Reset state bằng <code>key</code>:</strong> Khi bấm <em>"Làm lại bài thi"</em>,{' '}
          ta chỉ cần tăng <code>attempt</code> làm thay đổi prop <code>key</code>. React coi đây là một component hoàn toàn mới và tự động khởi tạo lại mọi thứ từ đầu mà không cần viết các lệnh reset thủ công!
        </small>
      </Alert>
    </Container>
  );
}
