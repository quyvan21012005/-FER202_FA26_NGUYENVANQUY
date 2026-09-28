# useState trong ReactJS - created by traltb@fe.edu.vn

| Phần | Nội dung |
| --- | --- |
| A | Lý thuyết `useState` (12 mục, từ cơ bản đến nâng cao) |
| B | 5 bài tập áp dụng, mỗi bài có mục tiêu, yêu cầu, các bước làm, tiêu chí hoàn thành |
| C | Đáp án mẫu (đã build và chạy thử bằng Vite + React 19 + React-Bootstrap 2) |
| D | Checklist lưu ý khi dùng `useState` |

**Chuẩn bị:** dùng lại project của ES6.md/Hook.md (Vite + React-Bootstrap, đã import `bootstrap/dist/css/bootstrap.min.css` trong `main.jsx`). Tạo thư mục `src/usestate` để chứa các component của tài liệu này.

---

## Phần A. Lý thuyết `useState`

### A1. State là gì, khi nào cần state?

**State** là dữ liệu mà component tự quản lý, **thay đổi theo thời gian** và khi thay đổi thì **giao diện phải cập nhật** theo. Ví dụ: số lượng trong giỏ, ô nhập đang gõ, tab đang chọn, menu đang mở hay đóng.

Vì sao biến thường không làm được việc này?

```jsx
const Counter = () => {
  let count = 0; // biến thường
  return <button onClick={() => { count++; console.log(count); }}>{count}</button>;
};
```

Bấm nút, Console in 1, 2, 3 nhưng nút vẫn hiện 0, vì:

1. Thay đổi biến thường **không báo cho React** render lại.
2. Nếu có render lại, hàm `Counter` chạy lại từ đầu và `count` lại bằng 0: biến thường **không được ghi nhớ** giữa các lần render.

`useState` giải quyết cả hai: giữ giá trị giữa các lần render và kích hoạt render lại khi giá trị đổi.

Phân biệt ba loại dữ liệu trong component:

| Loại | Ai sở hữu | Thay đổi được? | Ví dụ |
| --- | --- | --- | --- |
| Props | Component cha | Không (chỉ đọc) | `product`, `onAddToCart` |
| State | Chính component | Có, qua hàm `set` | `quantity`, `keyword`, `isOpen` |
| Dữ liệu dẫn xuất | Tính từ props/state | Tính lại mỗi lần render | `total`, `filteredList`, `isValid` |

Câu hỏi để quyết định có cần state hay không:

- Giá trị có **thay đổi theo thời gian** không? Không → hằng số, không cần state.
- Có được **truyền từ cha** qua props không? Có → dùng props, không copy vào state.
- Có **tính được** từ state/props khác không? Có → tính khi render, không lưu state.
- Còn lại mới là state.

### A2. Cú pháp

```jsx
import { useState } from 'react';

const [value, setValue] = useState(initialValue);
```

- `useState` trả về mảng 2 phần tử, ta dùng **destructuring mảng** để đặt tên. Quy ước: `[something, setSomething]`, với boolean nên đặt `[isOpen, setIsOpen]`, `[hasError, setHasError]`.
- `initialValue` chỉ được dùng ở **lần render đầu tiên**; các lần sau React bỏ qua nó.
- Một component có thể gọi `useState` nhiều lần, mỗi lần là một state độc lập.

```jsx
const [count, setCount] = useState(0);            // số
const [name, setName] = useState('');             // chuỗi
const [isOpen, setIsOpen] = useState(false);      // boolean
const [user, setUser] = useState({ name: '', age: 0 }); // object
const [items, setItems] = useState([]);           // mảng
const [selectedId, setSelectedId] = useState(null);     // "chưa chọn gì"
```

Hai cách gọi hàm `set`:

```jsx
setCount(5);                    // truyền giá trị mới
setCount((prev) => prev + 1);   // truyền hàm cập nhật (updater), nhận giá trị mới nhất
```

### A3. Quy tắc gọi hook

- Gọi `useState` ở **cấp cao nhất** của component, trước mọi `return`. Không đặt trong `if`, `for`, hàm con, hàm xử lý sự kiện.
- Chỉ gọi trong **function component** hoặc **custom hook** (`useXxx`).

Lý do: React không biết tên biến của bạn, nó nhận diện từng state theo **thứ tự gọi**: state thứ 1, thứ 2, thứ 3… Nếu một lần render bỏ qua một `useState` (vì nằm trong `if`), thứ tự lệch và các state bị gán nhầm.

### A4. Chu trình render: set → render lại → cập nhật DOM

1. Người dùng bấm nút → hàm xử lý gọi `setCount(1)`.
2. React ghi nhận yêu cầu vào hàng đợi, **chưa** đổi `count` ngay.
3. Hàm xử lý chạy xong, React gọi lại hàm component → lần render mới đọc `count = 1`.
4. React so sánh JSX mới với cũ và chỉ cập nhật phần DOM thay đổi.

### A5. State là “ảnh chụp” (snapshot)

