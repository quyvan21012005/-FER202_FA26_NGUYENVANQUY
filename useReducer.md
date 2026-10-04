# useReducer trong ReactJS – Lý thuyết, 5 bài tập áp dụng và checklist lưu ý

Ngày tạo: 2026-09-27

Tài liệu này đi sâu vào `useReducer`, hook dùng để quản lý state có nhiều phần liên quan và nhiều kiểu cập nhật. Nên học sau useState.md, vì `useReducer` dùng lại toàn bộ kiến thức về cập nhật bất biến và dữ liệu dẫn xuất. Các bài tập ở đây khác với giỏ hàng và form đăng nhập trong Hook.md.

| Phần | Nội dung |
| --- | --- |
| A | Lý thuyết `useReducer` (13 mục, từ cơ bản đến nâng cao) |
| B | 5 bài tập áp dụng, mỗi bài có mục tiêu, yêu cầu, các bước làm, tiêu chí hoàn thành |
| C | Đáp án mẫu (đã build và chạy thử bằng Vite + React 19 + React-Bootstrap 2) |
| D | Checklist lưu ý khi dùng `useReducer` |

**Chuẩn bị:** dùng lại project của ES6.md/Hook.md/useState.md. Tạo thư mục `src/usereducer` để chứa các file của tài liệu này.

---

## Phần A. Lý thuyết `useReducer`

### A1. Vấn đề: khi `useState` bắt đầu rối

Xét một bộ đếm có bước nhảy, giới hạn và lịch sử:

```jsx
const [count, setCount] = useState(0);
const [step, setStep] = useState(1);
const [history, setHistory] = useState([]);

const increase = () => {
  const next = Math.min(count + step, 100);
  setCount(next);
  setHistory((h) => [`${count} → ${next}`, ...h]);
};
const decrease = () => { /* lặp lại gần như y hệt */ };
const reset = () => { setCount(0); setStep(1); setHistory([]); }; // dễ quên một state
```

Dấu hiệu nên chuyển sang `useReducer`:

- Nhiều state **luôn thay đổi cùng nhau** (`count` và `history`).
- Một thao tác phải gọi **nhiều hàm `set`**, dễ quên hoặc sai thứ tự.
- Logic cập nhật **rải rác** trong nhiều hàm xử lý sự kiện, khó đọc, khó kiểm thử.
- State mới phụ thuộc vào **nhiều phần** của state cũ.

`useReducer` gom toàn bộ “state thay đổi thế nào” vào **một hàm duy nhất** gọi là reducer; component chỉ cần báo “chuyện gì vừa xảy ra”.

### A2. Bốn khái niệm và luồng dữ liệu

| Khái niệm | Là gì | Ví dụ |
| --- | --- | --- |
| **State** | Dữ liệu hiện tại (thường là object) | `{ count: 5, step: 1, history: [...] }` |
| **Action** | Object mô tả **sự kiện đã xảy ra** | `{ type: 'counter/increment' }`, `{ type: 'counter/setStep', payload: 5 }` |
| **Reducer** | Hàm thuần `(state, action) => newState` | `counterReducer` |
| **Dispatch** | Hàm gửi action tới reducer | `dispatch({ type: 'counter/reset' })` |

Luồng một chiều:

```
Người dùng bấm nút
      │
      ▼
dispatch(action) ──► reducer(stateHiệnTại, action) ──► stateMới
                                                          │
      ▲                                                   ▼
Giao diện hiển thị theo state  ◄──────────  React render lại component
```

Tên “reducer” đến từ `Array.prototype.reduce`: `actions.reduce(reducer, initialState)` cho ra state cuối cùng. Có thể coi state hiện tại là kết quả của việc “cộng dồn” mọi action từ đầu.

### A3. Cú pháp

```jsx
import { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialArg);
const [state, dispatch] = useReducer(reducer, initialArg, init); // state ban đầu = init(initialArg)
```

- `reducer`: hàm `(state, action) => newState`, nên khai báo **bên ngoài** component (hoặc file riêng).
- `initialArg`: state ban đầu (hoặc đối số truyền vào `init`).
- `init` (không bắt buộc): hàm dựng state ban đầu, chỉ chạy ở lần render đầu (tương tự lazy initializer của `useState`).
- Trả về `[state, dispatch]`. `dispatch` **không bao giờ đổi** giữa các lần render, nên có thể truyền xuống component con thoải mái.

### A4. Viết reducer

```js
const initialState = { count: 0, step: 1 };

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, count: state.count + state.step };
    case 'counter/setStep':
      return { ...state, step: action.payload };
    case 'counter/reset':
      return initialState;
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
```

Quy ước:

- Dùng `switch (action.type)`; mỗi `case` **return** một state (quên `return` sẽ rơi xuống `case` sau hoặc trả `undefined`).
- Khi một `case` cần khai báo biến, bọc trong `{ }` để tránh trùng tên biến giữa các `case`.
- `default` nên `throw new Error(...)` để phát hiện ngay action gõ sai tên. (Nếu reducer được dùng chung với các action không phải của nó, có thể `return state`.)
- Luôn giữ nguyên các trường không liên quan bằng `...state`.

### A5. Reducer phải là hàm thuần

Với cùng `state` và `action`, reducer phải luôn trả về cùng kết quả và không gây tác dụng phụ.

| Được làm trong reducer | Không được làm trong reducer |
| --- | --- |
| Đọc `state`, `action` | Sửa trực tiếp `state` (`state.count++`, `state.items.push(...)`) |
| Tạo object/mảng mới bằng spread, `map`, `filter` | Gọi API, `fetch`, `axios`, `setTimeout` |
| Tính toán, kiểm tra điều kiện, validation | `Math.random()`, `Date.now()`, `new Date()` (kết quả mỗi lần gọi khác nhau) |
| Trả về `state` cũ khi không có gì thay đổi | Gọi `dispatch`, `setState`, `alert`, `localStorage` |

Cần giá trị ngẫu nhiên hay thời gian? Tạo **trong hàm xử lý sự kiện** rồi đưa vào action: `dispatch({ type: 'order/ship', at: new Date().toISOString() })`. Cần id mới? Có thể đưa vào action, hoặc lưu `nextId` ngay trong state để reducer tự tăng.

Ở chế độ `StrictMode` (khi dev), React cố tình **gọi reducer hai lần** để phát hiện reducer không thuần. Nếu thấy dữ liệu bị thêm hai lần, đó là dấu hiệu reducer đang sửa trực tiếp state.

### A6. Thiết kế action

- **Mô tả sự kiện, không mô tả lệnh gán:** `{ type: 'task/moved', payload: { id, direction } }` tốt hơn `{ type: 'setTasks', payload: newTasks }` (kiểu sau đẩy logic ngược về component, mất ý nghĩa của reducer).
- **Tên `type` theo mẫu `miền/sự kiện`:** `cart/add`, `order/cancel`, `wizard/next`. Giúp đọc log và tránh trùng khi ứng dụng lớn dần.
- **`payload` tối thiểu:** chỉ gửi thứ reducer không tự biết (`id`, giá trị ô nhập), không gửi cả state.
- **Hằng số action** để tránh gõ sai:

```js
export const ACTIONS = { INCREMENT: 'counter/increment', RESET: 'counter/reset' };
dispatch({ type: ACTIONS.INCREMENT });
```

- **Action creator**: hàm nhỏ tạo action, gọn và nhất quán ở component:

```js
export const moveTask = (id, direction) => ({ type: 'tasks/move', payload: { id, direction } });
dispatch(moveTask(3, 1));
```

### A7. Cập nhật bất biến và trả về state cũ

Mọi quy tắc cập nhật bất biến của `useState` đều áp dụng cho reducer (xem useState.md mục A7):

```js
case 'todos/add':    return { ...state, todos: [...state.todos, action.payload] };
case 'todos/toggle': return { ...state, todos: state.todos.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t)) };
case 'todos/remove': return { ...state, todos: state.todos.filter((t) => t.id !== action.payload) };
```

Nếu action không làm thay đổi gì (đã chạm giới hạn, dữ liệu không hợp lệ), hãy **return `state`** (cùng tham chiếu). React so sánh bằng `Object.is`, thấy không đổi sẽ bỏ qua render. Kỹ thuật này còn giúp các mẫu nâng cao như Undo (A12) biết action nào thực sự có tác dụng.

