import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import TheoryReview from './components/TheoryReview';
import StepCounter from './components/StepCounter';
import OrderTracker from './components/OrderTracker';
import KanbanBoard from './components/KanbanBoard';
import CourseWizard from './components/CourseWizard';
import NotesBoard from './components/NotesBoard';

const CHECKLIST_ITEMS = [
  {
    category: 'Khi nào dùng useReducer',
    items: [
      'Chỉ chuyển sang useReducer khi state có nhiều phần liên quan hoặc nhiều kiểu cập nhật.',
      'State giao diện nhỏ (ô nhập tạm, bộ lọc, menu mở) vẫn để useState, không nhét hết vào reducer.',
      'Dữ liệu tính được (tổng, danh sách đã lọc, isValid, nút được phép bấm) tính khi render, không lưu trong state.',
    ],
  },
  {
    category: 'Khai báo & Cấu trúc',
    items: [
      'useReducer được gọi ở cấp cao nhất của component, như mọi hook.',
      'Reducer và initialState khai báo bên ngoài component (hoặc file .js riêng).',
      'State ban đầu phụ thuộc props hoặc tốn công tính thì dùng tham số thứ 3 init; case reset gọi lại init.',
      'Higher-order reducer (như undoable) được gọi 1 lần bên ngoài component.',
    ],
  },
  {
    category: 'Reducer thuần (Pure Function)',
    items: [
      'Mọi case đều return một state mới bất biến; case có khai báo biến được bọc trong { }.',
      'Không sửa trực tiếp state: dùng spread operator, map, filter; copy từng cấp lồng nhau.',
      'Giữ lại các trường không đổi bằng ...state.',
      'Không gọi API, setTimeout, localStorage, alert, dispatch, setState trong reducer.',
      'Không dùng Math.random(), Date.now() trong reducer; tạo ở event handler rồi đưa vào action.',
      'Action không làm thay đổi gì thì return state (cùng tham chiếu).',
    ],
  },
  {
    category: 'Thiết kế Action & Dispatch',
    items: [
      'Action mô tả sự kiện (task/moved), không phải lệnh gán cả state (setTasks).',
      'type là hằng số hoặc chuỗi theo mẫu miền/sự kiện (counter/increment).',
      'payload chỉ chứa dữ liệu reducer chưa biết, không gửi cả state.',
      'Không đọc state ngay sau dispatch mong có giá trị mới (state là snapshot).',
      'Logic bất đồng bộ nằm trong event handler: dispatch(start) -> await -> dispatch(success/failure).',
    ],
  },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('theory');

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold d-flex align-items-center gap-2">
            <span>⚛️ FER202 - Slot 8: useReducer Hook &amp; Components</span>
          </Navbar.Brand>
          <span className="badge bg-primary fs-6 px-3 py-2">React 19 + Bootstrap</span>
        </Container>
      </Navbar>

      <Container>
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'theory')}>
          <div className="bg-white p-3 rounded shadow-sm mb-4 border">
            <Nav variant="pills" className="flex-wrap gap-2">
              <Nav.Item>
                <Nav.Link eventKey="theory" className="fw-semibold">
                  📖 Lý thuyết &amp; Hỏi đáp
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ex1" className="fw-semibold">
                  Bài 1: Bộ đếm bước nhảy
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ex2" className="fw-semibold">
                  Bài 2: Máy trạng thái Đơn hàng
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ex3" className="fw-semibold">
                  Bài 3: Bảng Kanban
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ex4" className="fw-semibold">
                  Bài 4: Đăng ký Khóa học
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ex5" className="fw-semibold">
                  Bài 5: Ghi chú Undo/Redo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="checklist" className="fw-semibold">
                  ✅ Checklist kiểm tra
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content>
            {/* Lý thuyết & Hỏi đáp */}
            <Tab.Pane eventKey="theory">
              <TheoryReview />
            </Tab.Pane>

            {/* Bài 1 */}
            <Tab.Pane eventKey="ex1">
              <div className="py-2">
                <div className="text-center mb-3">
                  <Badge bg="primary" className="mb-2">Bài tập 1</Badge>
                  <h3>Bộ đếm có bước nhảy và lịch sử</h3>
                  <p className="text-muted">
                    Minh họa cơ chế cơ bản của <code>useReducer</code>: kẹp min-max, ghi lịch sử, bỏ qua render khi không thay đổi.
                  </p>
                </div>
                <StepCounter />
              </div>
            </Tab.Pane>

            {/* Bài 2 */}
            <Tab.Pane eventKey="ex2">
              <div className="py-2">
                <div className="text-center mb-3">
                  <Badge bg="info" className="mb-2 text-dark">Bài tập 2</Badge>
                  <h3>Theo dõi trạng thái đơn hàng (Finite State Machine)</h3>
                  <p className="text-muted">
                    Mô hình máy trạng thái (FSM) với bảng <code>TRANSITIONS</code>, chặn chuyển đổi sai luật, ghi nhận dòng thời gian.
                  </p>
                </div>
                <OrderTracker />
              </div>
            </Tab.Pane>

            {/* Bài 3 */}
            <Tab.Pane eventKey="ex3">
              <div className="py-2">
                <div className="text-center mb-3">
                  <Badge bg="success" className="mb-2">Bài tập 3</Badge>
                  <h3>Bảng công việc Kanban (Tách file Reducer &amp; Action Creator)</h3>
                  <p className="text-muted">
                    Tách logic reducer ra file JS độc lập thuần túy, kết hợp <code>useReducer</code> (state dữ liệu) và <code>useState</code> (state lọc/nhập UI).
                  </p>
                </div>
                <KanbanBoard />
              </div>
            </Tab.Pane>

            {/* Bài 4 */}
            <Tab.Pane eventKey="ex4">
              <div className="py-2">
                <div className="text-center mb-3">
                  <Badge bg="warning" className="mb-2 text-dark">Bài tập 4</Badge>
                  <h3>Form đăng ký khóa học nhiều bước (Wizard Form)</h3>
                  <p className="text-muted">
                    Khởi tạo state bằng hàm <code>init(initialCourseId)</code>, kiểm tra lỗi form theo từng bước, điều hướng chỉ cho phép nhảy tới bước đã qua.
                  </p>
                </div>
                <CourseWizard initialCourseId="react" />
              </div>
            </Tab.Pane>

            {/* Bài 5 */}
            <Tab.Pane eventKey="ex5">
              <div className="py-2">
                <div className="text-center mb-3">
                  <Badge bg="danger" className="mb-2">Bài tập 5</Badge>
                  <h3>Bảng ghi chú có Hoàn tác / Làm lại (Higher-Order Reducer)</h3>
                  <p className="text-muted">
                    Higher-order reducer <code>undoable(reducer)</code> quản lý <code>past/present/future</code> cho bất kỳ reducer nào; hỗ trợ phím tắt <code>Ctrl+Z</code> và <code>Ctrl+Y</code>.
                  </p>
                </div>
                <NotesBoard />
              </div>
            </Tab.Pane>

            {/* Checklist */}
            <Tab.Pane eventKey="checklist">
              <div className="py-2">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h4 className="fw-bold text-success mb-3">
                      ✅ Checklist chuẩn khi viết <code>useReducer</code> trong React
                    </h4>
                    <p className="text-muted">
                      Rà soát theo các tiêu chí dưới đây để đảm bảo code sạch, không phát sinh bug và tuân thủ các quy tắc bất biến.
                    </p>
                    <div className="row g-4 mt-1">
                      {CHECKLIST_ITEMS.map((group) => (
                        <div className="col-md-6" key={group.category}>
                          <Card className="h-100 border">
                            <Card.Header className="fw-bold bg-light">
                              {group.category}
                            </Card.Header>
                            <ListGroup variant="flush">
                              {group.items.map((item, idx) => (
                                <ListGroup.Item key={idx} className="small d-flex gap-2">
                                  <span className="text-success">✔</span>
                                  <span>{item}</span>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default App;