Trong một lần render, giá trị state là **cố định**. Mọi hàm tạo ra trong lần render đó (hàm xử lý sự kiện, callback của `setTimeout`) đều “nhìn thấy” giá trị của lần render ấy.

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count);          // vẫn in 0, không phải 1
  setTimeout(() => alert(count), 3000); // 3 giây sau vẫn là 0
};
```

Muốn dùng giá trị mới ngay trong hàm, hãy tính vào biến:

```jsx
const handleClick = () => {
  const next = count + 1;
  setCount(next);
  console.log(next); // 1
};
```

### A6. Batching và functional update

**Batching:** React gom mọi lệnh `set` trong cùng một sự kiện rồi render **một lần**. Từ React 18, batching áp dụng cả trong `setTimeout`, `Promise`, `async/await`.

Hệ quả khi gọi nhiều lần liên tiếp:

```jsx
// count đang là 0
setCount(count + 1); // = setCount(0 + 1)
setCount(count + 1); // = setCount(0 + 1)
setCount(count + 1); // = setCount(0 + 1)  → kết quả: 1

setCount((c) => c + 1); // 0 → 1
setCount((c) => c + 1); // 1 → 2
setCount((c) => c + 1); // 2 → 3            → kết quả: 3
```

**Quy tắc:** khi giá trị mới **phụ thuộc giá trị cũ** (tăng/giảm, bật/tắt, thêm/xóa phần tử), dùng dạng hàm `setX((prev) => ...)`. Đặc biệt bắt buộc khi cập nhật bên trong `setTimeout`/`setInterval`/`Promise`, vì callback đó giữ ảnh chụp cũ (stale closure).

Hàm updater phải **thuần**: chỉ tính và trả về giá trị mới, không gọi API, không `set` state khác bên trong. Ở chế độ `StrictMode` (khi dev), React cố tình gọi updater hai lần để phát hiện tác dụng phụ.

### A7. Object và mảng: cập nhật bất biến (immutable)

React quyết định có render lại hay không bằng `Object.is(cũ, mới)`. Với object/mảng, phép so sánh này xét **tham chiếu**. Sửa trực tiếp thì tham chiếu không đổi → React coi như không có gì thay đổi.

```jsx
// SAI
user.name = 'An';
setUser(user);          // cùng tham chiếu → không render lại

items.push(newItem);
setItems(items);        // cùng tham chiếu → không render lại

// ĐÚNG: tạo object/mảng mới
setUser({ ...user, name: 'An' });
setItems([...items, newItem]);
```

Bảng thao tác hay dùng (viết dạng updater cho an toàn):

| Thao tác | Mảng | Object |
| --- | --- | --- |
| Thêm | `setList((l) => [...l, x])` hoặc `[x, ...l]` | `setObj((o) => ({ ...o, newKey: v }))` |
| Xóa | `setList((l) => l.filter((i) => i.id !== id))` | `setObj(({ phone, ...rest }) => rest)` (bỏ `phone`) |
| Sửa | `setList((l) => l.map((i) => (i.id === id ? { ...i, done: true } : i)))` | `setObj((o) => ({ ...o, key: v }))` |
| Sửa theo tên động | — | `setObj((o) => ({ ...o, [name]: value }))` |
| Chèn vào vị trí `k` | `[...l.slice(0, k), x, ...l.slice(k)]` | — |
| Sắp xếp / đảo ngược | `[...l].sort(...)`, `[...l].reverse()` | — |

Các hàm **làm thay đổi mảng gốc**, không dùng trực tiếp trên state: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, gán `arr[i] = ...`. Các hàm **trả về mảng mới**, dùng thoải mái: `map`, `filter`, `slice`, `concat`, spread `[...]`, và từ ES2023 là `toSorted`, `toReversed`, `with`.

**Object lồng nhau:** spread chỉ sao chép một cấp (shallow copy), nên phải sao chép **từng cấp** trên đường đi:

```jsx
const [student, setStudent] = useState({
  name: 'An',
  contact: { email: 'an@fpt.edu.vn', address: { city: 'Hà Nội' } },
});

