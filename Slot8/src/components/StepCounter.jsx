import { useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const MIN = 0;
const MAX = 100;

// 1. Hằng số action: gõ sai tên sẽ báo lỗi ngay khi import
const ACTIONS = {
  INCREMENT: 'counter/increment',
  DECREMENT: 'counter/decrement',
  SET_STEP: 'counter/setStep',
  RESET: 'counter/reset',
};

const initialState = { count: 0, step: 1, history: [] };

const clamp = (n) => Math.min(MAX, Math.max(MIN, n));

// 2. Reducer thuần: (state, action) => state mới
const counterReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.INCREMENT:
    case ACTIONS.DECREMENT: {
      const delta = action.type === ACTIONS.INCREMENT ? state.step : -state.step;
      const next = clamp(state.count + delta);
      if (next === state.count) return state; // không đổi → trả về state cũ, React bỏ qua render
      return {
        ...state,
        count: next,
        history: [`${state.count} → ${next}`, ...state.history].slice(0, 5),
      };
    }
    case ACTIONS.SET_STEP:
      return { ...state, step: action.payload };
    case ACTIONS.RESET:
      return initialState;
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};

const StepCounter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  const { count, step, history } = state;

  return (
    <Card style={{ maxWidth: 460 }} className="shadow-sm mx-auto">
      <Card.Body>
        <Card.Title className="text-center fw-bold">Bài 1: Bộ đếm có bước nhảy &amp; lịch sử</Card.Title>
        <p className="text-muted text-center small mb-3">Giới hạn 0 - 100, lưu tối đa 5 bước gần nhất</p>
        <div className="display-4 text-center my-3 text-primary fw-bold">{count}</div>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Button
            variant="outline-secondary"
            disabled={count <= MIN}
            onClick={() => dispatch({ type: ACTIONS.DECREMENT })}
          >
            {`− ${step}`}
          </Button>
          <Button
            variant="primary"
            disabled={count >= MAX}
            onClick={() => dispatch({ type: ACTIONS.INCREMENT })}
          >
            {`+ ${step}`}
          </Button>
          <Button variant="outline-danger" onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Đặt lại
          </Button>
        </div>

        <Form.Group className="mb-3" controlId="step-select">
          <Form.Label className="fw-semibold">Bước nhảy</Form.Label>
          <Form.Select
            value={step}
            onChange={(e) => dispatch({ type: ACTIONS.SET_STEP, payload: Number(e.target.value) })}
          >
            {[1, 5, 10, 25].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <h6 className="fw-bold">5 thay đổi gần nhất</h6>
        <ListGroup>
          {history.length === 0 && <ListGroup.Item className="text-muted">Chưa có thay đổi</ListGroup.Item>}
          {history.map((line, i) => (
            <ListGroup.Item key={`${line}-${i}`} className="font-monospace small">
              {line}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default StepCounter;