### A8. `dispatch` hoạt động thế nào

- Giống `setState`: `dispatch` **không đổi `state` ngay**. Ngay sau `dispatch`, biến `state` trong hàm vẫn là giá trị cũ (snapshot). Cần giá trị mới thì tính lại bằng chính reducer: `const next = reducer(state, action);`.
- Nhiều `dispatch` trong một sự kiện được **gộp** thành một lần render (batching), và React xử lý các action **lần lượt theo thứ tự** (action sau nhận state do action trước tạo ra), nên không cần “functional update” như `useState`.
- `dispatch` không trả về giá trị.
- Logic bất đồng bộ (gọi API) đặt trong hàm xử lý sự kiện: `dispatch({ type: 'loading' })` → `await api()` → `dispatch({ type: 'success', payload })` hoặc `dispatch({ type: 'failure', error })`.

### A9. Hàm `init` và reset state

```js
const init = (courseId) => ({ step: 0, values: { courseId, fullName: '' }, errors: {} });

const [state, dispatch] = useReducer(wizardReducer, props.initialCourseId, init);

// Trong reducer: reset về đúng trạng thái ban đầu
case 'wizard/reset': return init(action.payload);
```

Dùng `init` khi state ban đầu phụ thuộc props hoặc tốn công tính. Dùng lại `init` trong `case` reset giúp không phải viết lại object ban đầu hai lần.

### A10. Chọn `useState` hay `useReducer`?

| Tiêu chí | `useState` | `useReducer` |
| --- | --- | --- |
| Hình dạng state | Vài giá trị độc lập, đơn giản | Object nhiều phần liên quan |
| Số kiểu cập nhật | Ít (gán, bật/tắt) | Nhiều (thêm, sửa, xóa, chuyển bước, reset…) |
| Vị trí logic | Trong các hàm xử lý của component | Tập trung trong reducer, component gọn |
| Đọc hiểu | Nhanh với logic nhỏ | Rõ ràng hơn khi logic lớn: nhìn danh sách action là biết component làm được gì |
| Kiểm thử | Phải render component | Gọi thẳng hàm reducer, không cần React |
| Gỡ lỗi | Khó biết state đổi vì đâu | Log `action` + state trước/sau là thấy ngay |
| Lượng code | Ít | Nhiều hơn (action, switch) |

Hai hook **dùng chung được** trong một component: reducer cho dữ liệu chính, `useState` cho state giao diện nhỏ (ô nhập tạm, bộ lọc, trạng thái mở menu).

### A11. Reducer như một máy trạng thái (state machine)

Với dữ liệu có **vòng đời** (đơn hàng, quy trình duyệt, form nhiều bước), mô tả bằng bảng chuyển trạng thái giúp chặn các thao tác vô lý:

```js
const TRANSITIONS = {
  pending:   { CONFIRM: 'confirmed', CANCEL: 'cancelled' },
  confirmed: { SHIP: 'shipping', CANCEL: 'cancelled' },
  shipping:  { DELIVER: 'delivered' },
  delivered: {},
  cancelled: {},
};

const reducer = (state, action) => {
  const next = TRANSITIONS[state.status][action.type];
  return next ? { ...state, status: next } : state; // sự kiện không hợp lệ → giữ nguyên
};
```

Danh sách nút được phép bấm cũng suy ra từ bảng: `Object.keys(TRANSITIONS[state.status])`.

### A12. Kiểm thử reducer và các mẫu nâng cao

**Kiểm thử:** reducer là hàm JavaScript thuần, kiểm tra được mà không cần giao diện:

```js
const s1 = counterReducer({ count: 0, step: 5 }, { type: 'counter/increment' });
console.assert(s1.count === 5, 'Tăng theo step');

// Với Jest
test('không vượt quá 100', () => {
  expect(counterReducer({ count: 98, step: 5, history: [] }, { type: 'counter/increment' }).count).toBe(100);
});
```

**Higher-order reducer:** hàm nhận một reducer và trả về reducer mới có thêm tính năng, ví dụ Undo/Redo, ghi log:

```js
const withLogger = (reducer) => (state, action) => {
  const next = reducer(state, action);
  console.log(action.type, { before: state, after: next });
  return next;
};
const [state, dispatch] = useReducer(withLogger(counterReducer), initialState);
```

(Hàm bọc nên tạo **một lần** ở ngoài component, như ở Bài 5.)

**`useReducer` + `useContext`:** đặt `state` và `dispatch` vào Context để nhiều component cùng đọc và gửi action, tạo thành một “store” nhỏ không cần thư viện (xem Hook.md Bài 10 với `CartContext`).

**Immer:** với state lồng sâu, thư viện `use-immer` cung cấp `useImmerReducer` cho phép viết như sửa trực tiếp (`draft.items.push(x)`) nhưng vẫn tạo state mới bất biến. Nên nắm cách viết spread thủ công trước khi dùng.

### A13. Tổ chức file

```
src/usereducer/
├── taskReducer.js      // initialState, ACTIONS, action creators, reducer (thuần JS, không import React)
├── KanbanBoard.jsx     // component: useReducer(taskReducer, initialTaskState) và giao diện
```

Tách reducer ra file `.js` riêng giúp component ngắn gọn, reducer tái sử dụng được (dùng cho Context) và kiểm thử độc lập.

---

## Phần B. 5 bài tập áp dụng

| Bài | Kiến thức `useReducer` chính | Giao diện |
| --- | --- | --- |
| 1 | Chuyển từ nhiều `useState` sang reducer, hằng số action, `default` báo lỗi, trả về state cũ | Bộ đếm có bước nhảy và lịch sử |
| 2 | Reducer là máy trạng thái, chặn sự kiện không hợp lệ, đưa thời gian vào action | Theo dõi trạng thái đơn hàng |
| 3 | Reducer tách file, action creator, `nextId` trong state, kết hợp `useState` cho giao diện | Bảng Kanban |
| 4 | Hàm `init` (tham số thứ 3), validation theo từng bước, reset bằng `init` | Form đăng ký khóa học nhiều bước |
| 5 | Higher-order reducer, lịch sử `past/present/future` | Bảng ghi chú có Hoàn tác / Làm lại |

### Bài 1: Bộ đếm có bước nhảy và lịch sử (reducer đầu tiên)

**Mục tiêu:** viết reducer đầu tiên, khai báo hằng số action, dùng `payload`, trả về state cũ khi không có thay đổi, báo lỗi với action lạ.

**Yêu cầu:** component `StepCounter` hiển thị số lớn ở giữa, nút `− step`, `+ step`, “Đặt lại”, select bước nhảy (1, 5, 10, 25) và danh sách **5 thay đổi gần nhất** dạng `cũ → mới` (mới nhất ở trên). Giá trị luôn nằm trong 0–100; chạm giới hạn thì nút tương ứng bị mờ và không ghi thêm lịch sử. “Đặt lại” đưa cả số, bước nhảy và lịch sử về ban đầu.

**Các bước làm**

1. Tạo `src/usereducer/StepCounter.jsx`, khai báo `MIN = 0`, `MAX = 100` và hàm `clamp(n)`.
2. Khai báo object `ACTIONS` với 4 hằng: `INCREMENT`, `DECREMENT`, `SET_STEP`, `RESET` (giá trị dạng `'counter/increment'`).
3. Khai báo `initialState = { count: 0, step: 1, history: [] }` **ngoài** component.
4. Viết `counterReducer`:
    - `INCREMENT` và `DECREMENT` dùng chung một nhánh (hai `case` liên tiếp), tính `delta` theo `action.type`, `next = clamp(state.count + delta)`.
    - Nếu `next === state.count` thì `return state`.
    - Ngược lại trả về state mới, thêm `` `${state.count} → ${next}` `` vào **đầu** `history` và cắt còn 5 phần tử bằng `slice(0, 5)`.
    - `SET_STEP` dùng `action.payload`; `RESET` trả về `initialState`; `default` ném lỗi.