setStudent((s) => ({
  ...s,
  contact: {
    ...s.contact,
    address: { ...s.contact.address, city: 'Đà Nẵng' },
  },
}));
```

Lồng càng sâu càng dễ sai, đó là lý do nên thiết kế state **phẳng** (xem A9).

### A8. Giá trị khởi tạo lười (lazy initializer)

```jsx
const [todos, setTodos] = useState(createInitialTodos());   // chạy LẠI ở MỌI lần render (lãng phí)
const [todos, setTodos] = useState(createInitialTodos);     // truyền hàm: chỉ chạy ở lần đầu
const [todos, setTodos] = useState(() => createInitialTodos(50)); // cần tham số thì bọc arrow
```

Dùng khi giá trị ban đầu tốn công tính: xáo trộn mảng, đọc `localStorage`, tạo danh sách lớn. Lưu ý phân biệt với trường hợp **muốn lưu một hàm** vào state: phải viết `useState(() => myFunction)`.

### A9. Thiết kế cấu trúc state

Năm nguyên tắc chọn state “vừa đủ”:

1. **Gom state liên quan:** hai giá trị luôn đổi cùng nhau (như `x`, `y` của vị trí chuột) thì gộp thành một object `{ x, y }`.
2. **Tránh mâu thuẫn:** thay vì `isSending` và `isSent` (có thể cùng `true`), dùng một `status: 'typing' | 'sending' | 'sent'`.
3. **Tránh dư thừa:** không lưu thứ tính được. Có `firstName`, `lastName` thì `fullName` là biến tính khi render, không phải state.
4. **Tránh trùng lặp:** lưu `selectedId` thay vì cả object `selectedItem` (object này đã nằm trong mảng, lưu hai nơi dễ lệch nhau khi sửa).
5. **Tránh lồng sâu:** ưu tiên cấu trúc phẳng để cập nhật đơn giản.

**Không copy props vào state:**

```jsx
// SAI: khi cha đổi color, state vẫn giữ màu cũ
const Message = ({ color }) => {
  const [c, setC] = useState(color);
  ...
};
// ĐÚNG: dùng thẳng props
const Message = ({ color }) => <p style={{ color }}>...</p>;
```

Chỉ copy khi cố ý dùng props làm **giá trị ban đầu** và bỏ qua thay đổi sau đó; khi ấy nên đặt tên prop là `initialColor`/`defaultValue` cho rõ.

### A10. State độc lập theo từng instance và “nâng state lên”

Mỗi lần dùng `<Counter />` trên trang là một **bản riêng** với state riêng. Hai `<Counter />` cạnh nhau không ảnh hưởng nhau.

Khi **hai component cần dùng chung** một state (ví dụ “chỉ mở một câu hỏi FAQ tại một thời điểm”), hãy **nâng state lên (lifting state up)** tới component cha gần nhất, rồi truyền xuống:

- giá trị qua props: `value={rating}`, `isOpen={openId === id}`;
- hàm thay đổi qua props: `onChange={setRating}`, `onToggle={() => handleToggle(id)}`.

Component con khi đó là **controlled component**: không tự giữ dữ liệu chính mà hiển thị theo props và báo sự kiện lên cha. Con vẫn có thể giữ state thuần giao diện của riêng nó (như ngôi sao đang được rê chuột).

### A11. Khi nào state được giữ, khi nào bị reset?

React gắn state với **vị trí của component trong cây giao diện**, không phải với biến hay tên:

- Cùng component, cùng vị trí giữa các lần render → state được **giữ**.
- Component ở vị trí đó bị gỡ khỏi giao diện (điều kiện `&&` thành `false`) hoặc bị **thay bằng component khác loại** → state bị **hủy**; lần hiện lại bắt đầu từ giá trị khởi tạo.
- Đổi prop **`key`** → React coi là component mới → state **reset**.

```jsx
// Mỗi lần attempt đổi, Quiz được tạo lại với state ban đầu
<Quiz key={attempt} />

