import { useReducer, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { undoable, createHistory } from './undoable';
import { notesReducer, initialNotes, COLORS } from './notesReducer';

// Tạo reducer có  Undo/Redo một lần, ở ngoài component
const notesWithHistory = undoable(notesReducer);

const NotesBoard = () => {
  const [history, dispatch] = useReducer(notesWithHistory, initialNotes, createHistory);
  const [text, setText] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const { past, present, future } = history;
  // Ghi chú được ghim hiển thị trước (dẫn xuất, không sửa state)
  const notes = [...present.items].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'ADD_NOTE', payload: { text, color } });
    setText('');
  };

  // Phím tắt trên vùng bảng ghi chú: Ctrl+Z / Ctrl+Y
  const handleKeyDown = (e) => {
    if (!e.ctrlKey) return;
    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      dispatch({ type: 'UNDO' });
    }
    if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      dispatch({ type: 'REDO' });
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} className="p-2 outline-none">
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <Form onSubmit={handleAdd} className="flex-grow-1">
          <InputGroup>
            <Form.Control
              placeholder="Nhập nội dung ghi chú mới..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Form.Select
              style={{ maxWidth: 120 }}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Màu"
            >
              {COLORS.map((c, i) => (
                <option key={c} value={c}>{`Màu ${i + 1}`}</option>
              ))}
            </Form.Select>
            <Button type="submit" variant="primary" disabled={!text.trim()}>
              Thêm ghi chú
            </Button>
          </InputGroup>
        </Form>
        <ButtonGroup>
          <Button
            variant="outline-dark"
            disabled={past.length === 0}
            onClick={() => dispatch({ type: 'UNDO' })}
            title="Ctrl + Z"
          >
            {`↶ Hoàn tác (${past.length})`}
          </Button>
          <Button
            variant="outline-dark"
            disabled={future.length === 0}
            onClick={() => dispatch({ type: 'REDO' })}
            title="Ctrl + Y"
          >
            {`↷ Làm lại (${future.length})`}
          </Button>
        </ButtonGroup>
        <Button
          variant="outline-danger"
          onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          disabled={present.items.length === 0}
        >
          Xóa hết
        </Button>
      </div>

      <p className="text-muted small mb-3">
        Mẹo: Hỗ trợ phím tắt <code>Ctrl + Z</code> để Hoàn tác và <code>Ctrl + Y</code> để Làm lại (nhấp vào bảng trước khi bấm phím).
      </p>

      <Row xs={1} sm={2} md={3} className="g-3">
        {notes.map(({ id, text: noteText, color: noteColor, pinned }) => (
          <Col key={id}>
            <Card
              style={{ background: noteColor, minHeight: 140 }}
              className="h-100 border-0 shadow-sm"
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Text className="fw-medium text-dark mb-3">
                  {pinned && <span className="me-1">📌</span>}
                  {noteText}
                </Card.Text>
                <div className="d-flex gap-2 align-items-center pt-2 border-top border-black-25">
                  <div className="d-flex gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Đổi màu ${c}`}
                        onClick={() =>
                          dispatch({ type: 'CHANGE_COLOR', payload: { id, color: c } })
                        }
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: c,
                          border: c === noteColor ? '2px solid #212529' : '1px solid #ced4da',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="link"
                    className="ms-auto p-0 text-decoration-none fw-semibold"
                    onClick={() => dispatch({ type: 'TOGGLE_PIN', payload: id })}
                  >
                    {pinned ? 'Bỏ ghim' : 'Ghim'}
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-danger p-0 ms-2 text-decoration-none fw-semibold"
                    onClick={() => dispatch({ type: 'DELETE', payload: id })}
                  >
                    Xóa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {notes.length === 0 && (
        <div className="text-center py-5 bg-light rounded text-muted">
          Chưa có ghi chú nào. Hãy tạo một ghi chú mới hoặc bấm &quot;Hoàn tác&quot;!
        </div>
      )}
    </div>
  );
};

export default NotesBoard;