5. Trong component: `const [state, dispatch] = useReducer(counterReducer, initialState);` rồi destructuring `{ count, step, history }`.
6. Gắn sự kiện: `onClick={() => dispatch({ type: ACTIONS.INCREMENT })}`; select dùng `payload: Number(e.target.value)` (giá trị từ select là chuỗi).
7. Thử `dispatch({ type: 'counter/incremnt' })` (gõ sai) để thấy lỗi rõ ràng, sau đó xóa.
8. So sánh với phiên bản 3 `useState` ở mục A1: đếm số chỗ phải sửa nếu thêm yêu cầu “không ghi lịch sử khi chạm giới hạn”.

**Tiêu chí hoàn thành**

- [ ] Bấm `+ 1`, chọn bước 25 rồi bấm `+ 25` liên tục: dừng ở 100, nút `+ 25` mờ; lịch sử hiện `76 → 100 | 51 → 76 | 26 → 51 | 1 → 26 | 0 → 1`.
- [ ] Lịch sử không bao giờ quá 5 dòng và không có dòng `100 → 100`.
- [ ] “Đặt lại” đưa số về 0, bước về 1, lịch sử trống.
- [ ] Component không còn `useState` nào; reducer có `default` ném lỗi.

### Bài 2: Theo dõi trạng thái đơn hàng (máy trạng thái)

**Mục tiêu:** mô hình hóa vòng đời đơn hàng bằng bảng chuyển trạng thái, để reducer tự chặn sự kiện không hợp lệ; giữ reducer thuần khi cần thời gian thực.

**Yêu cầu:** Card “Đơn hàng #DH1024” có Badge trạng thái và 4 nút sự kiện: Xác nhận, Giao hàng, Đã nhận hàng, Hủy đơn. Luồng hợp lệ:

```
Chờ xác nhận ──Xác nhận──► Đã xác nhận ──Giao hàng──► Đang giao ──Đã nhận hàng──► Đã giao
     │                           │
     └───────Hủy đơn─────────────┴──────────► Đã hủy
```

- Nút nào không hợp lệ ở trạng thái hiện tại thì bị mờ. Thêm một nút thử “Thử gửi SHIP” (luôn bấm được) để kiểm tra reducer tự chặn: khi không hợp lệ hiện `Alert` đỏ `Không thể "SHIP" khi đơn đang "Chờ xác nhận"`.
- Ô “Lý do hủy” chỉ hiện khi đơn còn hủy được; hủy mà lý do dưới 5 ký tự thì báo lỗi, không hủy.
- Dòng thời gian (timeline) liệt kê các trạng thái đã qua kèm giờ. Khi đơn đã giao hoặc đã hủy, hiện nút “Tạo đơn mới”.

**Các bước làm**

1. Tạo `src/usereducer/OrderTracker.jsx`, khai báo 3 object: `TRANSITIONS` (bảng chuyển), `STATUS_INFO` (nhãn + màu Badge), `EVENT_LABELS` (chữ trên nút).
2. `initialState = { status: 'pending', cancelReason: '', error: '', timeline: [{ status: 'pending', at: '08:00' }] }`.
3. Viết `orderReducer`:
    - `SET_REASON`: cập nhật `cancelReason`, xóa `error`. `RESET`: về `initialState`.
    - Các sự kiện còn lại: tra `TRANSITIONS[state.status][action.type]`. Không có → trả state với `error`.
    - `CANCEL` mà lý do chưa đủ 5 ký tự → trả state với `error`.
    - Hợp lệ → đổi `status`, xóa `error`, thêm `{ status: next, at: action.at }` vào `timeline`.
4. Giờ hiện tại lấy **trong hàm xử lý**: `onClick={() => dispatch({ type: event, at: now() })}`. Giải thích vì sao không gọi `new Date()` trong reducer.
5. Trong component tính `allowedEvents = Object.keys(TRANSITIONS[status])` và `isFinal = allowedEvents.length === 0` (dữ liệu dẫn xuất).
6. Sinh 4 nút bằng `Object.keys(EVENT_LABELS).map(...)`, `disabled={!allowedEvents.includes(event)}`.
7. Ô lý do hiện bằng `{allowedEvents.includes('CANCEL') && <Form.Control ... />}` và gửi `SET_REASON` trong `onChange`.

**Tiêu chí hoàn thành**

- [ ] Bấm “Thử gửi SHIP” khi đang “Chờ xác nhận”: trạng thái giữ nguyên, hiện thông báo lỗi.
- [ ] Bấm “Hủy đơn” khi chưa nhập lý do: báo “Nhập lý do hủy (ít nhất 5 ký tự)”.
- [ ] Đi hết luồng Xác nhận → Giao hàng → Đã nhận hàng: timeline có 4 dòng, ô lý do biến mất từ bước “Đang giao”, cuối cùng hiện “Tạo đơn mới”.
- [ ] Tạo đơn mới, nhập lý do “Đặt nhầm màu” rồi hủy: Badge “Đã hủy”.
- [ ] Reducer không có `new Date()`, `Date.now()` hay `if` rải rác theo từng cặp trạng thái (chỉ tra bảng `TRANSITIONS`).

### Bài 3: Bảng Kanban (reducer tách file, action creator)

**Mục tiêu:** tổ chức reducer trong file riêng cùng hằng số và action creator; giữ reducer thuần khi cần id mới; phối hợp `useReducer` (dữ liệu) và `useState` (giao diện).

**Yêu cầu:** bảng 3 cột “Cần làm”, “Đang làm”, “Hoàn thành”, mỗi cột có Badge đếm số thẻ. Mỗi thẻ có tên, Badge ưu tiên (Cao đỏ / Thấp xám), nút `←` `→` để chuyển cột (mờ ở cột đầu/cuối), nút Xóa; nhấp đúp vào tên để đổi tên (dùng `window.prompt`). Phía trên: ô nhập tên + chọn ưu tiên + “Thêm” (thẻ mới vào cột “Cần làm”), select lọc theo ưu tiên, nút “Dọn cột xong” (mờ khi cột Hoàn thành trống).

Dữ liệu ban đầu:

```js
export const initialTaskState = {
  nextId: 4,
  tasks: [
    { id: 1, title: 'Đọc lý thuyết useReducer', priority: 'high', column: 'done' },
    { id: 2, title: 'Làm bài Kanban', priority: 'high', column: 'doing' },
    { id: 3, title: 'Ôn lại spread operator', priority: 'low', column: 'todo' },
  ],
};
```

**Các bước làm**

1. Tạo `src/usereducer/taskReducer.js` (file JS thuần, không import React). Export `COLUMNS`, `TASK_ACTIONS`, `initialTaskState`.
2. Viết 5 action creator: `addTask(title, priority)`, `moveTask(id, direction)`, `renameTask(id, title)`, `deleteTask(id)`, `clearDone()`.
3. Viết `taskReducer`:
    - `ADD`: bỏ qua tên rỗng (`return state`); id mới lấy từ `state.nextId`, tăng `nextId` lên 1.
    - `MOVE`: tính vị trí cột mới từ mảng thứ tự cột; vượt biên thì giữ nguyên thẻ.
    - `RENAME`: bỏ qua tên rỗng (người dùng bấm OK với ô trống); `DELETE`, `CLEAR_DONE` dùng `filter`.
4. Tạo `src/usereducer/KanbanBoard.jsx`: `useReducer(taskReducer, initialTaskState)` cho danh sách thẻ; `useState` cho `title`, `priority`, `filter` của thanh công cụ.
5. Viết component con `TaskCard({ task, isFirst, isLast, dispatch })`: nhận thẳng `dispatch` qua props và gọi `dispatch(moveTask(id, 1))`.
6. Tính dẫn xuất: `visible` (lọc theo ưu tiên), số thẻ từng cột, `doneCount`.
7. Render 3 cột bằng `COLUMNS.map`, mỗi cột lọc `visible` theo `column`.
8. Thử kiểm thử reducer trong Console trình duyệt hoặc file riêng: `taskReducer(initialTaskState, addTask('  ', 'low')) === initialTaskState` phải là `true`.

**Tiêu chí hoàn thành**