// Chuyển người nhận thì form chat reset, không mang tin nhắn đang gõ sang người khác
<ChatForm key={contact.id} contact={contact} />
```

Không khai báo component **bên trong** component khác: mỗi lần cha render, component con là một hàm mới, React coi là loại khác và reset state của nó.

### A12. State và ô nhập liệu

- Ô nhập có điều khiển: `value={state}` + `onChange={(e) => setState(e.target.value)}`; checkbox dùng `checked` và `e.target.checked`.
- `e.target.value` **luôn là chuỗi**, kể cả với `type="number"`. Nên lưu chuỗi trong state (để ô có thể trống hay đang gõ dở như `"1."`), và chuyển `Number(...)` khi tính toán.
- Không khởi tạo state của ô nhập bằng `undefined`/`null` (React sẽ cảnh báo chuyển từ uncontrolled sang controlled); dùng `''` hoặc `false`.

---

## Phần B. 5 bài tập áp dụng

| Bài | Kiến thức `useState` chính | Giao diện |
| --- | --- | --- |
| 1 | Boolean, toggle, state theo từng instance, nâng state lên, state bị hủy khi gỡ component | FAQ Accordion |
| 2 | Controlled component, state giao diện cục bộ, mảng state, dữ liệu dẫn xuất | Đánh giá sao + danh sách nhận xét |
| 3 | Ô số lưu chuỗi, chuyển kiểu, validation và kết quả dẫn xuất | Máy tính BMI |
| 4 | Mảng object: thêm/sửa/xóa, cập nhật object lồng nhau, sắp xếp không làm hỏng state | Bảng quản lý điểm sinh viên |
| 5 | Lazy initializer, state object `answers`, reset state bằng `key` | Quiz trắc nghiệm nhiều bước |

### Bài 1: FAQ Accordion (boolean, toggle, nâng state lên)

**Mục tiêu:** dùng state boolean để ẩn/hiện nội dung, hiểu mỗi instance có state riêng, biết khi nào phải nâng state lên cha, quan sát state bị hủy khi component bị gỡ.

**Yêu cầu:** hiển thị 3 câu hỏi FAQ dạng Card; bấm tiêu đề để mở/đóng câu trả lời, dấu `+` đổi thành `−` khi mở. Có công tắc “Chỉ mở một câu tại một thời điểm”:

- Tắt: mỗi câu mở/đóng độc lập, mở được nhiều câu cùng lúc.
- Bật: mở câu này thì câu đang mở tự đóng; bấm lại câu đang mở thì đóng lại. Nút “Đóng tất cả” chỉ bấm được khi đang có câu mở.

Dữ liệu:

```js
const faqs = [
  { id: 1, question: 'React là gì?', answer: 'Thư viện JavaScript để xây dựng giao diện người dùng theo component.' },
  { id: 2, question: 'State khác props thế nào?', answer: 'Props do cha truyền xuống và chỉ đọc; state do chính component quản lý và thay đổi được.' },
  { id: 3, question: 'Vì sao phải dùng setState?', answer: 'Vì chỉ khi gọi hàm set, React mới biết dữ liệu đổi để render lại giao diện.' },
];
```

**Các bước làm**

1. Tạo `src/usestate/FaqAccordion.jsx`, khai báo mảng `faqs` phía trên component.
2. Viết component con `FaqItem({ question, answer })` với `const [isOpen, setIsOpen] = useState(false);`. Tiêu đề `Card.Header` có `role="button"` và `onClick={() => setIsOpen((open) => !open)}`; nội dung hiện bằng `{isOpen && <Card.Body>...}`.
3. Trong `FaqAccordion`, `map` `faqs` ra các `FaqItem`. Chạy thử: mở được nhiều câu cùng lúc, vì mỗi `FaqItem` giữ state riêng.
4. Thử nghĩ: với cách này có làm được “chỉ mở một câu” không? (Không, vì các `FaqItem` không biết state của nhau.) → cần **nâng state lên cha**.
5. Thêm vào `FaqAccordion` hai state: `singleMode` (`false`) và `openId` (`null` nghĩa là không câu nào mở). Lưu `id` chứ không lưu cả object câu hỏi.
6. Viết `handleToggle(id)` bằng functional update: `setOpenId((current) => (current === id ? null : id))`.
7. Khi `singleMode` bật, render Card trực tiếp trong cha, điều kiện mở là `openId === id`.
8. Công tắc `Form.Check type="switch"`: `checked={singleMode}`, trong `onChange` gọi `setSingleMode(e.target.checked)` và `setOpenId(null)` (hai lệnh `set` được gộp thành một lần render).
9. Nút “Đóng tất cả”: `disabled={!singleMode || openId === null}`, `onClick={() => setOpenId(null)}`.
10. Quan sát: ở chế độ tắt, mở 2 câu rồi bật công tắc và tắt lại, các câu đều đóng. Giải thích bằng mục A11 (các `FaqItem` bị gỡ khỏi giao diện nên state bị hủy).

**Tiêu chí hoàn thành**

- [ ] Chế độ thường: mở được cả 3 câu cùng lúc.
- [ ] Chế độ “chỉ một câu”: mở câu 1 rồi câu 2 thì câu 1 tự đóng; bấm câu 2 lần nữa thì đóng hết.
- [ ] “Đóng tất cả” bị mờ khi không có câu nào mở.
- [ ] Giải thích được vì sao chuyển chế độ qua lại thì các câu đang mở bị đóng.

### Bài 2: Đánh giá sao (controlled component, state giao diện cục bộ, mảng state)

**Mục tiêu:** tách state “dữ liệu chính” (điểm đã chọn, nằm ở cha) và state “thuần giao diện” (sao đang rê chuột, nằm ở con); truyền `value`/`onChange` như một ô nhập có điều khiển; thêm phần tử vào mảng state và tính số liệu dẫn xuất.

**Yêu cầu:**

- Component `StarRating({ value, onChange, max = 5 })`: 5 ngôi sao; rê chuột tới sao nào thì tô vàng tới sao đó và hiện nhãn (Rất tệ, Tệ, Bình thường, Tốt, Tuyệt vời); rời chuột thì trở về điểm đã chọn; bấm để chọn, bấm lại sao đang chọn để bỏ chọn (về 0, nhãn “Chưa đánh giá”).
- Component `ReviewForm`: dùng `StarRating`, ô nhận xét (ít nhất 5 ký tự), nút “Gửi đánh giá” chỉ bấm được khi đã chọn sao và đủ ký tự. Gửi xong thêm vào **đầu** danh sách, reset form. Tiêu đề hiện “Trung bình X/5 (N lượt)” với 1 chữ số thập phân.

**Các bước làm**

1. Tạo `src/usestate/StarRating.jsx`, khai báo `LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']`.
2. `StarRating` **không** giữ điểm đã chọn (nhận `value` từ props), chỉ giữ `const [hovered, setHovered] = useState(0);`.
3. Tính `const display = hovered || value;` (đang rê chuột thì ưu tiên `hovered`).
4. Sinh sao bằng `Array.from({ length: max }, (_, i) => i + 1).map(...)`. Mỗi sao có `onMouseEnter={() => setHovered(star)}`, `onClick={() => onChange(star === value ? 0 : star)}`, màu theo `star <= display`. Thẻ bọc ngoài có `onMouseLeave={() => setHovered(0)}`.
5. Tạo `src/usestate/ReviewForm.jsx` với 3 state: `rating` (0), `comment` (`''`), `reviews` (`[]`).
6. Truyền `<StarRating value={rating} onChange={setRating} />`: có thể truyền thẳng hàm `set` làm callback.
7. Tính dẫn xuất: `canSubmit = rating > 0 && comment.trim().length >= 5` và `average` bằng `reduce` (khi chưa có lượt nào trả về `'0.0'` để tránh chia cho 0).
8. `handleSubmit`: `preventDefault()`, kiểm tra `canSubmit`, rồi `setReviews((prev) => [{ id: Date.now(), rating, comment: comment.trim() }, ...prev])`, reset `rating` và `comment`.
9. Hiển thị danh sách: `'★'.repeat(r)` màu vàng và `'★'.repeat(5 - r)` màu xám.

