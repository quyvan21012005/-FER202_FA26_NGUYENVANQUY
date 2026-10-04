import { useReducer, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import {
  COLUMNS, taskReducer, initialTaskState,
  addTask, moveTask, renameTask, deleteTask, clearDone,
} from './taskReducer';

const PRIORITY = {
  high: { label: 'Cao', bg: 'danger' },
  low: { label: 'Thấp', bg: 'secondary' },
};

const TaskCard = ({ task, isFirst, isLast, dispatch }) => {
  const { id, title, priority } = task;
  return (
    <Card className="mb-2 shadow-sm border-0">
      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <span
            className="fw-medium text-dark cursor-pointer"
            title="Nhấp đúp để đổi tên"
            onDoubleClick={() => {
              const next = window.prompt('Tên mới', title);
              if (next !== null) dispatch(renameTask(id, next));
            }}
          >
            {title}
          </span>
          <Badge bg={PRIORITY[priority].bg}>{PRIORITY[priority].label}</Badge>
        </div>
        <div className="d-flex gap-1 mt-2">
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={isFirst}
            onClick={() => dispatch(moveTask(id, -1))}
          >
            ←
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={isLast}
            onClick={() => dispatch(moveTask(id, 1))}
          >
            →
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            className="ms-auto"
            onClick={() => dispatch(deleteTask(id))}
          >
            Xóa
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const KanbanBoard = () => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  // State giao diện đơn giản vẫn dùng useState
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [filter, setFilter] = useState('all');

  const visible = state.tasks.filter((t) => filter === 'all' || t.priority === filter);
  const doneCount = state.tasks.filter((t) => t.column === 'done').length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addTask(title, priority));
    setTitle('');
  };

  return (
    <div>
      <Row className="g-2 mb-3">
        <Col md={7}>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control
                placeholder="Tên  công việc mới..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Select
                style={{ maxWidth: 110 }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Thấp</option>
                <option value="high">Cao</option>
              </Form.Select>
              <Button type="submit" variant="primary" disabled={!title.trim()}>
                Thêm thẻ
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Lọc ưu tiên"
          >
            <option value="all">Mọi mức ưu tiên</option>
            <option value="high">Chỉ ưu tiên cao</option>
            <option value="low">Chỉ ưu tiên thấp</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-success"
            className="w-100"
            disabled={doneCount === 0}
            onClick={() => dispatch(clearDone())}
          >
            Dọn cột xong
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {COLUMNS.map(({ key, title: columnTitle }, colIndex) => {
          const tasks = visible.filter((t) => t.column === key);
          return (
            <Col md={4} key={key}>
              <Card bg="light" className="h-100 shadow-sm border-0">
                <Card.Header className="d-flex justify-content-between align-items-center fw-bold bg-white border-bottom">
                  <span>{columnTitle}</span>
                  <Badge bg="dark" pill>{tasks.length}</Badge>
                </Card.Header>
                <Card.Body className="p-2" data-column={key}>
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      dispatch={dispatch}
                      isFirst={colIndex === 0}
                      isLast={colIndex === COLUMNS.length - 1}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-muted text-center py-3 small">
                      (Trống)
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default KanbanBoard;