- [ ] Ban đầu mỗi cột có 1 thẻ. Thêm “Viết reducer” (ưu tiên Cao): cột “Cần làm” có 2 thẻ; bấm `→` ở thẻ này: “Đang làm” có 2 thẻ.
- [ ] Lọc “Chỉ ưu tiên cao”: số thẻ lần lượt 0 – 2 – 1; bỏ lọc thì hiện lại đủ (bộ lọc không làm mất dữ liệu).
- [ ] “Dọn cột xong” xóa thẻ ở cột Hoàn thành rồi tự mờ.
- [ ] Đổi tên thành công bằng nhấp đúp; bấm OK với ô trống thì tên không đổi.
- [ ] `taskReducer.js` không có `Date.now()`, `Math.random()` hay `import` từ `react`.

### Bài 4: Form đăng ký khóa học nhiều bước (hàm `init`, validation theo bước)

**Mục tiêu:** dùng tham số thứ 3 `init` để dựng state từ props, quản lý form nhiều bước (bước hiện tại, bước đã tới, dữ liệu, lỗi, đã gửi) trong một reducer, validation theo từng bước và reset bằng `init`.

**Yêu cầu:** component `CourseWizard({ initialCourseId = 'react' })`, thanh bước “1. Thông tin – 2. Khóa học – 3. Xác nhận”:

| Bước | Trường | Quy tắc |
| --- | --- | --- |
| 1 | Họ tên, Email, Số điện thoại | ≥ 3 ký tự; đúng định dạng email; 10 số bắt đầu bằng 0 |
| 2 | Khóa học (select, chọn sẵn theo `initialCourseId`), Lịch học (radio) | Bắt buộc cả hai |
| 3 | Bảng tóm tắt + checkbox “Tôi xác nhận thông tin trên là chính xác” | Bắt buộc tích |

- “Tiếp tục →” chỉ sang bước sau khi các trường **của bước hiện tại** hợp lệ; ngược lại hiện lỗi. Khi sửa một trường đang báo lỗi, lỗi của trường đó được kiểm tra lại ngay.
- “← Quay lại” luôn được (giữ nguyên dữ liệu). Thanh bước bấm được để nhảy tới những bước **đã từng tới**; bước chưa tới bị mờ.
- Bước 3 bấm “Xác nhận đăng ký” → màn hình thành công “… đã đăng ký … Học phí: …” và nút “Đăng ký khóa khác” đưa form về ban đầu (khóa học chọn lại theo `initialCourseId`).

Dữ liệu:

```js
export const COURSES = [
  { id: 'react', name: 'ReactJS cơ bản', fee: 2500000 },
  { id: 'node', name: 'NodeJS & Express', fee: 3000000 },
  { id: 'fullstack', name: 'Fullstack MERN', fee: 5000000 },
];
export const SCHEDULES = ['Sáng 2-4-6', 'Tối 3-5-7', 'Cuối tuần'];
```

**Các bước làm**

1. Tạo `src/usereducer/wizardReducer.js`: export `COURSES`, `SCHEDULES`, `STEPS`; khai báo `STEP_FIELDS` (mảng các trường của từng bước).
2. Viết `validateField(name, values)` trả về chuỗi lỗi hoặc `''`, và `validateStep(step, values)` dùng `reduce` gom lỗi của các trường trong bước.
3. Viết `initWizard(initialCourseId)` trả về `{ step: 0, maxVisited: 0, values: {...courseId: initialCourseId}, errors: {}, submitted: false }`.
4. Viết `wizardReducer` với các action: `CHANGE` (cập nhật giá trị, nếu trường đang có lỗi thì kiểm tra lại), `NEXT` (validate bước; hợp lệ thì tăng `step`, cập nhật `maxVisited`), `BACK`, `GO_TO` (chỉ khi `payload <= maxVisited`), `SUBMIT`, `RESET` (`return initWizard(action.payload)`).
5. Trong `CourseWizard.jsx`: `useReducer(wizardReducer, initialCourseId, initWizard)`.
6. Một `handleChange` cho mọi ô (checkbox đọc `checked`), gửi `{ type: 'CHANGE', payload: { name, value } }`.
7. `handleSubmit`: `preventDefault()`, bước cuối gửi `SUBMIT`, bước khác gửi `NEXT`. Nhờ vậy nhấn Enter trong ô cũng chuyển bước.
8. Viết hàm tiện ích `field(name, label, type)` trả về JSX một ô nhập để không lặp code ở bước 1.
9. Hiển thị từng bước bằng `{step === 0 && ...}`; tính `course` bằng `COURSES.find(...)` (dẫn xuất).
10. Kiểm tra: đổi `<CourseWizard initialCourseId="node" />` và xem bước 2 chọn sẵn NodeJS.

**Tiêu chí hoàn thành**

- [ ] Bấm “Tiếp tục” ở bước 1 khi trống hiện 3 lỗi; gõ đúng họ tên thì lỗi họ tên biến mất ngay.
- [ ] Sang bước 2: khóa học đã chọn sẵn “ReactJS cơ bản”, mục “3. Xác nhận” trên thanh bước bị mờ; chưa chọn lịch mà bấm tiếp thì báo “Chọn lịch học”.
- [ ] Chọn Fullstack MERN, Tối 3-5-7: bước 3 tóm tắt đúng, học phí 5.000.000 ₫.
- [ ] Bấm “1. Thông tin” quay lại vẫn còn dữ liệu; bấm “3. Xác nhận” nhảy thẳng về bước 3.
- [ ] Chưa tích xác nhận thì báo lỗi; tích rồi gửi thì hiện màn hình thành công; “Đăng ký khóa khác” đưa về bước 1 với form trống.

### Bài 5: Bảng ghi chú có Hoàn tác / Làm lại (higher-order reducer)

**Mục tiêu:** viết một higher-order reducer `undoable(reducer)` bổ sung Undo/Redo cho **bất kỳ** reducer nào mà không sửa reducer gốc; hiểu cấu trúc lịch sử `past / present / future`.

**Yêu cầu:**

- Bảng ghi chú dán (sticky notes): thêm ghi chú (nội dung + màu), đổi màu bằng các chấm tròn, Ghim/Bỏ ghim (ghi chú được ghim hiện trước và có 📌), Xóa, “Xóa hết”.
- Nút “↶ Hoàn tác (n)” và “↷ Làm lại (m)” hiện số bước có thể hoàn tác/làm lại, mờ khi bằng 0. Phím tắt `Ctrl+Z` / `Ctrl+Y` khi đang thao tác trong bảng.
- Lịch sử tối đa 20 bước. Thao tác không làm thay đổi gì (ví dụ “Xóa hết” khi bảng đã trống) **không** được ghi vào lịch sử. Làm một thao tác mới sau khi hoàn tác thì xóa nhánh “làm lại”.

Dữ liệu:

```js
export const COLORS = ['#fff3a3', '#c8f7c5', '#cfe8ff', '#ffd6e0'];
export const initialNotes = {
  nextId: 3,
  items: [
    { id: 1, text: 'Reducer phải là hàm thuần', color: COLORS[0], pinned: true },
    { id: 2, text: 'Không sửa trực tiếp state', color: COLORS[2], pinned: false },
  ],
};
```

**Các bước làm**

1. Tạo `src/usereducer/notesReducer.js` với reducer bình thường: `ADD_NOTE` (thêm vào đầu, bỏ qua nội dung rỗng), `CHANGE_COLOR`, `TOGGLE_PIN`, `DELETE`, `CLEAR_ALL` (bảng đã trống thì `return state`). Reducer này **không biết gì** về Undo.
2. Tạo `src/usereducer/undoable.js`:
    - `createHistory(present)` trả về `{ past: [], present, future: [] }` (dùng làm hàm `init`).
    - `undoable(reducer)` trả về reducer mới `(state, action) => ...`:
        - `UNDO`: lấy phần tử cuối của `past` làm `present`, đẩy `present` cũ vào đầu `future`.
        - `REDO`: ngược lại với `future`.
        - Action khác: `newPresent = reducer(present, action)`; nếu `newPresent === present` thì `return state`; ngược lại đẩy `present` vào `past` (giới hạn 20 bằng `slice(-20)`), `future: []`.