**Tiêu chí hoàn thành**

- [ ] Rê chuột qua sao 4 hiện “Tốt”; bấm chọn rồi rời chuột vẫn giữ 4 sao.
- [ ] Nút gửi bị mờ khi chưa chọn sao hoặc nhận xét dưới 5 ký tự.
- [ ] Gửi 4 sao và 2 sao thì tiêu đề hiện “Trung bình 3.0/5 (2 lượt)”, đánh giá mới nhất nằm trên cùng, form trở về trống.
- [ ] `StarRating` không có state nào tên `rating`/`value`.

### Bài 3: Máy tính BMI (ô số lưu chuỗi, kết quả dẫn xuất)

**Mục tiêu:** xử lý đúng ô `type="number"` (giá trị là chuỗi), kiểm tra hợp lệ và tính kết quả ngay khi render thay vì lưu kết quả vào state; cập nhật hai state cùng lúc khi đổi đơn vị.

**Yêu cầu:** nhập chiều cao và cân nặng, hiển thị ngay `BMI = x.x → Phân loại` trong `Alert` màu tương ứng (theo chuẩn châu Á):

| BMI | Phân loại | Màu `Alert` |
| --- | --- | --- |
| < 18.5 | Thiếu cân | `info` |
| 18.5 – < 23 | Bình thường | `success` |
| 23 – < 25 | Thừa cân | `warning` |
| ≥ 25 | Béo phì | `danger` |

- Có nút chọn đơn vị chiều cao `cm` / `m`; đổi đơn vị thì giá trị đang nhập được quy đổi (170 cm ↔ 1.7 m).
- Kiểm tra: chiều cao 50–250 cm (0.5–2.5 m), cân nặng 10–300 kg; sai thì ô đỏ kèm thông báo. Ô còn trống thì không báo lỗi, chỉ hiện dòng hướng dẫn.

**Các bước làm**

1. Tạo `src/usestate/BmiCalculator.jsx`, viết hàm `classify(bmi)` trả về `{ label, variant }` ở ngoài component.
2. Khai báo 3 state: `height` (`''`), `weight` (`''`), `unit` (`'cm'`). Giải thích vì sao lưu **chuỗi** chứ không phải số (để ô có thể trống, đang gõ dở).
3. Trong thân component: `const h = Number(height); const w = Number(weight);` và quy về mét: `unit === 'cm' ? h / 100 : h`.
4. Tạo object `errors` bằng `if`, chỉ kiểm tra khi ô **không trống**. Mẹo: `!(x >= min && x <= max)` bắt được cả trường hợp `NaN`.
5. Tính `ready`, `bmi` và `result` là các biến dẫn xuất; **không** tạo state `bmi` hay `result`.
6. Ô nhập: `type="number"`, `value={height}`, `onChange={(e) => setHeight(e.target.value)}`, `isInvalid` + `Form.Control.Feedback`.
7. `changeUnit(next)`: bỏ qua nếu trùng đơn vị hiện tại; nếu ô chiều cao có giá trị thì `setHeight(String(...))` quy đổi, sau đó `setUnit(next)`.
8. Hiển thị kết quả bằng toán tử 3 ngôi: có `result` thì `Alert`, ngược lại dòng hướng dẫn.

**Tiêu chí hoàn thành**

- [ ] 170 cm, 65 kg → “BMI = 22.5 → Bình thường” (màu xanh lá).
- [ ] Bấm `m`: ô chiều cao thành `1.7`, kết quả không đổi. Nhập `17` (m) báo “Chiều cao từ 0.5 đến 2.5 m”.
- [ ] 1.6 m, 90 kg → “BMI = 35.2 → Béo phì” (màu đỏ).
- [ ] Xóa trắng một ô thì kết quả biến mất nhưng không hiện lỗi đỏ.
- [ ] Component chỉ có đúng 3 `useState`.

### Bài 4: Quản lý điểm sinh viên (mảng object, object lồng nhau)

**Mục tiêu:** thực hành đầy đủ thêm/sửa/xóa trên mảng object, cập nhật thuộc tính **lồng nhau** đúng cách, sắp xếp để hiển thị mà không làm thay đổi state.

**Yêu cầu:** bảng sinh viên gồm Họ tên, Điểm (ô số sửa trực tiếp, kẹp trong 0–10, bước 0.5), Thành phố (select, lưu trong `contact.city`), Kết quả (Badge “Đạt” khi điểm ≥ 5), nút Xóa. Phía trên có ô thêm sinh viên (tên ít nhất 3 ký tự, điểm mặc định 0), select sắp xếp (Thứ tự nhập / Theo tên A → Z / Điểm cao → thấp), nút “+0.5 cả lớp” (không vượt 10). Dưới bảng: “Sĩ số: N · Điểm trung bình: X · Đạt: A/N” (trung bình 2 chữ số thập phân).

Dữ liệu:

```js
const CITIES = ['Hà Nội', 'Đà Nẵng', 'TP.HCM', 'Cần Thơ'];

const initialStudents = [
  { id: 1, name: 'Nguyễn Văn An', score: 8.5, contact: { city: 'Hà Nội' } },
  { id: 2, name: 'Trần Thị Bình', score: 4.5, contact: { city: 'Đà Nẵng' } },
  { id: 3, name: 'Lê Minh Châu', score: 6, contact: { city: 'TP.HCM' } },
];
```

**Các bước làm**

1. Tạo `src/usestate/StudentManager.jsx` với state `students`, `newName`, `sortBy` (`'none'`).
2. `addStudent(e)`: `preventDefault()`, kiểm tra độ dài tên, rồi `setStudents((prev) => [...prev, { id: Date.now(), name, score: 0, contact: { city: CITIES[0] } }])`.
3. `updateScore(id, text)`: chuyển `Number(text)`, kẹp bằng `Math.min(10, Math.max(0, ...))`, cập nhật bằng `map` + `{ ...s, score }`.
4. `updateCity(id, city)`: sao chép **hai cấp** `{ ...s, contact: { ...s.contact, city } }`. Thử viết sai `s.contact.city = city; return s;`: giao diện có vẻ vẫn chạy vì `map` tạo ra mảng mới, nhưng object cũ đã bị sửa ngầm. Nếu có chỗ khác đang giữ bản cũ (lịch sử để Hoàn tác, component con so sánh tham chiếu bằng `memo`) thì dữ liệu sẽ sai mà rất khó tìm lỗi. Sửa lại cho đúng.
5. `removeStudent(id)` dùng `filter`; `bonusAll()` dùng `map` cho mọi phần tử.
6. Tạo `sorted` là biến dẫn xuất: `'none'` thì dùng `students`, ngược lại `[...students].sort(...)`. So sánh tên tiếng Việt bằng `a.name.localeCompare(b.name, 'vi')`.
7. Tính `average` (tránh chia cho 0 khi lớp trống) và `passed` bằng `filter(...).length`.
8. Render bảng từ `sorted`, mỗi dòng dùng `key={id}` (không dùng index vì thứ tự thay đổi khi sắp xếp).

**Tiêu chí hoàn thành**

- [ ] Ban đầu hiển thị “Sĩ số: 3 · Điểm trung bình: 6.33 · Đạt: 2/3”.
- [ ] Sửa điểm Bình thành 7.5 → “7.33 · Đạt: 3/3”; bấm “+0.5 cả lớp” → “7.83”.
- [ ] Chọn “Điểm cao → thấp”: An, Bình, Châu. Chọn lại “Thứ tự nhập” thì về thứ tự ban đầu (chứng tỏ state không bị `sort` làm thay đổi).
- [ ] Đổi thành phố một dòng chỉ ảnh hưởng dòng đó; nút “Thêm” mờ khi tên dưới 3 ký tự.
- [ ] Trong file không có `push`, `splice`, `sort` trực tiếp trên `students`, hay phép gán `s.xxx = ...`.

### Bài 5: Quiz trắc nghiệm (lazy initializer, state object, reset bằng `key`)

**Mục tiêu:** dùng lazy initializer để chỉ xáo câu hỏi một lần, lưu đáp án dạng object `{ questionId: optionIndex }`, tính điểm dẫn xuất, và làm lại bài bằng cách đổi `key` thay vì reset từng state bằng tay.

**Yêu cầu:**

- 4 câu hỏi (dữ liệu bên dưới) được **xáo thứ tự** mỗi lượt làm bài, nhưng không bị xáo lại khi người dùng chọn đáp án.
- Mỗi lần hiện một câu: tiêu đề “Câu k: …”, danh sách 4 lựa chọn (lựa chọn đang chọn được tô sáng), thanh tiến độ “đã trả lời/tổng”. Nút “← Trước” (mờ ở câu đầu), “Tiếp →” (mờ khi câu hiện tại chưa chọn), ở câu cuối thay bằng “Nộp bài” (mờ khi chưa trả lời đủ).
- Nộp bài: hiện “Bạn đúng X/4 câu”, danh sách từng câu kèm đáp án đúng (xanh nếu đúng, đỏ nếu sai) và nút “Làm lại”. Làm lại thì mọi thứ về ban đầu, câu hỏi xáo thứ tự mới, dòng “Lượt làm bài thứ n” tăng 1.