3. Trong `NotesBoard.jsx`, tạo `const notesWithHistory = undoable(notesReducer);` **ngoài** component (tạo trong component sẽ ra reducer mới mỗi lần render).
4. `useReducer(notesWithHistory, initialNotes, createHistory)` rồi destructuring `{ past, present, future }`.
5. Tính danh sách hiển thị: `[...present.items].sort((a, b) => Number(b.pinned) - Number(a.pinned))`.
6. Nội dung ô nhập và màu đang chọn dùng `useState` (không cần hoàn tác từng phím gõ).
7. Bắt phím tắt bằng `onKeyDown` trên thẻ bọc ngoài: `e.ctrlKey && e.key === 'z'` → `UNDO`, `e.key === 'y'` → `REDO`, nhớ `e.preventDefault()`.
8. Suy nghĩ: muốn thêm Undo cho bộ đếm Bài 1 cần sửa gì? (Chỉ cần `useReducer(undoable(counterReducer), initialState, createHistory)`.)

**Tiêu chí hoàn thành**

- [ ] Thêm “Học undo”, xóa “Không sửa trực tiếp state”, ghim “Học undo”: nút hiện “Hoàn tác (3)”.
- [ ] Hoàn tác 2 lần: ghi chú bị xóa quay lại (3 ghi chú), “Hoàn tác (1)”, “Làm lại (2)”. Làm lại 1 lần: còn 2 ghi chú, “Làm lại (1)”.
- [ ] Thêm ghi chú mới lúc này: “Làm lại (0)”.
- [ ] “Xóa hết” hai lần liên tiếp chỉ tăng số hoàn tác 1 lần; `Ctrl+Z` khôi phục lại các ghi chú.
- [ ] `notesReducer.js` không có chữ `UNDO`/`REDO`; `undoable.js` không biết gì về ghi chú.

---

## Phần C. Đáp án mẫu

Chỉ mở phần này sau khi đã tự làm. Code đã được build và chạy thử trên trình duyệt; mọi tiêu chí hoàn thành ở trên đều đã kiểm tra, Console không có lỗi hay cảnh báo. Cách viết có thể khác miễn là kết quả đúng.

Để xem từng bài, import component vào `src/App.jsx`:

```jsx
import StepCounter from './usereducer/StepCounter';
// import OrderTracker from './usereducer/OrderTracker';
// import KanbanBoard from './usereducer/KanbanBoard';
// import CourseWizard from './usereducer/CourseWizard';
// import NotesBoard from './usereducer/NotesBoard';

const App = () => (
  <div className="container my-4">
    <StepCounter />
  </div>
);

export default App;
```

### Đáp án Bài 1

`src/usereducer/StepCounter.jsx`

```jsx
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
    <Card style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Bộ đếm có bước nhảy</Card.Title>
        <div className="display-4 text-center my-2">{count}</div>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Button
            variant="outline-secondary"
            disabled={count <= MIN}
            onClick={() => dispatch({ type: ACTIONS.DECREMENT })}
          >
            {`− ${step}`}
          </Button>
          <Button disabled={count >= MAX} onClick={() => dispatch({ type: ACTIONS.INCREMENT })}>
            {`+ ${step}`}
          </Button>
          <Button variant="outline-danger" onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Đặt lại
          </Button>
        </div>

        <Form.Group className="mb-3" controlId="step-select">
          <Form.Label>Bước nhảy</Form.Label>
          <Form.Select
            value={step}
            onChange={(e) => dispatch({ type: ACTIONS.SET_STEP, payload: Number(e.target.value) })}
          >
            {[1, 5, 10, 25].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <h6>5 thay đổi gần nhất</h6>
        <ListGroup>
          {history.length === 0 && <ListGroup.Item className="text-muted">Chưa có thay đổi</ListGroup.Item>}
          {history.map((line, i) => (
            <ListGroup.Item key={`${line}-${i}`}>{line}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default StepCounter;
```

Điểm cần nhớ: component chỉ gửi “bấm tăng”, “bấm giảm”, “đổi bước”, “đặt lại”; mọi quy tắc (kẹp 0–100, ghi lịch sử, cắt còn 5 dòng) nằm trong reducer. Trả về `state` khi `next === state.count` khiến React bỏ qua render và không ghi lịch sử thừa. Hai `case` liền nhau dùng chung một nhánh xử lý.

### Đáp án Bài 2

`src/usereducer/OrderTracker.jsx`

```jsx
import { useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

// Máy trạng thái: mỗi trạng thái cho phép những sự kiện nào, đi tới đâu
const TRANSITIONS = {
  pending:   { CONFIRM: 'confirmed', CANCEL: 'cancelled' },
  confirmed: { SHIP: 'shipping', CANCEL: 'cancelled' },
  shipping:  { DELIVER: 'delivered' },
  delivered: {},
  cancelled: {},
};

const STATUS_INFO = {
  pending:   { label: 'Chờ xác nhận', bg: 'secondary' },
  confirmed: { label: 'Đã xác nhận', bg: 'primary' },
  shipping:  { label: 'Đang giao', bg: 'warning' },
  delivered: { label: 'Đã giao', bg: 'success' },
  cancelled: { label: 'Đã hủy', bg: 'danger' },
};

const EVENT_LABELS = { CONFIRM: 'Xác nhận', SHIP: 'Giao hàng', DELIVER: 'Đã nhận hàng', CANCEL: 'Hủy đơn' };

const initialState = {
  status: 'pending',
  cancelReason: '',
  error: '',
  timeline: [{ status: 'pending', at: '08:00' }],
};

const orderReducer = (state, action) => {
  if (action.type === 'SET_REASON') {
    return { ...state, cancelReason: action.payload, error: '' };
  }
  if (action.type === 'RESET') return initialState;

  const nextStatus = TRANSITIONS[state.status][action.type];
  if (!nextStatus) {
    // Sự kiện không hợp lệ ở trạng thái hiện tại: giữ nguyên trạng thái, ghi lỗi
    return { ...state, error: `Không thể "${action.type}" khi đơn đang "${STATUS_INFO[state.status].label}"` };
  }
  if (action.type === 'CANCEL' && state.cancelReason.trim().length < 5) {
    return { ...state, error: 'Nhập lý do hủy (ít nhất 5 ký tự)' };
  }
  return {
    ...state,
    status: nextStatus,
    error: '',
    timeline: [...state.timeline, { status: nextStatus, at: action.at }],
  };
};

const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const OrderTracker = () => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { status, cancelReason, error, timeline } = state;
  const allowedEvents = Object.keys(TRANSITIONS[status]); // dẫn xuất từ trạng thái
  const isFinal = allowedEvents.length === 0;

  return (
    <Card style={{ maxWidth: 520 }}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between">
          Đơn hàng #DH1024
          <Badge bg={STATUS_INFO[status].bg}>{STATUS_INFO[status].label}</Badge>
        </Card.Title>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        {allowedEvents.includes('CANCEL') && (
          <Form.Control
            className="mb-2"
            placeholder="Lý do hủy (bắt buộc khi hủy)"
            value={cancelReason}
            onChange={(e) => dispatch({ type: 'SET_REASON', payload: e.target.value })}
          />
        )}

        <div className="d-flex flex-wrap gap-2 mb-3">
          {Object.keys(EVENT_LABELS).map((event) => (
            <Button
              key={event}
              size="sm"
              variant={event === 'CANCEL' ? 'outline-danger' : 'outline-primary'}
              disabled={!allowedEvents.includes(event)}
              // Thời gian lấy ở hàm xử lý rồi đưa vào action, reducer không gọi Date
              onClick={() => dispatch({ type: event, at: now() })}
            >
              {EVENT_LABELS[event]}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => dispatch({ type: 'SHIP', at: now() })}
          >
            Thử gửi SHIP
          </Button>
        </div>

        <ListGroup variant="flush">
          {timeline.map(({ status: s, at }, i) => (
            <ListGroup.Item key={`${s}-${i}`}>
              <Badge bg={STATUS_INFO[s].bg} className="me-2">{STATUS_INFO[s].label}</Badge>
              <small className="text-muted">{at}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {isFinal && (
          <Button className="mt-3" size="sm" onClick={() => dispatch({ type: 'RESET' })}>
            Tạo đơn mới
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderTracker;
```