```js
const QUESTIONS = [
  { id: 'q1', text: 'Hook nào dùng để lưu trạng thái cục bộ?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], answer: 1 },
  { id: 'q2', text: 'Gọi setCount(count + 1) ba lần trong một sự kiện, count tăng bao nhiêu?', options: ['1', '2', '3', '0'], answer: 0 },
  { id: 'q3', text: 'Cách đúng để thêm phần tử vào mảng state?', options: ['list.push(x)', 'setList(list.push(x))', 'setList([...list, x])', 'list[list.length] = x'], answer: 2 },
  { id: 'q4', text: 'Checkbox có điều khiển dùng prop nào?', options: ['value', 'checked', 'selected', 'defaultValue'], answer: 1 },
];
```

**Các bước làm**

1. Tạo `src/usestate/QuizApp.jsx`, viết hàm `shuffle(array)` (thuật toán Fisher–Yates trên **bản sao** `[...array]`).
2. Viết component `Quiz({ onRestart })` với các state:
    - `const [questions] = useState(() => shuffle(QUESTIONS));`: lazy initializer, không cần hàm `set` vì danh sách không đổi trong một lượt.
    - `index` (0), `answers` (`{}`), `finished` (`false`).
3. Thử viết `useState(shuffle(QUESTIONS))` (không có arrow): thứ tự vẫn giữ nhưng hàm `shuffle` chạy lại ở mỗi lần render, lãng phí. Sau đó sửa lại.
4. Tính dẫn xuất: `current = questions[index]`, `selected = answers[current.id]`, `answeredCount = Object.keys(answers).length`, `score = questions.filter((q) => answers[q.id] === q.answer).length`.
5. Chọn đáp án: `setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }))` (computed property).
6. Điều hướng: `setIndex((i) => i + 1)` / `setIndex((i) => i - 1)`; điều kiện `disabled` theo yêu cầu. Lưu ý kiểm tra `selected === undefined` (không dùng `!selected` vì đáp án index `0` là hợp lệ).
7. Khi `finished` là `true`, `return` sớm màn hình kết quả (sau khi đã gọi đủ các `useState`).
8. Viết `QuizApp` giữ `attempt` (1) và render `<Quiz key={attempt} onRestart={() => setAttempt((a) => a + 1)} />`. Không cần viết hàm reset từng state trong `Quiz`.

**Tiêu chí hoàn thành**

- [ ] Tải lại trang vài lần thấy câu 1 khác nhau; chọn đáp án không làm thứ tự câu đổi.
- [ ] Nút “Tiếp →” mờ khi chưa chọn; chọn đáp án đầu tiên (index 0) vẫn bấm “Tiếp” được.
- [ ] Quay lại câu trước vẫn thấy đáp án đã chọn.
- [ ] Trả lời đúng cả 4 câu → “Bạn đúng 4/4 câu”; bấm “Làm lại” → “Lượt làm bài thứ 2”, tiến độ “0/4”.
- [ ] `Quiz` không có hàm nào gọi `setIndex(0)`, `setAnswers({})`, `setFinished(false)` để reset.

---


## Phần C. Checklist lưu ý khi dùng `useState`

Dùng checklist này để tự rà soát code trước khi nộp bài hoặc review code của bạn cùng nhóm.

### D1. Khai báo và quy tắc hook

- [ ] `useState` được `import { useState } from 'react'` và gọi ở **cấp cao nhất** của component, không nằm trong `if`, vòng lặp, hàm con hay sau `return` sớm.
- [ ] Đặt tên theo cặp `[x, setX]`; boolean dùng tiền tố `is`/`has`/`can` (`isOpen`, `hasError`).
- [ ] Giá trị khởi tạo đúng kiểu sẽ dùng: `''` cho ô chữ, `false` cho checkbox, `[]` cho danh sách, `null` cho “chưa chọn”. Không để `undefined`.
- [ ] Giá trị khởi tạo tốn công tính (xáo mảng, đọc `localStorage`, sinh dữ liệu lớn) dùng lazy initializer `useState(() => ...)`.
- [ ] Không khai báo component bên trong component khác (state của con sẽ bị reset mỗi lần cha render).

### D2. Chọn đúng dữ liệu làm state

- [ ] Chỉ những giá trị **thay đổi theo thời gian** và **không tính được** từ state/props khác mới là state.
- [ ] Không lưu dữ liệu dẫn xuất: tổng tiền, danh sách đã lọc/sắp xếp, số lượng, `isValid`, `fullName`… được tính khi render.
- [ ] Không copy props vào state (trừ khi cố ý chỉ lấy giá trị ban đầu, đặt tên `initialXxx`).
- [ ] Không lưu trùng dữ liệu: lưu `selectedId` thay vì cả object đã có trong mảng.
- [ ] Các boolean loại trừ nhau (`isLoading`, `isSuccess`, `isError`) được gộp thành một `status`.
- [ ] State chung cho nhiều component được **nâng lên** cha gần nhất; state chỉ phục vụ giao diện một component (hover, mở menu) để ở chính component đó.