Điểm cần nhớ: bảng `TRANSITIONS` là nguồn sự thật duy nhất cho “được làm gì ở trạng thái nào”; reducer và giao diện (nút mờ) cùng đọc bảng này. Kể cả khi giao diện có lỗi và gửi sai action, reducer vẫn chặn được. Thời gian được tạo ở hàm xử lý và gửi qua `action.at` để reducer luôn thuần.

### Đáp án Bài 3

`src/usereducer/taskReducer.js`

```js
export const COLUMNS = [
  { key: 'todo', title: 'Cần làm' },
  { key: 'doing', title: 'Đang làm' },
  { key: 'done', title: 'Hoàn thành' },
];
const ORDER = COLUMNS.map((c) => c.key);

export const TASK_ACTIONS = {
  ADD: 'tasks/add',
  MOVE: 'tasks/move',
  RENAME: 'tasks/rename',
  DELETE: 'tasks/delete',
  CLEAR_DONE: 'tasks/clearDone',
};

export const initialTaskState = {
  nextId: 4, // id do reducer tự cấp → reducer vẫn thuần (không gọi Date.now/Math.random)
  tasks: [
    { id: 1, title: 'Đọc lý thuyết useReducer', priority: 'high', column: 'done' },
    { id: 2, title: 'Làm bài Kanban', priority: 'high', column: 'doing' },
    { id: 3, title: 'Ôn lại spread operator', priority: 'low', column: 'todo' },
  ],
};

// Action creator: hàm nhỏ tạo action, tránh gõ sai cấu trúc ở component
export const addTask = (title, priority) => ({ type: TASK_ACTIONS.ADD, payload: { title, priority } });
export const moveTask = (id, direction) => ({ type: TASK_ACTIONS.MOVE, payload: { id, direction } });
export const renameTask = (id, title) => ({ type: TASK_ACTIONS.RENAME, payload: { id, title } });
export const deleteTask = (id) => ({ type: TASK_ACTIONS.DELETE, payload: id });
export const clearDone = () => ({ type: TASK_ACTIONS.CLEAR_DONE });

export const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.ADD: {
      const title = action.payload.title.trim();
      if (!title) return state;
      const task = { id: state.nextId, title, priority: action.payload.priority, column: 'todo' };
      return { nextId: state.nextId + 1, tasks: [...state.tasks, task] };
    }
    case TASK_ACTIONS.MOVE: {
      const { id, direction } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          const nextIndex = ORDER.indexOf(t.column) + direction;
          if (nextIndex < 0 || nextIndex >= ORDER.length) return t;
          return { ...t, column: ORDER[nextIndex] };
        }),
      };
    }
    case TASK_ACTIONS.RENAME: {
      const title = action.payload.title.trim();
      if (!title) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, title } : t)),
      };
    }
    case TASK_ACTIONS.DELETE:
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case TASK_ACTIONS.CLEAR_DONE:
      return { ...state, tasks: state.tasks.filter((t) => t.column !== 'done') };
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
```

`src/usereducer/KanbanBoard.jsx`

```jsx
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

const PRIORITY = { high: { label: 'Cao', bg: 'danger' }, low: { label: 'Thấp', bg: 'secondary' } };

const TaskCard = ({ task, isFirst, isLast, dispatch }) => {
  const { id, title, priority } = task;
  return (
    <Card className="mb-2 shadow-sm">
      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <span
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
          <Button size="sm" variant="outline-secondary" disabled={isFirst} onClick={() => dispatch(moveTask(id, -1))}>←</Button>
          <Button size="sm" variant="outline-secondary" disabled={isLast} onClick={() => dispatch(moveTask(id, 1))}>→</Button>
          <Button size="sm" variant="outline-danger" className="ms-auto" onClick={() => dispatch(deleteTask(id))}>Xóa</Button>
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
    <>
      <Row className="g-2 mb-3">
        <Col md={7}>
          <Form onSubmit={handleAdd}>
            <InputGroup>
              <Form.Control placeholder="Tên công việc" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Form.Select style={{ maxWidth: 110 }} value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Thấp</option>
                <option value="high">Cao</option>
              </Form.Select>
              <Button type="submit" disabled={!title.trim()}>Thêm</Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={3}>
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Lọc ưu tiên">
            <option value="all">Mọi mức ưu tiên</option>
            <option value="high">Chỉ ưu tiên cao</option>
            <option value="low">Chỉ ưu tiên thấp</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-success" className="w-100" disabled={doneCount === 0} onClick={() => dispatch(clearDone())}>
            Dọn cột xong
          </Button>
        </Col>
      </Row>

      <Row>
        {COLUMNS.map(({ key, title: columnTitle }, colIndex) => {
          const tasks = visible.filter((t) => t.column === key);
          return (
            <Col md={4} key={key}>
              <Card bg="light" className="h-100">
                <Card.Header className="d-flex justify-content-between">
                  {columnTitle} <Badge bg="dark">{tasks.length}</Badge>
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
                  {tasks.length === 0 && <small className="text-muted">Trống</small>}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default KanbanBoard;
```

Điểm cần nhớ: `taskReducer.js` là JavaScript thuần nên kiểm thử và tái sử dụng dễ dàng. `nextId` nằm trong state nên reducer không cần `Date.now()`. `window.prompt` được gọi ở hàm xử lý sự kiện (tác dụng phụ), còn reducer chỉ nhận tên mới. Bộ lọc ưu tiên là state giao diện nên để `useState`, không ảnh hưởng dữ liệu thật.

### Đáp án Bài 4

`src/usereducer/wizardReducer.js`

```js
export const COURSES = [
  { id: 'react', name: 'ReactJS cơ bản', fee: 2500000 },
  { id: 'node', name: 'NodeJS & Express', fee: 3000000 },
  { id: 'fullstack', name: 'Fullstack MERN', fee: 5000000 },
];
export const SCHEDULES = ['Sáng 2-4-6', 'Tối 3-5-7', 'Cuối tuần'];

export const STEPS = ['Thông tin', 'Khóa học', 'Xác nhận'];

// Trường thuộc từng bước: NEXT chỉ kiểm tra các trường của bước hiện tại
const STEP_FIELDS = [['fullName', 'email', 'phone'], ['courseId', 'schedule'], ['agree']];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (name, values) => {
  const v = values[name];
  switch (name) {
    case 'fullName': return v.trim().length >= 3 ? '' : 'Họ tên ít nhất 3 ký tự';
    case 'email': return EMAIL_REGEX.test(v) ? '' : 'Email không hợp lệ';
    case 'phone': return /^0\d{9}$/.test(v) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0';
    case 'courseId': return v ? '' : 'Chọn một khóa học';
    case 'schedule': return v ? '' : 'Chọn lịch học';
    case 'agree': return v ? '' : 'Bạn cần xác nhận thông tin';
    default: return '';
  }
};

const validateStep = (step, values) =>
  STEP_FIELDS[step].reduce((errors, name) => {
    const message = validateField(name, values);
    return message ? { ...errors, [name]: message } : errors;
  }, {});

// Hàm init (tham số thứ 3 của useReducer): dựng state ban đầu từ một đối số
export const initWizard = (initialCourseId = '') => ({
  step: 0,
  maxVisited: 0,
  values: { fullName: '', email: '', phone: '', courseId: initialCourseId, schedule: '', agree: false },
  errors: {},
  submitted: false,
});

export const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE': {
      const { name, value } = action.payload;
      const values = { ...state.values, [name]: value };
      // Đã báo lỗi ở trường này thì kiểm tra lại ngay khi sửa
      const errors = state.errors[name]
        ? { ...state.errors, [name]: validateField(name, values) }
        : state.errors;
      return { ...state, values, errors };
    }
    case 'NEXT': {
      const errors = validateStep(state.step, state.values);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      const step = Math.min(state.step + 1, STEPS.length - 1);
      return { ...state, step, maxVisited: Math.max(state.maxVisited, step), errors: {} };
    }
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, 0), errors: {} };
    case 'GO_TO':
      // Chỉ nhảy tới bước đã từng tới
      return action.payload <= state.maxVisited ? { ...state, step: action.payload, errors: {} } : state;
    case 'SUBMIT': {
      const errors = validateStep(state.step, state.values);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, submitted: true };
    }
    case 'RESET':
      return initWizard(action.payload);
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
```