### D3. Cập nhật state

- [ ] Giá trị mới phụ thuộc giá trị cũ thì dùng dạng hàm: `setX((prev) => ...)`.
- [ ] Bên trong `setTimeout`, `setInterval`, `Promise`, `async` luôn dùng dạng hàm để tránh đọc giá trị cũ (stale closure).
- [ ] Không đọc state ngay sau `setX` và mong có giá trị mới; cần dùng ngay thì tính vào biến trước.
- [ ] Hàm updater và phần thân component không có tác dụng phụ (gọi API, `set` state khác, `console.log` để debug thì tạm được).
- [ ] Không gọi `setX(...)` trực tiếp trong phần thân render (gây vòng lặp “Too many re-renders”); chỉ gọi trong hàm xử lý sự kiện.
- [ ] Truyền hàm cho sự kiện: `onClick={handleClick}` hoặc `onClick={() => setX(1)}`, **không** `onClick={setX(1)}`.

### D4. Object và mảng

- [ ] Không sửa trực tiếp: không `obj.key = ...`, `arr.push`, `arr.splice`, `arr.sort`, `arr.reverse`, `arr[i] = ...` trên state.
- [ ] Thêm dùng `[...arr, x]`; xóa dùng `filter`; sửa dùng `map` + `{ ...item, key: value }`.
- [ ] Sắp xếp/đảo ngược trên bản sao `[...arr].sort()` hoặc `toSorted()`.
- [ ] Object lồng nhau được sao chép **ở mọi cấp** trên đường đi tới thuộc tính cần sửa.
- [ ] Cập nhật object nhiều trường bằng một hàm dùng chung với computed property `[name]: value`.
- [ ] Danh sách render bằng `map` có `key` ổn định, duy nhất (thường là `id`), không dùng index khi danh sách có thể thêm/xóa/sắp xếp.

### D5. Form và ô nhập

- [ ] Ô nhập có điều khiển có đủ cặp `value` + `onChange` (checkbox: `checked` + `onChange`).
- [ ] Nhớ `e.target.value` luôn là chuỗi; ô số lưu chuỗi và chuyển `Number()` khi tính, kiểm tra `NaN`.
- [ ] Checkbox đọc `e.target.checked`, không đọc `value`.
- [ ] Kiểm tra “chưa chọn” bằng `=== undefined`/`=== null`/`=== ''`, không dùng `!value` khi `0` là giá trị hợp lệ.
- [ ] `handleSubmit` gọi `e.preventDefault()` và reset form bằng cách đặt state về giá trị ban đầu.

### D6. Giữ và reset state

- [ ] Hiểu state gắn với **vị trí** component trong giao diện: gỡ component (điều kiện `&&` thành `false`) thì state mất.
- [ ] Muốn reset toàn bộ state của một component (làm lại quiz, đổi người đang chat) thì đổi prop `key` thay vì viết nhiều lệnh `set` về giá trị đầu.
- [ ] Muốn **giữ** state khi ẩn/hiện thì giữ component luôn được render và ẩn bằng CSS (`d-none`), hoặc nâng state lên cha.

### D7. Khi nào không nên dùng `useState`

| Tình huống | Dùng thay thế |
| --- | --- |
| Giá trị không bao giờ đổi | Hằng số khai báo ngoài component |
| Giá trị tính được từ state/props | Biến tính khi render (`useMemo` nếu tính rất nặng) |
| Nhiều state liên quan với nhiều kiểu cập nhật phức tạp | `useReducer` |
| Dữ liệu cần dùng ở nhiều component xa nhau | `useContext` (thường kết hợp `useReducer`) |
| Giá trị cần nhớ nhưng thay đổi **không** cần render lại (id của timer, tham chiếu tới thẻ DOM) | `useRef` |
| Dữ liệu từ server (danh sách sản phẩm từ API) | `useState` + `useEffect`, hoặc thư viện như TanStack Query |

### D8. Câu hỏi tự kiểm tra

1. Vì sao `let count = 0; count++` trong component không làm giao diện đổi?
2. Gọi `setCount(count + 1)` ba lần trong một hàm, `count` tăng bao nhiêu? Sửa thế nào để tăng 3?
3. `console.log(count)` ngay sau `setCount(10)` in ra gì? Vì sao?
4. Vì sao `items.push(x); setItems(items);` không render lại?
5. Viết lệnh đổi `student.contact.address.city` mà không sửa trực tiếp state.
6. `useState(fn())` khác `useState(fn)` và `useState(() => fn())` ở điểm nào?
7. Khi nào cần nâng state lên cha? Cho ví dụ.
8. Hai cách để reset toàn bộ state của một component là gì? Cách nào gọn hơn?
9. Vì sao không nên lưu `filteredProducts` hay `totalPrice` vào state?
10. Ô `type="number"` trả về kiểu gì trong `e.target.value`? Nên lưu kiểu gì trong state?