`src/usereducer/CourseWizard.jsx`

```jsx
import { useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { COURSES, SCHEDULES, STEPS, wizardReducer, initWizard } from './wizardReducer';

const formatVND = (n) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const CourseWizard = ({ initialCourseId = 'react' }) => {
  // useReducer(reducer, đối số cho init, hàm init)
  const [state, dispatch] = useReducer(wizardReducer, initialCourseId, initWizard);
  const { step, maxVisited, values, errors, submitted } = state;
  const course = COURSES.find((c) => c.id === values.courseId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value: type === 'checkbox' ? checked : value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: step === STEPS.length - 1 ? 'SUBMIT' : 'NEXT' });
  };

  if (submitted) {
    return (
      <Alert variant="success" style={{ maxWidth: 560 }}>
        <Alert.Heading>Đăng ký thành công!</Alert.Heading>
        <p>{`${values.fullName} đã đăng ký ${course.name} (${values.schedule}). Học phí: ${formatVND(course.fee)}.`}</p>
        <Button variant="outline-success" onClick={() => dispatch({ type: 'RESET', payload: initialCourseId })}>
          Đăng ký khóa khác
        </Button>
      </Alert>
    );
  }

  const field = (name, label, type = 'text') => (
    <Form.Group className="mb-3" controlId={`wz-${name}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} name={name} value={values[name]} onChange={handleChange} isInvalid={Boolean(errors[name])} />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Card style={{ maxWidth: 560 }}>
      <Card.Header>
        <Nav variant="pills">
          {STEPS.map((label, i) => (
            <Nav.Item key={label}>
              <Nav.Link
                active={i === step}
                disabled={i > maxVisited}
                onClick={() => dispatch({ type: 'GO_TO', payload: i })}
              >
                {`${i + 1}. ${label}`}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              {field('fullName', 'Họ và tên')}
              {field('email', 'Email', 'email')}
              {field('phone', 'Số điện thoại', 'tel')}
            </>
          )}

          {step === 1 && (
            <>
              <Form.Group className="mb-3" controlId="wz-courseId">
                <Form.Label>Khóa học</Form.Label>
                <Form.Select name="courseId" value={values.courseId} onChange={handleChange} isInvalid={Boolean(errors.courseId)}>
                  <option value="">-- Chọn khóa học --</option>
                  {COURSES.map(({ id, name, fee }) => (
                    <option key={id} value={id}>{`${name} – ${formatVND(fee)}`}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.courseId}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Lịch học</Form.Label>
                {SCHEDULES.map((s, i) => (
                  <Form.Check
                    inline key={s} type="radio" id={`wz-schedule-${i}`} name="schedule" label={s} value={s}
                    checked={values.schedule === s} onChange={handleChange} isInvalid={Boolean(errors.schedule)}
                  />
                ))}
                {errors.schedule && <div className="text-danger small">{errors.schedule}</div>}
              </Form.Group>
            </>
          )}

          {step === 2 && (
            <>
              <ListGroup className="mb-3">
                <ListGroup.Item>{`Học viên: ${values.fullName}`}</ListGroup.Item>
                <ListGroup.Item>{`Liên hệ: ${values.email} · ${values.phone}`}</ListGroup.Item>
                <ListGroup.Item>{`Khóa học: ${course?.name ?? ''} · ${values.schedule}`}</ListGroup.Item>
                <ListGroup.Item className="fw-bold">{`Học phí: ${course ? formatVND(course.fee) : ''}`}</ListGroup.Item>
              </ListGroup>
              <Form.Check
                id="wz-agree" name="agree" className="mb-3" label="Tôi xác nhận thông tin trên là chính xác"
                checked={values.agree} onChange={handleChange}
                isInvalid={Boolean(errors.agree)} feedback={errors.agree} feedbackType="invalid"
              />
            </>
          )}

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" disabled={step === 0} onClick={() => dispatch({ type: 'BACK' })}>
              ← Quay lại
            </Button>
            <Button type="submit" variant={step === STEPS.length - 1 ? 'success' : 'primary'}>
              {step === STEPS.length - 1 ? 'Xác nhận đăng ký' : 'Tiếp tục →'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CourseWizard;
```

Điểm cần nhớ: `useReducer(wizardReducer, initialCourseId, initWizard)` dựng state từ props mà chỉ chạy một lần; `RESET` gọi lại `initWizard` nên không lặp object ban đầu. Validation nằm trong reducer (`NEXT`, `SUBMIT`) vì nó quyết định state có được chuyển bước hay không. `maxVisited` là thông tin cần lưu (không tính được từ `step`), còn `course` là dẫn xuất.

### Đáp án Bài 5

`src/usereducer/undoable.js`

```js
const HISTORY_LIMIT = 20;

// Higher-order reducer: nhận một reducer, trả về reducer mới có thêm UNDO/REDO
export const undoable = (reducer) => (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state;
      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    }
    default: {
      const newPresent = reducer(present, action);
      if (newPresent === present) return state; // action không làm gì → không ghi lịch sử
      return {
        past: [...past, present].slice(-HISTORY_LIMIT),
        present: newPresent,
        future: [], // có thay đổi mới thì bỏ nhánh redo
      };
    }
  }
};

export const createHistory = (present) => ({ past: [], present, future: [] });
```

`src/usereducer/notesReducer.js`

```js
export const COLORS = ['#fff3a3', '#c8f7c5', '#cfe8ff', '#ffd6e0'];

export const initialNotes = {
  nextId: 3,
  items: [
    { id: 1, text: 'Reducer phải là hàm thuần', color: COLORS[0], pinned: true },
    { id: 2, text: 'Không sửa trực tiếp state', color: COLORS[2], pinned: false },
  ],
};

export const notesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const text = action.payload.text.trim();
      if (!text) return state;
      const note = { id: state.nextId, text, color: action.payload.color, pinned: false };
      return { nextId: state.nextId + 1, items: [note, ...state.items] };
    }
    case 'CHANGE_COLOR':
      return {
        ...state,
        items: state.items.map((n) => (n.id === action.payload.id ? { ...n, color: action.payload.color } : n)),
      };
    case 'TOGGLE_PIN':
      return {
        ...state,
        items: state.items.map((n) => (n.id === action.payload ? { ...n, pinned: !n.pinned } : n)),
      };
    case 'DELETE':
      return { ...state, items: state.items.filter((n) => n.id !== action.payload) };
    case 'CLEAR_ALL':
      return state.items.length === 0 ? state : { ...state, items: [] };
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
```

`src/usereducer/NotesBoard.jsx`

```jsx
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

// Tạo reducer có Undo/Redo một lần, ở ngoài component
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
    dispatch({ type: 'ADD_NOTE', payload: { text, color } });
    setText('');
  };

  // Phím tắt trên vùng bảng ghi chú: Ctrl+Z / Ctrl+Y
  const handleKeyDown = (e) => {
    if (!e.ctrlKey) return;
    if (e.key === 'z') { e.preventDefault(); dispatch({ type: 'UNDO' }); }
    if (e.key === 'y') { e.preventDefault(); dispatch({ type: 'REDO' }); }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Form onSubmit={handleAdd} className="flex-grow-1">
          <InputGroup>
            <Form.Control placeholder="Nội dung ghi chú" value={text} onChange={(e) => setText(e.target.value)} />
            <Form.Select style={{ maxWidth: 120 }} value={color} onChange={(e) => setColor(e.target.value)} aria-label="Màu">
              {COLORS.map((c, i) => (
                <option key={c} value={c}>{`Màu ${i + 1}`}</option>
              ))}
            </Form.Select>
            <Button type="submit" disabled={!text.trim()}>Thêm</Button>
          </InputGroup>
        </Form>
        <ButtonGroup>
          <Button variant="outline-dark" disabled={past.length === 0} onClick={() => dispatch({ type: 'UNDO' })}>
            {`↶ Hoàn tác (${past.length})`}
          </Button>
          <Button variant="outline-dark" disabled={future.length === 0} onClick={() => dispatch({ type: 'REDO' })}>
            {`↷ Làm lại (${future.length})`}
          </Button>
        </ButtonGroup>
        <Button variant="outline-danger" onClick={() => dispatch({ type: 'CLEAR_ALL' })}>Xóa hết</Button>
      </div>

      <Row xs={1} md={3} className="g-3">
        {notes.map(({ id, text: noteText, color: noteColor, pinned }) => (
          <Col key={id}>
            <Card style={{ background: noteColor }} className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Text className="flex-grow-1">{pinned && '📌 '}{noteText}</Card.Text>
                <div className="d-flex gap-1 align-items-center">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Đổi màu ${c}`}
                      onClick={() => dispatch({ type: 'CHANGE_COLOR', payload: { id, color: c } })}
                      style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: c === noteColor ? '2px solid #333' : '1px solid #999' }}
                    />
                  ))}
                  <Button size="sm" variant="link" className="ms-auto p-0" onClick={() => dispatch({ type: 'TOGGLE_PIN', payload: id })}>
                    {pinned ? 'Bỏ ghim' : 'Ghim'}
                  </Button>
                  <Button size="sm" variant="link" className="text-danger p-0 ms-2" onClick={() => dispatch({ type: 'DELETE', payload: id })}>
                    Xóa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {notes.length === 0 && <p className="text-muted">Chưa có ghi chú. Thử bấm Hoàn tác.</p>}
    </div>
  );
};

export default NotesBoard;
```

Điểm cần nhớ: `undoable` nhận một reducer và trả về reducer mới, reducer gốc không cần biết gì về lịch sử. Nhờ reducer gốc trả về cùng tham chiếu khi không có thay đổi, `undoable` biết để không ghi lịch sử thừa. Ô nhập nội dung dùng `useState` vì không cần hoàn tác từng phím gõ.

---

## Phần D. Checklist lưu ý khi dùng `useReducer`

Dùng checklist này để tự rà soát code trước khi nộp bài hoặc review code của bạn cùng nhóm.

### D1. Khi nào dùng

- [ ] Chỉ chuyển sang `useReducer` khi state có nhiều phần liên quan hoặc nhiều kiểu cập nhật; một hai giá trị đơn giản thì `useState` gọn hơn.
- [ ] State giao diện nhỏ (ô nhập tạm, bộ lọc, đang mở menu) vẫn để `useState`, không nhét hết vào reducer.
- [ ] Dữ liệu tính được (tổng, danh sách đã lọc, `isValid`, nút được phép bấm) tính khi render, không lưu trong state của reducer.

### D2. Khai báo

- [ ] `useReducer` được gọi ở cấp cao nhất của component, như mọi hook.
- [ ] Reducer và `initialState` khai báo **ngoài** component (hoặc file `.js` riêng), không tạo lại mỗi lần render.
- [ ] State ban đầu phụ thuộc props hoặc tốn công tính thì dùng tham số thứ 3 `init`; `case` reset gọi lại `init`.
- [ ] Hàm bọc reducer (higher-order reducer như `undoable`, `withLogger`) được gọi một lần ngoài component.

### D3. Reducer thuần

- [ ] Mọi `case` đều `return` một state; `case` có khai báo biến được bọc trong `{ }`.
- [ ] Không sửa trực tiếp `state` hay object/mảng bên trong: dùng spread, `map`, `filter`; object lồng nhau sao chép từng cấp.
- [ ] Giữ các trường không liên quan bằng `...state`, không vô tình làm mất trường.
- [ ] Không gọi API, `setTimeout`, `localStorage`, `alert`, `dispatch`, `setState` trong reducer.
- [ ] Không dùng `Math.random()`, `Date.now()`, `new Date()` trong reducer; tạo ở hàm xử lý rồi đưa vào action, hoặc lưu `nextId` trong state.
- [ ] Action không làm thay đổi gì thì `return state` (cùng tham chiếu).
- [ ] `default` ném lỗi (hoặc `return state` nếu reducer cố ý bỏ qua action lạ).
- [ ] Thấy dữ liệu bị thêm hai lần khi dev → kiểm tra reducer có đang sửa trực tiếp state không (StrictMode gọi reducer hai lần).

### D4. Action

- [ ] Action mô tả **sự kiện** (`task/moved`), không phải lệnh gán cả state (`setTasks`).
- [ ] `type` là hằng số hoặc chuỗi theo mẫu `miền/sự kiện`, nhất quán trong toàn project.
- [ ] `payload` chỉ chứa dữ liệu reducer chưa biết (`id`, giá trị ô nhập), không gửi cả state.
- [ ] Giá trị từ ô nhập được chuyển kiểu trước khi gửi (`Number(e.target.value)`), hoặc reducer tự chuyển, nhưng thống nhất một chỗ.
- [ ] Dùng action creator khi cùng một action được gửi từ nhiều nơi.

### D5. Dispatch và component

- [ ] Không đọc `state` ngay sau `dispatch` mong có giá trị mới; cần thì tính `reducer(state, action)` hoặc kiểm tra lại bằng hàm validation.
- [ ] Logic bất đồng bộ nằm trong hàm xử lý sự kiện: `dispatch(start)` → `await` → `dispatch(success/failure)`.
- [ ] Truyền `dispatch` (hoặc action creator đã gắn sẵn) xuống component con thay vì nhiều hàm callback riêng lẻ.
- [ ] Không gọi `dispatch` trong phần thân render (gây vòng lặp render vô hạn).
- [ ] Danh sách nút/thao tác được phép suy ra từ state (bảng chuyển trạng thái), không viết `if` rải rác trong JSX.

### D6. Tổ chức và kiểm thử

- [ ] Reducer đặt trong file `.js` riêng khi dài hơn vài `case`, cùng `initialState`, hằng số action và action creator.
- [ ] Kiểm thử reducer như hàm thuần: gọi với state và action mẫu, so sánh kết quả; kiểm tra cả trường hợp “không thay đổi” trả về đúng tham chiếu cũ.
- [ ] Có thể bọc reducer bằng `withLogger` khi gỡ lỗi để xem action và state trước/sau.
- [ ] Khi nhiều component xa nhau cần cùng state: đưa `state` và `dispatch` vào Context (`useReducer` + `useContext`).

### D7. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| Giao diện không đổi sau `dispatch` | Reducer sửa trực tiếp rồi trả về cùng object | Tạo object/mảng mới |
| State thành `undefined`, lỗi “cannot read properties of undefined” | Một `case` quên `return`, hoặc `default` không trả về gì | Kiểm tra mọi nhánh đều `return` |
| Mất một trường sau khi cập nhật | Quên `...state` | `return { ...state, field: value }` |
| Phần tử bị thêm 2 lần khi dev | Reducer không thuần (sửa trực tiếp, `push`) | Viết lại bất biến |
| `Action không hợp lệ` | Gõ sai `type` | Dùng hằng số hoặc action creator |
| Kết quả khác nhau với cùng thao tác | Dùng `Math.random`/`Date.now` trong reducer | Tạo giá trị ở hàm xử lý và đưa vào action |
| Nhảy bước/validation dùng dữ liệu cũ | Đọc `state` ngay sau `dispatch` | Kiểm tra bằng giá trị hiện có hoặc để reducer tự kiểm tra |

### D8. Câu hỏi tự kiểm tra

1. Nêu 3 dấu hiệu cho thấy nên chuyển từ `useState` sang `useReducer`.
2. Bốn khái niệm state, action, reducer, dispatch liên hệ với nhau thế nào?
3. Vì sao reducer phải là hàm thuần? Kể 4 việc không được làm trong reducer.
4. Muốn lưu thời điểm một sự kiện xảy ra thì lấy thời gian ở đâu? Vì sao?
5. Khi action không làm thay đổi gì, reducer nên trả về gì và có lợi ích gì?
6. `useReducer(reducer, arg, init)` khác `useReducer(reducer, init(arg))` ở điểm nào?
7. Gọi `dispatch` ba lần liên tiếp trong một sự kiện, action thứ ba nhận state nào?
8. Vì sao `{ type: 'setTasks', payload: newTasks }` là thiết kế action không tốt?
9. Viết `undoable(reducer)` cần những phần nào trong state? Vì sao thao tác mới phải xóa `future`?
10. Làm sao để nhiều component ở xa nhau cùng dùng một reducer?
