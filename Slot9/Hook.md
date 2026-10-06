# 10 bài tập Hook cơ bản trong ReactJS – useState, useReducer, useContext, sự kiện và validation

Ngày tạo: 2026-09-27

## Chuẩn bị và cách làm bài

Bộ bài này là phần tiếp theo của tài liệu **ES6.md** (10 bài ES6 với Card, Form, danh sách, layout). Ở ES6.md mọi giao diện đều tĩnh; ở đây bạn dùng hook để giao diện **phản hồi người dùng**: bấm nút, gõ phím, lọc dữ liệu, kiểm tra form, quản lý giỏ hàng và chia sẻ dữ liệu toàn ứng dụng.

| Bài | Hook / kỹ thuật chính | Thành phần giao diện |
| --- | --- | --- |
| 1 | Làm quen `useState`: state số, state mảng, `onClick`, functional update | Bộ chọn số lượng, giỏ hàng mini tăng/giảm số lượng |
| 2 | Controlled input, `onChange`, `onKeyDown`, `onFocus`/`onBlur` | Form hồ sơ có xem trước trực tiếp |
| 3 | Nhiều state, dữ liệu dẫn xuất (derived state) | Tìm kiếm, lọc, sắp xếp sản phẩm |
| 4 | State object, một `handleChange` cho mọi ô, `onSubmit`, báo lỗi bằng `Form.Control.Feedback` | Form đăng ký có điều khiển |
| 5 | Validation: `errors`, `touched`, `isInvalid`, Regex | Form đăng ký có kiểm tra lỗi |
| 6 | State dạng mảng: thêm/sửa/xóa bất biến | Todo list |
| 7 | `useReducer` cơ bản: reducer, action, dispatch | Giỏ hàng |
| 8 | `useReducer` cho form + validation + trạng thái gửi | Form đăng nhập giả lập API |
| 9 | `useContext`: `createContext`, Provider, custom hook | Theme sáng/tối và đăng nhập |
| 10 | Tổng hợp: Context + Reducer + form validation | Cửa hàng mini có giỏ hàng và thanh toán |

**Quy ước chung**

- Chỉ dùng `useState`, `useReducer`, `useContext`. Chưa dùng `useEffect`, `useRef`, `useMemo` (các hook này ở bài sau).
- Tiếp tục dùng React-Bootstrap và các component đã có ở ES6.md: `AppButton`, `InputField`, `ProductCard`, `ProductList`, dữ liệu `products`.
- Mỗi bài có bốn phần: mục tiêu, yêu cầu, các bước làm (step-by-step) và tiêu chí hoàn thành. Đáp án mẫu ở cuối tài liệu đã được build và chạy thử bằng Vite + React 19 + React-Bootstrap 2 (không có lỗi hay cảnh báo trong Console). Hãy tự làm trước rồi mới đối chiếu.

**Chuẩn bị project (làm một lần)**

1. Dùng lại project `es6-react-ui` của ES6.md. Nếu làm mới, tạo lại theo phần “Tạo project” của ES6.md và chép sang: `src/data/products.js`, `src/components/AppButton.jsx`, `InputField.jsx`, `ProductCard.jsx` (bản Bài 5), `ProductList.jsx`, `src/data/menu.js`.
2. Tạo thêm các thư mục: `src/utils`, `src/reducers`, `src/context`, `src/pages`.
3. Tạo `src/utils/format.js` dùng chung cho mọi bài:

    ```js
    export const formatVND = (n) =>
      n?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) ?? 'Liên hệ';

    export const getFinalPrice = ({ price = 0, discount = 0 }) =>
      Math.round(price * (1 - discount / 100));
    ```

4. Nâng cấp `ProductCard` để nút “Thêm vào giỏ” gọi được hàm từ bên ngoài (dùng ở Bài 3, 7, 10). Thêm prop `onAddToCart` vào tham số và gắn vào `Button`:

    ```jsx
    const ProductCard = ({ product, onAddToCart }) => {
      // ...giữ nguyên phần destructuring và giao diện của ES6.md Bài 5
      <Button
        variant="primary"
        className="mt-auto"
        disabled={!inStock}
        onClick={() => onAddToCart?.(product)}
      >
    ```

    `onAddToCart?.(product)` dùng optional chaining: nếu cha không truyền hàm thì bấm nút không gây lỗi.

5. `ProductList` nhận thêm `onAddToCart` và chuyển tiếp xuống từng thẻ:

    ```jsx
    const ProductList = ({ products, onAddToCart }) => (
      <Row xs={1} md={2} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Col>
        ))}
      </Row>
    );
    ```

Cách làm mỗi bài: tạo component trong `src/components` (hoặc `src/pages`), import vào `App.jsx`, lưu và thử tương tác trên trình duyệt. Mở tab Console (F12) để phát hiện lỗi.

## Tóm tắt lý thuyết Hook cần nhớ

### 1. Hook là gì và hai quy tắc bắt buộc

Hook là các hàm bắt đầu bằng `use` cho phép function component “ghi nhớ” dữ liệu giữa các lần render và kết nối với các tính năng của React.

- **Chỉ gọi hook ở cấp cao nhất** của component: không đặt trong `if`, vòng lặp, hàm con hay sau một `return` sớm. React nhận diện từng hook theo **thứ tự gọi**, nên thứ tự phải giống nhau ở mọi lần render.
- **Chỉ gọi hook trong function component hoặc custom hook** (hàm tên bắt đầu bằng `use`), không gọi trong hàm JS thường.

```jsx
// SAI: hook nằm trong if
if (isLoggedIn) { const [name, setName] = useState(''); }

// ĐÚNG: gọi hook trước, dùng if trong phần xử lý hoặc JSX
const [name, setName] = useState('');
if (!isLoggedIn) return <p>Vui lòng đăng nhập</p>;
```

### 2. `useState`: trạng thái cục bộ

```jsx
import { useState } from 'react';

const [count, setCount] = useState(0);        // [giá trị hiện tại, hàm cập nhật]
const [user, setUser] = useState({ name: '' });
const [todos, setTodos] = useState([]);
```

Cơ chế: gọi `setCount(5)` không đổi biến `count` ngay lập tức, mà **yêu cầu React render lại** component; ở lần render mới `count` mới là 5. Vì vậy:

- **Functional update:** khi giá trị mới phụ thuộc giá trị cũ, truyền hàm: `setCount((prev) => prev + 1)`. Gọi 3 lần `setCount(count + 1)` trong cùng một sự kiện chỉ tăng 1 (cả 3 lần cùng đọc `count` cũ), còn 3 lần `setCount((c) => c + 1)` tăng 3.
- **Bất biến (immutable):** không sửa trực tiếp object/mảng trong state (`user.name = 'An'`, `todos.push(...)`), vì React so sánh tham chiếu, thấy vẫn là object cũ nên không render lại. Luôn tạo bản sao mới bằng spread và các hàm trả về mảng mới.

| Thao tác | Cách viết bất biến |
| --- | --- |
| Sửa một thuộc tính object | `setUser((u) => ({ ...u, name: 'An' }))` |
| Sửa thuộc tính theo tên động | `setValues((v) => ({ ...v, [name]: value }))` |
| Thêm phần tử | `setTodos((t) => [...t, newTodo])` |
| Xóa phần tử | `setTodos((t) => t.filter((x) => x.id !== id))` |
| Sửa một phần tử | `setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))` |
| Sắp xếp | `[...list].sort(...)` (không `sort` trực tiếp mảng state) |

- **Giá trị khởi tạo tính một lần:** `useState(() => tinhToanNang())` chỉ chạy hàm ở lần render đầu.

### 3. Xử lý sự kiện

React đặt tên sự kiện theo camelCase và nhận **một hàm** (không phải lời gọi hàm):

```jsx
<button onClick={handleClick}>OK</button>           // đúng: truyền hàm
<button onClick={handleClick()}>OK</button>         // SAI: gọi ngay khi render
<button onClick={() => remove(id)}>Xóa</button>     // cần truyền tham số → bọc arrow function
```

| Sự kiện | Dùng khi | Thông tin hay lấy |
| --- | --- | --- |
| `onClick` | Bấm nút, thẻ, link | — |
| `onChange` | Mỗi lần giá trị input/select/checkbox đổi | `e.target.value`, `e.target.checked`, `e.target.name` |
| `onSubmit` | Gửi form (bấm nút submit hoặc Enter) | Luôn gọi `e.preventDefault()` để trang không tải lại |
| `onKeyDown` | Nhấn phím | `e.key` (`'Enter'`, `'Escape'`, …) |
| `onFocus` / `onBlur` | Vào / rời một ô nhập | Dùng để đánh dấu ô đã “chạm” (touched) |
| `onDoubleClick` | Nhấp đúp | Hay dùng để bật chế độ sửa |

Tham số `e` là **SyntheticEvent** của React, có cùng giao diện với sự kiện gốc của trình duyệt (`e.target`, `e.preventDefault()`, `e.stopPropagation()`). Đặt tên hàm xử lý theo mẫu `handleXxx`, prop nhận hàm theo mẫu `onXxx` (ví dụ `onAddToCart`).

### 4. Controlled component (ô nhập có điều khiển)

Ô nhập “có điều khiển” là ô mà **giá trị do state quyết định** (`value={state}`) và mọi thay đổi đi qua `onChange` → `setState`. Nhờ đó state luôn là nguồn dữ liệu duy nhất, dễ kiểm tra, định dạng và reset.

| Loại ô | Prop giá trị | Lấy giá trị trong `onChange` |
| --- | --- | --- |
| `input` text/email/password/date, `textarea` | `value` | `e.target.value` |
| `select` | `value` | `e.target.value` |
| `checkbox`, `switch` | `checked` | `e.target.checked` |
| `radio` | `checked={state === value}` | `e.target.value` |

Một hàm cho mọi ô, dựa vào thuộc tính `name`:

```jsx
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
};
```

Có `value` mà thiếu `onChange` thì ô nhập bị “đóng băng” và React cảnh báo trong Console.

### 5. Dữ liệu dẫn xuất (derived state)

Những gì **tính được** từ state/props thì tính ngay khi render, không tạo thêm state:

```jsx
const [keyword, setKeyword] = useState('');
// ĐÚNG: tính lại mỗi lần render
const visible = products.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()));
// SAI: const [visible, setVisible] = useState(products) rồi cố đồng bộ bằng tay
```

Ví dụ khác: tổng tiền giỏ hàng, số việc chưa xong, danh sách lỗi validation, nút có bị vô hiệu hay không.

### 6. Validation form

Mô hình dùng trong các bài:

1. **`values`**: giá trị các ô (state).
2. **`validate(values)`**: hàm thuần trả về object `errors`, ví dụ `{ email: 'Email không đúng định dạng' }`. Không có lỗi thì trả về `{}`.
3. **`touched`**: ô nào người dùng đã rời khỏi (`onBlur`), để không báo lỗi đỏ ngay khi vừa mở form.
4. **Khi submit**: `preventDefault()`, đánh dấu mọi ô là touched, nếu `Object.keys(errors).length > 0` thì dừng; ngược lại xử lý dữ liệu.
5. **Hiển thị** bằng React-Bootstrap: `<Form noValidate>` (tắt thông báo mặc định của trình duyệt), `isInvalid` trên `Form.Control`, thông báo trong `<Form.Control.Feedback type="invalid">`.

| Quy tắc | Cách kiểm tra |
| --- | --- |
| Bắt buộc | `!value.trim()` |
| Độ dài | `value.trim().length < 3` |
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)` |
| Số điện thoại VN 10 số | `/^0\d{9}$/.test(value)` |
| Có cả chữ và số | `/[A-Za-z]/.test(v) && /\d/.test(v)` |
| Khớp mật khẩu | `confirm === password` |
| Checkbox bắt buộc | `values.agree === true` |

Validation phía client chỉ giúp trải nghiệm tốt hơn; server vẫn phải kiểm tra lại.

### 7. `useReducer`: gom logic cập nhật vào một chỗ

```jsx
import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'set':       return { ...state, count: action.payload };
    default:          throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'set', payload: 10 });
```

- **Reducer** là hàm thuần `(state, action) => newState`: không sửa state cũ, không gọi API, không `setTimeout`, không `Math.random()`/`Date.now()` (những việc có tác dụng phụ làm trong hàm xử lý sự kiện rồi mới `dispatch`).
- **Action** là object mô tả “chuyện gì đã xảy ra”: `{ type, payload }`. Nên khai báo hằng số `type` để tránh gõ sai.
- `dispatch` không đổi `state` ngay, giống `setState`.

| Chọn `useState` khi | Chọn `useReducer` khi |
| --- | --- |
| Vài giá trị độc lập, đơn giản | State là object nhiều phần liên quan nhau |
| Cập nhật đơn giản (gán, bật/tắt) | Nhiều kiểu cập nhật (thêm, tăng, giảm, xóa, reset) |
| Logic nằm gọn trong một component | Muốn tách logic ra file riêng, dễ test, dễ đọc |

### 8. `useContext`: chia sẻ dữ liệu không cần truyền props qua nhiều cấp

Khi `App → Layout → Header → CartBadge` đều phải nhận một prop chỉ để chuyển tiếp xuống (prop drilling), hãy dùng Context:

```jsx
// 1. Tạo context
const ThemeContext = createContext(null);

// 2. Provider giữ state và cung cấp value cho cây con
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// 3. Custom hook để dùng gọn và báo lỗi khi quên Provider
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme phải dùng bên trong ThemeProvider');
  return ctx;
};

// 4. Dùng ở bất kỳ component con nào
const { theme, setTheme } = useTheme();
```

- Mọi component gọi `useContext` sẽ render lại khi `value` thay đổi. Chỉ đưa vào context dữ liệu thật sự dùng chung (theme, người dùng đăng nhập, giỏ hàng, ngôn ngữ).
- Kết hợp phổ biến: **Context + useReducer** = kho dữ liệu toàn cục nhỏ (Bài 10).
- Nếu project có ESLint của Vite, file vừa export Provider vừa export hook có thể hiện cảnh báo `react-refresh/only-export-components`. Đây chỉ là cảnh báo về hot reload; có thể bỏ qua hoặc tách hook ra file riêng.

### 9. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| Bấm nút không thấy giao diện đổi | Sửa trực tiếp object/mảng state | Tạo bản sao mới bằng spread/`map`/`filter` |
| `console.log(state)` ngay sau `setState` vẫn ra giá trị cũ | State chỉ đổi ở lần render sau | Dùng giá trị mới đã tính trong biến, hoặc log trong phần render |
| “Too many re-renders” | Viết `onClick={setOpen(true)}` | Viết `onClick={() => setOpen(true)}` |
| Trang tải lại khi submit | Quên `e.preventDefault()` | Gọi ở dòng đầu `handleSubmit` |
| Cảnh báo “changing an uncontrolled input to be controlled” | State khởi tạo `undefined` | Khởi tạo chuỗi rỗng `''` hoặc `false` |
| `useXxx must be used within Provider` | Component nằm ngoài Provider | Bọc Provider ở `App.jsx` phía trên component đó |

## Bài 1: Bộ chọn số lượng và giỏ hàng mini (làm quen `useState`)

**Mục tiêu:** làm quen với `useState` qua hai phần:

- **Phần 1:** state là **một số**. Khai báo, đọc, cập nhật state bằng `onClick`; hiểu vì sao cần functional update khi giá trị mới phụ thuộc giá trị cũ; thấy mỗi component có state riêng.
- **Phần 2:** state là **một mảng object** (giỏ hàng). Tăng/giảm số lượng từng dòng mà không sửa trực tiếp mảng; tính thành tiền và tổng cộng từ state thay vì lưu thêm state.

**Yêu cầu Phần 1: `QuantityPicker`**

- Component nhận prop `min = 1`, `max = 10`. Gồm nút `−`, ô hiển thị số lượng, nút `+`. Không cho giảm dưới `min` hay tăng quá `max` (nút tương ứng bị `disabled`). Có nút “Đặt lại” và dòng chữ đỏ “Tối đa 10 sản phẩm” khi chạm `max`.
- Thêm 2 nút thí nghiệm: “+3 (sai)” gọi `setQuantity(quantity + 1)` ba lần, “+3 (đúng)” dùng functional update ba lần.

**Yêu cầu Phần 2: `MiniCart`**

Bảng giỏ hàng gồm các cột Sản phẩm, Đơn giá, Số lượng, Thành tiền. Cột Số lượng có nút `−` và `+` để giảm/tăng số lượng của **từng dòng**:

- Số lượng mỗi dòng trong khoảng 1–10; đạt 1 thì nút `−` mờ, đạt 10 thì nút `+` mờ.
- Thành tiền của dòng và dòng **Tổng cộng** (tổng số lượng, tổng tiền) cập nhật ngay khi bấm.
- Tiền hiển thị theo định dạng `590.000 ₫` (dùng `formatVND` trong `src/utils/format.js`).

Dữ liệu dùng lại file `src/data/cart.js` của ES6.md Bài 7 (tạo mới nếu chưa có):

```js
export const cartItems = [
  { id: 1, name: 'Tai nghe Bluetooth', price: 590000, quantity: 2 },
  { id: 4, name: 'Màn hình 24 inch', price: 3490000, quantity: 1 },
  { id: 2, name: 'Chuột không dây', price: 250000, quantity: 3 },
  { id: 8, name: 'USB 64GB', price: 150000, quantity: 5 },
];
```

**Các bước làm: Phần 1**

1. Tạo `src/components/QuantityPicker.jsx`, `import { useState } from 'react';` và các component `ButtonGroup`, `Button`.
2. Khai báo `const [quantity, setQuantity] = useState(min);` ở dòng đầu của component. Thử thêm `console.log(quantity)` rồi bấm nút để thấy component render lại sau mỗi lần cập nhật.
3. Viết `decrease` và `increase` dạng functional update, kẹp giá trị bằng `Math.max`/`Math.min`: `setQuantity((q) => Math.min(q + 1, max))`.
4. Viết `addThreeWrong` gọi `setQuantity(Math.min(quantity + 1, max))` ba lần và `addThree` gọi `increase()` ba lần. Bấm thử cả hai, ghi lại kết quả và giải thích.
5. Dựng giao diện với `ButtonGroup`; truyền **tên hàm** vào `onClick={increase}`; nút reset cần tham số nên viết `onClick={() => setQuantity(min)}`.
6. Dùng `disabled={quantity >= max}` và `{quantity === max && <small>...</small>}` (điều kiện `&&` từ ES6.md Bài 5).
7. Hiển thị 2 `QuantityPicker` (một cái `min={2} max={5}`) để thấy mỗi component có state **riêng**.

**Các bước làm: Phần 2**

8. Tạo `src/components/MiniCart.jsx`, import `cartItems` và `formatVND`. Khai báo hằng `MIN_QUANTITY = 1`, `MAX_QUANTITY = 10` ở ngoài component.
9. Khai báo state là mảng: `const [items, setItems] = useState(cartItems);`. Mảng `cartItems` chỉ là giá trị **ban đầu**; từ đây mọi thay đổi đi qua `setItems`.
10. Thử cách **sai** trước: trong hàm tăng viết `item.quantity++` rồi `setItems(items)`. Bấm nút và quan sát: số trên giao diện không đổi, vì `items` vẫn là mảng cũ (cùng tham chiếu) nên React không render lại. Xóa đoạn này đi.
11. Viết một hàm dùng cho cả tăng và giảm: `changeQuantity(id, delta)` với `delta` là `1` hoặc `-1`. Dùng functional update và `map` tạo mảng mới, dòng cần sửa được thay bằng object mới:

    ```jsx
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, item.quantity + delta)) }
          : item,
      ),
    );
    ```

12. Tính dữ liệu dẫn xuất ngay trong thân component bằng `reduce`: `totalQuantity` và `totalPrice`. **Không** tạo state cho tổng.
13. Dựng `Table bordered hover`: `items.map` ra từng `<tr key={id}>`; cột Số lượng là `ButtonGroup size="sm"` gồm nút `−` (`onClick={() => changeQuantity(id, -1)}`), ô số lượng, nút `+` (`onClick={() => changeQuantity(id, 1)}`). Mỗi nút có `aria-label` như `` `Tăng ${name}` ``.
14. Đặt dòng tổng trong `<tfoot>`. Hiển thị `MiniCart` bên dưới 2 `QuantityPicker` trong `App.jsx`.

**Tiêu chí hoàn thành**

- [ ] Phần 1: bắt đầu từ 1, bấm “+3 (sai)” chỉ lên 2; bấm tiếp “+3 (đúng)” lên 5. Bạn giải thích được vì sao.
- [ ] Phần 1: nút `−` mờ khi số lượng là 1; nút `+` mờ và hiện dòng cảnh báo khi là 10; hai `QuantityPicker` tăng giảm độc lập.
- [ ] Phần 2: ban đầu dòng Tổng cộng hiện số lượng **11**, tổng tiền **6.170.000 ₫**; nút `−` của Màn hình 24 inch (số lượng 1) bị mờ.
- [ ] Bấm `+` ở Tai nghe Bluetooth: số lượng 3, thành tiền 1.770.000 ₫, tổng 12 và 6.760.000 ₫. Bấm tiếp `−` ở Chuột không dây: tổng 11 và 6.510.000 ₫.
- [ ] Bấm `+` ở USB 64GB đến khi dừng: số lượng 10, nút `+` mờ, tổng 16 và 7.260.000 ₫.
- [ ] Trong `MiniCart.jsx` chỉ có một `useState`; không có `push`, `splice`, `item.quantity++` hay phép gán trực tiếp vào phần tử của `items`.

## Bài 2: Form hồ sơ xem trước trực tiếp (controlled input, `onChange`, `onKeyDown`, `onFocus`/`onBlur`)

**Mục tiêu:** biến ô nhập thành controlled component, đọc thông tin từ đối tượng sự kiện `e`, xử lý phím và tiêu điểm.

**Yêu cầu:** tạo `ProfilePreview` gồm 2 cột. Cột trái là form: Họ tên, Chuyên ngành (select), Giới thiệu (textarea tối đa 150 ký tự), Mật khẩu có nút Hiện/Ẩn. Cột phải là `Card` “Xem trước” cập nhật ngay khi gõ.

**Các bước làm**

1. Tạo `src/components/ProfilePreview.jsx`, khai báo hằng `MAX_BIO = 150` và mảng `majors` (dùng lại từ ES6.md Bài 8).
2. Khai báo các state: `fullName` (`''`), `major` (`majors[0]`), `bio` (`''`), `password` (`''`), `showPassword` (`false`), `focused` (`''`).
3. Ô Họ tên: `value={fullName}` và `onChange={(e) => setFullName(e.target.value)}`. Thử xóa `onChange` để thấy ô không gõ được và đọc cảnh báo trong Console, rồi thêm lại.
4. Thêm `onKeyDown={handleNameKeyDown}`: nếu `e.key === 'Escape'` thì xóa trắng ô.
5. Thêm `onFocus={() => setFocused('fullName')}` và `onBlur={() => setFocused('')}`; khi đang focus, gắn thêm class `border-primary border-2` bằng template literal hoặc toán tử 3 ngôi.
6. Select chuyên ngành: `value={major}` và `onChange` tương tự; option sinh bằng `majors.map`.
7. Textarea: trong `handleBioChange` lấy `e.target.value` và lưu `value.slice(0, MAX_BIO)` để không vượt quá 150 ký tự (dán đoạn dài vẫn giữ 150 ký tự đầu). Dưới ô hiện `` `Còn ${remaining}/${MAX_BIO} ký tự` ``, chuyển chữ đỏ khi còn dưới 20.
8. Mật khẩu: `InputGroup` gồm `Form.Control type={showPassword ? 'text' : 'password'}` và nút đổi `showPassword` bằng `setShowPassword((s) => !s)`.
9. Card xem trước: tên dùng `fullName.trim() || 'Chưa nhập tên'`, giới thiệu trống thì hiện chữ nghiêng “Chưa có giới thiệu”, dòng cuối hiện số ký tự mật khẩu (không hiện mật khẩu thật).
10. Bọc form bằng `<Form onSubmit={(e) => e.preventDefault()}>` để nhấn Enter không tải lại trang.

**Tiêu chí hoàn thành**

- [ ] Gõ tên, đổi chuyên ngành, gõ giới thiệu thì Card bên phải đổi ngay.
- [ ] Nhấn Esc trong ô Họ tên thì ô trống và Card hiện “Chưa nhập tên”.
- [ ] Không gõ được quá 150 ký tự; bộ đếm chuyển đỏ khi còn dưới 20.
- [ ] Nút Hiện/Ẩn đổi được kiểu hiển thị mật khẩu; viền ô Họ tên đậm lên khi được focus.

## Bài 3: Tìm kiếm, lọc và sắp xếp sản phẩm (nhiều state, dữ liệu dẫn xuất)

**Mục tiêu:** phối hợp nhiều state cho bộ lọc, tính danh sách hiển thị ngay khi render thay vì lưu thêm state, biến giao diện bộ lọc tĩnh của ES6.md Bài 10 thành bộ lọc hoạt động.

**Yêu cầu:** tạo `ProductFilter` nhận prop `products` (và `onAddToCart` để dùng ở Bài 10). Có ô tìm theo tên, select sắp xếp (Mặc định, Giá tăng dần, Giá giảm dần, Đánh giá cao), công tắc “Còn hàng”, nút “Xóa lọc”, thanh nút danh mục và dòng “Tìm thấy X/Y sản phẩm”. Không có kết quả thì hiện `Alert` “Không có sản phẩm phù hợp”.

**Các bước làm**

1. Tạo `src/components/ProductFilter.jsx`. Khai báo 4 state: `keyword` (`''`), `category` (`'Tất cả'`), `onlyInStock` (`false`), `sortBy` (`'default'`).
2. Tạo danh sách danh mục như ES6.md Bài 4: `['Tất cả', ...new Set(products.map((p) => p.category?.name ?? 'Khác'))]`.
3. Khai báo object `sorters` ở ngoài component, ánh xạ mỗi giá trị của select thành một hàm so sánh. Sắp theo giá **sau giảm** bằng `getFinalPrice`.
4. Tính `visibleProducts` bằng chuỗi `filter` → `filter` → `filter` → `sort(sorters[sortBy])`. Vì `filter` đã trả về mảng mới nên `sort` không làm hỏng `products` gốc. **Không** tạo state `visibleProducts`.
5. Ô tìm kiếm: so sánh không phân biệt hoa thường bằng `toLowerCase()` và bỏ khoảng trắng thừa bằng `trim()`.
6. Công tắc dùng `Form.Check type="switch"` với `checked={onlyInStock}` và `onChange={(e) => setOnlyInStock(e.target.checked)}` (checkbox đọc `checked`, không đọc `value`).
7. Thanh danh mục: `categories.map` ra `Button`, nút đang chọn có `variant="primary"`, còn lại `outline-primary`; `onClick={() => setCategory(name)}`.
8. “Xóa lọc” đưa cả 4 state về giá trị ban đầu.
9. Hiển thị kết quả bằng toán tử 3 ngôi: rỗng thì `Alert`, ngược lại `ProductList products={visibleProducts} onAddToCart={onAddToCart}`.

**Tiêu chí hoàn thành**

- [ ] Gõ “chuột” (hay “CHUỘT”) còn 1 sản phẩm; gõ “u” còn 4 sản phẩm.
- [ ] Chọn “Phụ kiện” và bật “Còn hàng” còn 2 sản phẩm (Chuột không dây, Webcam Full HD).
- [ ] Sắp “Giá giảm dần” khi đang lọc Phụ kiện + Còn hàng thì Webcam đứng trước.
- [ ] “Xóa lọc” trả về “Tìm thấy 8/8 sản phẩm”; gõ “abc” hiện `Alert`.
- [ ] Trong component chỉ có đúng 4 `useState`.

## Bài 4: Form đăng ký có điều khiển (state object, một `handleChange`, `onSubmit`, báo lỗi bằng `Form.Control.Feedback`)

**Mục tiêu:** quản lý cả form bằng một state object, viết một hàm `handleChange` dùng chung cho text, radio, select, checkbox bằng computed property `[name]`, xử lý submit và reset; tự kiểm tra các điều khiển và hiển thị lỗi **màu đỏ ngay dưới từng điều khiển** bằng `Form.Control.Feedback`, không dùng bong bóng thông báo mặc định của trình duyệt.

**Yêu cầu:** nâng cấp `RegisterForm` tĩnh của ES6.md Bài 8 thành form có điều khiển:

- Form có `noValidate` để trình duyệt **không** tự hiện bong bóng thông báo khi ô `required` còn trống.
- Khi bấm “Đăng ký”, kiểm tra các điều khiển. Điều khiển nào lỗi thì viền đỏ (`isInvalid`) và hiện dòng chữ đỏ ngay bên dưới bằng `Form.Control.Feedback`:

| Điều khiển | Lỗi khi | Thông báo |
| --- | --- | --- |
| Họ và tên | Để trống | “Vui lòng nhập họ và tên” |
| Email | Để trống | “Vui lòng nhập email” |
| Mật khẩu | Để trống | “Vui lòng nhập mật khẩu” |
| Nhập lại mật khẩu | Để trống / khác mật khẩu | “Vui lòng nhập lại mật khẩu” / “Mật khẩu nhập lại không khớp” |
| Chuyên ngành (select) | Chưa chọn | “Vui lòng chọn chuyên ngành” |
| Đồng ý điều khoản (checkbox) | Chưa tích | “Bạn cần đồng ý điều khoản” |

- Người dùng sửa một điều khiển thì lỗi của **riêng** điều khiển đó biến mất; các lỗi khác giữ nguyên tới lần bấm “Đăng ký” tiếp theo.
- Không còn lỗi thì hiện `Alert` màu xanh “Đã nhận đăng ký của …” kèm dữ liệu dạng JSON. Nút “Làm lại” đưa form (cả dữ liệu và lỗi) về trạng thái ban đầu.
- Kiểm tra định dạng email, số điện thoại, độ mạnh mật khẩu và báo lỗi ngay khi rời ô sẽ làm ở Bài 5.

Cập nhật `src/data/registerConfig.js`: thêm ô “Nhập lại mật khẩu” sau ô mật khẩu và export thêm `initialValues`:

```js
// thêm vào mảng fields, ngay sau password
{ id: 'confirmPassword', label: 'Nhập lại mật khẩu', type: 'password', required: true },

export const initialValues = {
  fullName: '', email: '', password: '', confirmPassword: '',
  phone: '', birthday: '', gender: 'Nam', major: '', agree: false,
};
```

**Các bước làm**

1. Nâng cấp `InputField` (ES6.md Bài 6) nhận thêm prop `error`: thêm `isInvalid={Boolean(error)}` vào `Form.Control`, đặt `<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>` ngay sau nó và chỉ hiện `helpText` khi không có lỗi. Các chỗ đang dùng `InputField` không bị ảnh hưởng vì `error` mặc định là `undefined`.
2. Mở `src/components/RegisterForm.jsx`, import `useState`, `Alert` và `initialValues`.
3. Khai báo 3 state: `values` (`initialValues`), `errors` (`{}`), `submitted` (`null`).
4. Viết `handleChange` dùng destructuring `const { name, value, type, checked } = e.target;` rồi `setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))`. Thêm `setErrors((prev) => ({ ...prev, [name]: undefined }))` để ẩn lỗi của ô vừa sửa.
5. Với các ô sinh từ `fields`, truyền thêm `name={field.id}`, `value={values[field.id]}`, `onChange={handleChange}`, `error={errors[field.id]}`. Nhờ `...inputProps` trong `InputField` các prop này tự đi xuống `Form.Control`.
6. Radio giới tính: thêm `name="gender"`, `value={gender}`, `checked={values.gender === gender}`, `onChange={handleChange}` (luôn có giá trị mặc định “Nam” nên không cần báo lỗi).
7. Select chuyên ngành: `name="major"`, `value={values.major}`, `onChange={handleChange}`, `isInvalid={Boolean(errors.major)}`, và ngay sau `Form.Select` đặt `<Form.Control.Feedback type="invalid">{errors.major}</Form.Control.Feedback>`.
8. Checkbox: `name="agree"`, `checked={values.agree}`, `isInvalid={Boolean(errors.agree)}`, `feedback={errors.agree}`, `feedbackType="invalid"` (với `Form.Check`, thông báo được truyền qua prop `feedback`).
9. Viết hàm `validate(values)` ở ngoài component, trả về object lỗi theo bảng trên. Có thể khai báo object `REQUIRED_MESSAGES` (tên ô → thông báo) rồi duyệt bằng `Object.entries(...).forEach(...)` để không lặp nhiều `if`.
10. `handleSubmit(e)`: gọi `e.preventDefault()`, tính `const newErrors = validate(values);`, gọi `setErrors(newErrors)`. Nếu `Object.keys(newErrors).length > 0` thì dừng; ngược lại `setSubmitted(values)`.
11. Thêm `noValidate` vào `<Form>`. Thử bỏ `noValidate` để thấy bong bóng mặc định của trình duyệt che mất thông báo của bạn, rồi thêm lại.
12. `handleReset`: đặt lại `values`, `errors`, `submitted`. Đặt nút “Làm lại” cạnh nút “Đăng ký”.
13. Hiện kết quả: `{submitted && <Alert variant="success">...<pre>{JSON.stringify(submitted, null, 2)}</pre></Alert>}`.

**Tiêu chí hoàn thành**

- [ ] Chỉ có **một** hàm `handleChange` cho mọi loại ô.
- [ ] Bấm “Đăng ký” khi form trống: **không** có bong bóng thông báo của trình duyệt; 6 điều khiển viền đỏ với 6 dòng chữ đỏ như bảng trên.
- [ ] Gõ họ tên thì chỉ lỗi họ tên biến mất (còn 5 lỗi).
- [ ] Nhập lại mật khẩu khác mật khẩu rồi bấm “Đăng ký”: báo “Mật khẩu nhập lại không khớp”.
- [ ] Điền đủ, chọn “Nữ”, chọn chuyên ngành, tích đồng ý rồi bấm “Đăng ký”: không còn lỗi, JSON hiển thị đúng `"gender": "Nữ"`, `"agree": true`.
- [ ] Trang không tải lại khi submit; “Làm lại” xóa sạch dữ liệu, lỗi và ẩn `Alert`.
- [ ] Console không có cảnh báo controlled/uncontrolled.

## Bài 5: Form đăng ký có validation (`errors`, `touched`, `onBlur`, Regex)

**Mục tiêu:** tách hàm kiểm tra lỗi thành hàm thuần, chỉ báo lỗi ở ô đã chạm, hiển thị lỗi bằng `isInvalid` và `Form.Control.Feedback`, chặn submit khi còn lỗi.

**Yêu cầu:** tạo `ValidatedRegisterForm` (dựa trên Bài 4) với các quy tắc:

| Ô | Quy tắc | Thông báo |
| --- | --- | --- |
| Họ tên | Bắt buộc, ít nhất 3 ký tự | “Vui lòng nhập họ tên” / “Họ tên phải có ít nhất 3 ký tự” |
| Email | Bắt buộc, đúng định dạng | “Vui lòng nhập email” / “Email không đúng định dạng” |
| Mật khẩu | Bắt buộc, ≥ 8 ký tự, có cả chữ và số | “Mật khẩu phải có ít nhất 8 ký tự” / “Mật khẩu phải có cả chữ và số” |
| Nhập lại mật khẩu | Phải trùng mật khẩu | “Mật khẩu nhập lại không khớp” |
| Số điện thoại | Không bắt buộc; nếu nhập thì 10 số, bắt đầu bằng 0 | “Số điện thoại gồm 10 số, bắt đầu bằng 0” |
| Ngày sinh | Không bắt buộc; nếu nhập thì từ 16 tuổi | “Bạn phải từ 16 tuổi trở lên” |
| Chuyên ngành | Bắt buộc | “Vui lòng chọn chuyên ngành” |
| Đồng ý điều khoản | Phải tích | “Bạn cần đồng ý điều khoản” |

Đăng ký thành công thì hiện `Alert` “Đăng ký thành công! Chào mừng …” và xóa form.

**Các bước làm**

1. Dùng lại `InputField` đã nâng cấp ở Bài 4 (có prop `error`, hiển thị `Form.Control.Feedback`).
2. Tạo `src/utils/validateRegister.js` export hàm `validateRegister(values)` trả về object `errors`. Viết lần lượt từng quy tắc bằng `if / else if` như bảng trên.
3. Tạo `src/components/ValidatedRegisterForm.jsx`: chép từ Bài 4, **bỏ** state `errors` và hàm `validate` cũ (lỗi sẽ được tính trực tiếp từ `values`), thêm state `touched` (`{}`) và `success` (`''`).
4. Tính `const errors = validateRegister(values);` và `const isValid = Object.keys(errors).length === 0;` ngay trong phần thân component (dữ liệu dẫn xuất, không lưu state).
5. Viết `handleBlur` đánh dấu `touched[name] = true` và hàm tiện ích `showError(name)` trả về `errors[name]` chỉ khi ô đó đã touched.
6. Truyền `onBlur={handleBlur}` và `error={showError(field.id)}` cho mỗi `InputField`. Select chuyên ngành dùng `isInvalid` + `Form.Control.Feedback`. Checkbox dùng `isInvalid`, `feedback`, `feedbackType="invalid"`.
7. Thêm `noValidate` vào `<Form>` để tắt bong bóng thông báo của trình duyệt.
8. `handleSubmit`: `preventDefault()`, dùng `reduce` tạo object đánh dấu mọi trường là touched rồi `setTouched(...)`. Nếu `!isValid` thì `return`. Ngược lại set thông báo thành công, reset `values` và `touched`.
9. Dưới nút hiện dòng trạng thái: `` isValid ? 'Thông tin hợp lệ' : `Còn ${Object.keys(errors).length} mục chưa hợp lệ` ``.

**Tiêu chí hoàn thành**

- [ ] Mở form không có ô nào đỏ; rời ô Email khi còn trống thì chỉ ô Email báo lỗi.
- [ ] Bấm “Đăng ký” khi form trống hiện 6 lỗi và dòng “Còn 6 mục chưa hợp lệ”.
- [ ] Nhập `123` vào số điện thoại thì báo lỗi; xóa trống thì hết lỗi (vì không bắt buộc).
- [ ] Mật khẩu `abcdefgh` báo “phải có cả chữ và số”; nhập lại khác mật khẩu báo “không khớp”.
- [ ] Điền đúng tất cả thì hiện thông báo thành công và form trở về trống.

## Bài 6: Todo list (state dạng mảng, thêm/sửa/xóa bất biến, sự kiện bàn phím)

**Mục tiêu:** thao tác mảng trong state mà không làm thay đổi mảng cũ, kết hợp validation nhỏ khi thêm và sửa, dùng `onKeyDown`, `onDoubleClick`, `onBlur`.

**Yêu cầu:** tạo `TodoList` trong một `Card`:

- Ô nhập + nút “Thêm” (nhấn Enter cũng thêm). Không cho thêm nội dung rỗng, dài quá 60 ký tự hoặc trùng (không phân biệt hoa thường); báo lỗi ngay dưới ô.
- Mỗi dòng có checkbox hoàn thành (gạch ngang chữ khi xong) và nút “Xóa”. Nhấp đúp vào chữ để sửa: Enter lưu, Esc hủy, rời ô cũng lưu; nội dung sửa không hợp lệ thì ô đỏ và không lưu.
- Bộ lọc “Tất cả / Chưa xong / Đã xong”, dòng “Còn N việc chưa xong” và nút “Xóa việc đã xong” (chỉ hiện khi có việc đã xong).

Dữ liệu ban đầu:

```js
const initialTodos = [
  { id: 1, title: 'Ôn lại ES6', done: true },
  { id: 2, title: 'Làm bài tập useState', done: false },
];
```

**Các bước làm**

1. Tạo `src/components/TodoList.jsx` với các state: `todos`, `title`, `error`, `filter` (`'all'`), `editingId` (`null`), `editText` (`''`).
2. Viết `validateTitle(text, ignoreId)` trả về chuỗi lỗi hoặc `''`. Kiểm tra trùng bằng `todos.some(...)`, bỏ qua chính phần tử đang sửa nhờ `ignoreId`.
3. `handleAdd(e)`: `preventDefault()`, kiểm tra lỗi; hợp lệ thì `setTodos((prev) => [...prev, { id: Date.now(), title: title.trim(), done: false }])`, xóa ô và lỗi.
4. Gắn form: `<Form noValidate onSubmit={handleAdd}>` để cả nút “Thêm” lẫn phím Enter đều gọi `handleAdd`. Khi gõ lại thì xóa thông báo lỗi.
5. `toggleTodo(id)` dùng `map` + spread; `deleteTodo(id)` dùng `filter`. Truyền tham số bằng arrow function: `onClick={() => deleteTodo(todo.id)}`.
6. Sửa: `onDoubleClick={() => startEdit(todo)}` lưu `editingId` và `editText`. Khi `editingId === todo.id`, hiển thị `Form.Control autoFocus` thay cho chữ. `onKeyDown` xử lý Enter/Escape, `onBlur={saveEdit}`.
7. Tính dữ liệu dẫn xuất: `visibleTodos` theo `filter` và `remaining` bằng `filter(...).length`.
8. Bộ lọc: dùng `Object.entries(FILTERS).map(([key, label]) => ...)` sinh 3 nút.
9. Nút “Xóa việc đã xong” chỉ hiện khi `todos.some((t) => t.done)`.

**Tiêu chí hoàn thành**

- [ ] Bấm “Thêm” khi ô trống báo “Nội dung không được để trống”; thêm “ôn lại es6” báo trùng.
- [ ] Thêm được bằng cả nút và phím Enter; số “Còn N việc chưa xong” cập nhật đúng.
- [ ] Nhấp đúp để sửa, Enter lưu, Esc hủy.
- [ ] Không có dòng code nào gọi `push`, `splice` hay gán trực tiếp `todo.done = ...`.

## Bài 7: Giỏ hàng với `useReducer`

**Mục tiêu:** chuyển logic cập nhật giỏ hàng ra một reducer thuần, dùng `dispatch` với action có `type`/`payload`, tính tổng bằng selector.

**Yêu cầu:** trang `CartDemoPage` chia 2 cột: bên trái là lưới sản phẩm (bấm “Thêm vào giỏ”), bên phải là bảng giỏ hàng với nút `−`/`+`/“Xóa”, dòng tổng cộng và nút “Xóa toàn bộ giỏ”. Tiêu đề “Giỏ hàng” có `Badge` tổng số lượng. Quy tắc:

- Thêm sản phẩm đã có thì tăng số lượng, không tạo dòng mới. Giá lưu vào giỏ là giá **sau giảm**.
- Số lượng tối đa 10 cho mỗi sản phẩm; giảm về 0 thì tự xóa dòng.
- Giỏ trống thì hiện `Alert` “Giỏ hàng đang trống”.

**Các bước làm**

1. Tạo `src/reducers/cartReducer.js`. Export hằng `MAX_QUANTITY = 10`, object `CART_ACTIONS` (`ADD`, `INCREASE`, `DECREASE`, `REMOVE`, `CLEAR`) và `initialCart = { items: [] }`.
2. Viết `cartReducer(state, action)` bằng `switch (action.type)`:
    - `ADD`: `payload` là sản phẩm. Tìm bằng `find`; có rồi thì `map` tăng `quantity` (kẹp `MAX_QUANTITY`), chưa có thì thêm `{ id, name, price: getFinalPrice(product), quantity: 1 }`.
    - `INCREASE` / `DECREASE`: `payload` là `id`. `DECREASE` dùng `map` rồi `filter((item) => item.quantity > 0)`.
    - `REMOVE`: `filter` theo `id`. `CLEAR`: trả về `initialCart`.
    - `default`: `throw new Error(...)` để phát hiện gõ sai tên action.
3. Export selector `getCartTotals(state)` trả về `{ totalQuantity, totalPrice }` dùng `reduce`.
4. Tạo `src/components/CartSummary.jsx` nhận `cart` và `dispatch`. Mỗi nút gọi `dispatch({ type: CART_ACTIONS.INCREASE, payload: id })`...
5. Tạo `src/pages/CartDemoPage.jsx`: `const [cart, dispatch] = useReducer(cartReducer, initialCart);`, viết `handleAddToCart` dispatch `ADD` và truyền vào `ProductList onAddToCart={handleAddToCart}`.
6. Thử viết một action sai tên như `dispatch({ type: 'cart/ad' })` để xem lỗi, sau đó xóa đi.
7. So sánh: nếu làm bằng `useState` thì logic thêm/tăng/giảm nằm rải rác trong component; với `useReducer` toàn bộ nằm trong một hàm có thể đọc và kiểm thử riêng.

**Tiêu chí hoàn thành**

- [ ] Bấm “Thêm vào giỏ” ở Tai nghe 2 lần và Màn hình 1 lần: giỏ có 2 dòng, tổng số lượng 3, tổng tiền 4.028.500 ₫ (531.000 × 2 + 2.966.500).
- [ ] Bấm `−` ở dòng có số lượng 1 thì dòng đó biến mất.
- [ ] Nút `+` bị mờ khi số lượng đạt 10.
- [ ] Reducer không gọi `setState`, không sửa `state` cũ, không có `console.log` hay tác dụng phụ.

## Bài 8: Form đăng nhập với `useReducer` (validation + trạng thái gửi)

**Mục tiêu:** quản lý form nhiều phần (giá trị, lỗi, touched, trạng thái gửi, thông báo) bằng một reducer; xử lý submit bất đồng bộ trong hàm sự kiện rồi `dispatch` kết quả.

**Yêu cầu:** tạo `LoginForm` gồm Email, Mật khẩu, checkbox “Ghi nhớ đăng nhập”, nút “Đăng nhập”. Quy tắc: email bắt buộc và đúng định dạng; mật khẩu bắt buộc, ít nhất 8 ký tự. Khi gửi:

- Nút chuyển thành `Spinner` + “Đang đăng nhập...”, các ô bị khóa.
- Giả lập API mất 1 giây. Tài khoản đúng: `admin@fpt.edu.vn` / `12345678` thì hiện “Xin chào admin@fpt.edu.vn!” và nút “Đăng nhập lại”; sai thì hiện `Alert` đỏ “Email hoặc mật khẩu không đúng”.
- Component nhận prop `onLoginSuccess` (gọi khi thành công, dùng ở Bài 9, 10).

**Các bước làm**

1. Tạo `src/reducers/loginReducer.js` export `validateLogin(values)`, `initialLoginState` và `loginReducer`.
2. `initialLoginState = { values: { email: '', password: '', remember: false }, errors: {}, touched: {}, status: 'idle', message: '' }`. `status` nhận một trong `'idle' | 'submitting' | 'success' | 'error'`.
3. Viết các action: `CHANGE_FIELD` (cập nhật `values[name]`, tính lại `errors`, xóa thông báo lỗi cũ), `BLUR_FIELD`, `SUBMIT` (tính lỗi, đánh dấu touched; không lỗi thì `status: 'submitting'`), `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `RESET`.
4. Trong `LoginForm.jsx` viết hàm `fakeLoginApi` trả về `Promise` dùng `setTimeout` 1 giây. Hàm này **nằm ngoài reducer** vì có tác dụng phụ.
5. `handleSubmit` là hàm `async`: `preventDefault()`, `dispatch({ type: 'SUBMIT' })`, tự kiểm tra lại `validateLogin(values)` (vì `state` chưa đổi ngay sau `dispatch`), rồi `try { await fakeLoginApi(values); dispatch(SUCCESS) } catch { dispatch(FAILURE) }`.
6. Hiển thị lỗi: `isInvalid={touched.email && Boolean(errors.email)}` và `isValid` cho ô email hợp lệ (viền xanh).
7. Dùng `disabled={isSubmitting}` cho mọi ô và nút; nội dung nút đổi bằng toán tử 3 ngôi.
8. Khi `status === 'success'` trả về sớm một `Alert` (lưu ý: đặt `return` sớm **sau** khi đã gọi `useReducer`).

**Tiêu chí hoàn thành**

- [ ] Bấm “Đăng nhập” khi trống hiện 2 lỗi dưới 2 ô.
- [ ] Nhập sai mật khẩu: nút hiện “Đang đăng nhập...” khoảng 1 giây rồi hiện `Alert` đỏ; sửa ô mật khẩu thì `Alert` đỏ biến mất.
- [ ] Nhập đúng tài khoản thử thì hiện lời chào; “Đăng nhập lại” đưa form về ban đầu.
- [ ] `loginReducer` không chứa `setTimeout`, `await` hay gọi API.

## Bài 9: Theme sáng/tối và đăng nhập với `useContext`

**Mục tiêu:** tránh truyền props qua nhiều cấp bằng Context, viết Provider và custom hook, dùng nhiều context cùng lúc.

**Yêu cầu:**

- `ThemeContext` giữ `theme` (`'light'`/`'dark'`) và `toggleTheme`. `Layout` gắn `data-bs-theme={theme}` để Bootstrap 5.3 tự đổi màu toàn trang. `Header` có nút “🌙 Tối” / “☀️ Sáng”.
- `AuthContext` giữ `user` (`null` hoặc `{ email, name }`), `isLoggedIn`, `login(email)`, `logout()`. `Header` hiện “Xin chào, {name}” và nút “Đăng xuất” khi đã đăng nhập, ngược lại hiện “Chưa đăng nhập”.
- Trang chủ: chưa đăng nhập thì hiện `LoginForm` của Bài 8; đăng nhập thành công gọi `login` của context.

**Các bước làm**

1. Tạo `src/context/ThemeContext.jsx`: `createContext(null)`, component `ThemeProvider` giữ `useState('light')` và `toggleTheme`, custom hook `useTheme` ném lỗi khi dùng ngoài Provider.
2. Tạo `src/context/AuthContext.jsx` tương tự: `login(email)` lưu `{ email, name: email.split('@')[0] }`; `isLoggedIn` là dữ liệu dẫn xuất `user !== null`.
3. Sửa `Header` (ES6.md Bài 9): gọi `useTheme()` và `useAuth()` ngay trong Header; màu Navbar đổi theo theme; phần bên phải dùng toán tử 3 ngôi theo `isLoggedIn`.
4. Sửa `Layout`: bọc toàn bộ trong `<div data-bs-theme={theme} className="bg-body text-body min-vh-100">`.
5. Trong `App.jsx` bọc theo thứ tự `<ThemeProvider><AuthProvider><Layout>...</Layout></AuthProvider></ThemeProvider>`.
6. Tạo component `HomeContent` **bên trong** các Provider, gọi `useAuth()` và truyền `login` vào `<LoginForm onLoginSuccess={login} />`.
7. Thử gọi `useAuth()` trực tiếp trong `App` (nằm ngoài `AuthProvider`) để thấy thông báo lỗi của custom hook, sau đó sửa lại.
8. Đếm lại: `Header` không nhận prop nào về theme hay user. Đây là lợi ích chính của Context.

**Tiêu chí hoàn thành**

- [ ] Bấm “🌙 Tối” thì Navbar, nền trang, Card, ô nhập đều chuyển tối; bấm lại chuyển sáng.
- [ ] Đăng nhập `admin@fpt.edu.vn` / `12345678` thì Header hiện “Xin chào, admin”, trang chủ đổi nội dung; “Đăng xuất” quay về form đăng nhập.
- [ ] `Header` và `Layout` không nhận prop `theme`, `user` hay hàm `login`.
- [ ] Custom hook báo lỗi rõ ràng khi dùng ngoài Provider.

## Bài 10: Cửa hàng mini có giỏ hàng và thanh toán (tổng hợp)

**Mục tiêu:** ghép `useState`, `useReducer`, `useContext`, xử lý sự kiện và validation thành một ứng dụng hoàn chỉnh; đây là phiên bản “có tương tác” của trang Cửa hàng mini ở ES6.md Bài 10.

**Yêu cầu:**

```
+------------------------------------------------------------------+
| FPT Shop Mini | Cửa hàng | Giỏ hàng [2] | Thanh toán | 🌙 | Đăng nhập |
+------------------------------------------------------------------+
| Trang "Cửa hàng":   bộ lọc Bài 3 + lưới sản phẩm, Toast khi thêm  |
| Trang "Giỏ hàng":   bảng Bài 7 + nút "Tiến hành thanh toán"       |
| Trang "Thanh toán": form giao hàng có validation + tóm tắt đơn     |
| Trang "Đăng nhập":  LoginForm Bài 8                                |
+------------------------------------------------------------------+
```

- `CartContext` = `useReducer(cartReducer)` của Bài 7 + Provider. Badge trên menu “Giỏ hàng” lấy tổng số lượng từ context.
- Chuyển trang bằng state `page` trong `App` (chưa dùng React Router); menu nào đang mở thì `active`.
- Form thanh toán: Người nhận (≥ 3 ký tự, tự điền tên nếu đã đăng nhập), Số điện thoại (10 số, bắt đầu bằng 0), Địa chỉ (≥ 10 ký tự), Phương thức thanh toán (radio COD / Chuyển khoản / Ví điện tử, bắt buộc), Ghi chú (không bắt buộc). Lỗi chỉ hiện sau lần bấm “Đặt hàng” đầu tiên và tự mất khi sửa đúng.
- Phí giao hàng 30.000 ₫, miễn phí khi tiền hàng từ 1.000.000 ₫.
- Đặt hàng thành công: hiện mã đơn `DHxxxxxx`, người nhận, tổng thanh toán; xóa giỏ; nút “Tiếp tục mua sắm”.

**Các bước làm**

1. Tạo `src/context/CartContext.jsx`: trong `CartProvider` gọi `useReducer(cartReducer, initialCart)`, tạo `value` gồm `cart`, `dispatch`, `...getCartTotals(cart)`, `addToCart`, `clearCart`. Viết custom hook `useCart`.
2. Nâng cấp `Header` của Bài 9: nhận `currentPage`, `onNavigate`; `menuItems` gồm `shop`, `cart`, `checkout`; mỗi `Nav.Link` có `onClick` gọi `e.preventDefault()` rồi `onNavigate(key)`; hiện `Badge` khi `totalQuantity > 0`; nút “Đăng nhập” gọi `onNavigate('login')`.
3. `Layout` nhận thêm `currentPage`, `onNavigate` và chuyển cho `Header`.
4. `src/pages/ShopPage.jsx`: dùng `ProductFilter` (Bài 3), `handleAddToCart` gọi `addToCart` của context và bật `Toast` “Đã thêm … vào giỏ” (state `toastMessage`, `autohide`, `delay={2000}`).
5. `src/pages/CartPage.jsx`: lấy `cart`, `dispatch` từ `useCart()` rồi truyền vào `CartSummary` (Bài 7), không cần sửa `CartSummary`.
6. `src/pages/CheckoutPage.jsx`:
    - State `values` khởi tạo `receiver: user?.name ?? ''` (lấy từ `useAuth()`), state `submitted` và `order`.
    - Hàm `validateCheckout(values)` và `errors` tính mỗi lần render; `errorOf(name)` chỉ trả lỗi khi `submitted`.
    - Dùng `InputField` (bản Bài 5) cho các ô; ô Địa chỉ truyền `as="textarea" rows={2}`.
    - `handleSubmit`: `preventDefault()`, `setSubmitted(true)`, có lỗi thì dừng; không lỗi thì tạo `order`, gọi `clearCart()`.
    - Thứ tự `return` sớm: đã có `order` → màn hình thành công; giỏ trống → `Alert` quay lại cửa hàng; còn lại → form + tóm tắt đơn.
7. `src/App.jsx`: bọc `ThemeProvider > AuthProvider > CartProvider > AppContent`. `AppContent` giữ `const [page, setPage] = useState('shop')` và hiển thị trang tương ứng bằng `&&`. Đăng nhập thành công thì `login(email)` và chuyển về `shop`.

**Tiêu chí hoàn thành**

- [ ] Thêm Tai nghe và Webcam: Badge menu hiện 2, Toast hiện rồi tự tắt sau 2 giây.
- [ ] Trang thanh toán: bấm “Đặt hàng” khi trống hiện 4 lỗi; tóm tắt đơn với 2 sản phẩm trên ghi “Phí giao hàng: Miễn phí”, tổng 1.311.000 ₫. Chỉ mua Chuột không dây thì tổng là 280.000 ₫ (có phí 30.000 ₫).
- [ ] Đặt hàng thành công thì Badge biến mất, trang Giỏ hàng báo trống.
- [ ] Đăng nhập trước rồi vào Thanh toán thì ô Người nhận tự điền “admin”.
- [ ] Chế độ tối áp dụng cho mọi trang; Console không có lỗi hay cảnh báo.
- [ ] Không có prop nào chỉ để “chuyển tiếp” dữ liệu giỏ hàng, theme hay user qua component trung gian.

## Đáp án mẫu bài 1 đến 5

Chỉ mở phần này sau khi đã tự làm. Toàn bộ code đã được build và chạy thử trên trình duyệt (Vite, React 19, React-Bootstrap 2), kiểm tra lại từng tiêu chí hoàn thành và không có lỗi hay cảnh báo trong Console. Cách viết có thể khác đáp án miễn là kết quả đúng.

### Đáp án Bài 1

**Phần 1**

`src/components/QuantityPicker.jsx`

```jsx
import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const QuantityPicker = ({ min = 1, max = 10 }) => {
  const [quantity, setQuantity] = useState(min);

  const decrease = () => setQuantity((q) => Math.max(q - 1, min));
  const increase = () => setQuantity((q) => Math.min(q + 1, max));

  // Sai: 3 lần đều đọc cùng một giá trị quantity cũ → chỉ tăng 1
  const addThreeWrong = () => {
    setQuantity(Math.min(quantity + 1, max));
    setQuantity(Math.min(quantity + 1, max));
    setQuantity(Math.min(quantity + 1, max));
  };

  // Đúng: functional update, mỗi lần nhận giá trị mới nhất
  const addThree = () => {
    increase();
    increase();
    increase();
  };

  return (
    <div className="d-flex align-items-center gap-3 flex-wrap">
      <ButtonGroup>
        <Button variant="outline-secondary" onClick={decrease} disabled={quantity <= min}>
          −
        </Button>
        <Button variant="light" disabled style={{ minWidth: 56 }}>
          {quantity}
        </Button>
        <Button variant="outline-secondary" onClick={increase} disabled={quantity >= max}>
          +
        </Button>
      </ButtonGroup>
      <Button size="sm" variant="outline-danger" onClick={addThreeWrong}>+3 (sai)</Button>
      <Button size="sm" variant="outline-success" onClick={addThree}>+3 (đúng)</Button>
      <Button size="sm" variant="link" onClick={() => setQuantity(min)}>Đặt lại</Button>
      {quantity === max && <small className="text-danger">Tối đa {max} sản phẩm</small>}
    </div>
  );
};

export default QuantityPicker;
```

**Phần 2**

`src/data/cart.js`

```js
export const cartItems = [
  { id: 1, name: 'Tai nghe Bluetooth', price: 590000, quantity: 2 },
  { id: 4, name: 'Màn hình 24 inch', price: 3490000, quantity: 1 },
  { id: 2, name: 'Chuột không dây', price: 250000, quantity: 3 },
  { id: 8, name: 'USB 64GB', price: 150000, quantity: 5 },
];
```

`src/components/MiniCart.jsx`

```jsx
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { cartItems } from '../data/cart';
import { formatVND } from '../utils/format';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

const MiniCart = () => {
  // State là một MẢNG object: mỗi phần tử là một dòng giỏ hàng
  const [items, setItems] = useState(cartItems);

  // delta = +1 (tăng) hoặc -1 (giảm); kẹp số lượng trong khoảng 1..10
  const changeQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, item.quantity + delta)),
            }
          : item,
      ),
    );
  };

  // Dữ liệu dẫn xuất: tính lại mỗi lần render, không lưu vào state
  const totalQuantity = items.reduce((sum, { quantity }) => sum + quantity, 0);
  const totalPrice = items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);

  return (
    <Table bordered hover className="align-middle">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Đơn giá</th>
          <th className="text-center">Số lượng</th>
          <th className="text-end">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ id, name, price, quantity }) => (
          <tr key={id}>
            <td>{name}</td>
            <td>{formatVND(price)}</td>
            <td className="text-center">
              <ButtonGroup size="sm">
                <Button
                  variant="outline-secondary"
                  aria-label={`Giảm ${name}`}
                  disabled={quantity <= MIN_QUANTITY}
                  onClick={() => changeQuantity(id, -1)}
                >
                  −
                </Button>
                <Button variant="light" disabled style={{ minWidth: 44 }}>
                  {quantity}
                </Button>
                <Button
                  variant="outline-secondary"
                  aria-label={`Tăng ${name}`}
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => changeQuantity(id, 1)}
                >
                  +
                </Button>
              </ButtonGroup>
            </td>
            <td className="text-end">{formatVND(price * quantity)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td colSpan={2}>Tổng cộng</td>
          <td className="text-center">{totalQuantity}</td>
          <td className="text-end">{formatVND(totalPrice)}</td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default MiniCart;
```

`src/App.jsx`

```jsx
import QuantityPicker from './components/QuantityPicker';
import MiniCart from './components/MiniCart';

const App = () => (
  <div className="container my-4">
    <h5>Phần 1. Bộ chọn số lượng</h5>
    <div className="d-flex flex-column gap-3 mb-4">
      <QuantityPicker />
      <QuantityPicker min={2} max={5} />
    </div>

    <h5>Phần 2. Giỏ hàng mini</h5>
    <MiniCart />
  </div>
);

export default App;
```

Điểm cần nhớ: `setQuantity(quantity + 1)` gọi 3 lần đều đọc cùng giá trị `quantity` của lần render hiện tại nên chỉ tăng 1; `setQuantity((q) => q + 1)` nhận giá trị mới nhất ở mỗi lần gọi nên tăng đúng 3. Với state là mảng, không sửa `item.quantity` trực tiếp mà tạo mảng mới bằng `map` và object mới bằng `{ ...item, quantity }`, khi đó React mới nhận ra thay đổi. Tổng số lượng và tổng tiền tính bằng `reduce` mỗi lần render nên luôn khớp với bảng. Bài 7 sẽ làm lại giỏ hàng này bằng `useReducer` và thêm chức năng thêm/xóa sản phẩm.

### Đáp án Bài 2

`src/components/ProfilePreview.jsx`

```jsx
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const MAX_BIO = 150;
const majors = ['Software Engineering', 'Artificial Intelligence', 'Digital Marketing'];

const ProfilePreview = () => {
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState(majors[0]);
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const handleNameKeyDown = (event) => {
    if (event.key === 'Escape') setFullName('');
  };

  const handleBioChange = (event) => {
    // Cắt bớt thay vì bỏ qua, để dán đoạn dài vẫn nhận 150 ký tự đầu
    setBio(event.target.value.slice(0, MAX_BIO));
  };

  const remaining = MAX_BIO - bio.length;

  return (
    <Row className="g-4">
      <Col md={6}>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="pp-name">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              value={fullName}
              placeholder="Nhấn Esc để xóa"
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              onFocus={() => setFocused('fullName')}
              onBlur={() => setFocused('')}
              className={focused === 'fullName' ? 'border-primary border-2' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pp-major">
            <Form.Label>Chuyên ngành</Form.Label>
            <Form.Select value={major} onChange={(e) => setMajor(e.target.value)}>
              {majors.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="pp-bio">
            <Form.Label>Giới thiệu</Form.Label>
            <Form.Control as="textarea" rows={3} value={bio} onChange={handleBioChange} />
            <Form.Text className={remaining < 20 ? 'text-danger' : 'text-muted'}>
              {`Còn ${remaining}/${MAX_BIO} ký tự`}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="pp-password">
            <Form.Label>Mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? 'Ẩn' : 'Hiện'}
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Col>

      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Header>Xem trước</Card.Header>
          <Card.Body>
            <Card.Title>{fullName.trim() || 'Chưa nhập tên'}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{major}</Card.Subtitle>
            <Card.Text>{bio || <em>Chưa có giới thiệu</em>}</Card.Text>
            <small className="text-muted">{`Mật khẩu: ${password.length} ký tự`}</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePreview;
```

Điểm cần nhớ: `value` + `onChange` biến ô nhập thành controlled component, nên việc giới hạn 150 ký tự hay xóa bằng phím Esc chỉ là thay đổi state. `e.key` cho biết phím vừa nhấn, `onFocus`/`onBlur` cho biết ô đang có hay vừa mất tiêu điểm (sẽ dùng làm `touched` ở Bài 5).

### Đáp án Bài 3

`src/components/ProductFilter.jsx`

```jsx
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from 'react-bootstrap/Alert';
import ProductList from './ProductList';
import { getFinalPrice } from '../utils/format';

const ALL = 'Tất cả';

const sorters = {
  default: () => 0,
  'price-asc': (a, b) => getFinalPrice(a) - getFinalPrice(b),
  'price-desc': (a, b) => getFinalPrice(b) - getFinalPrice(a),
  rating: (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
};

const ProductFilter = ({ products, onAddToCart }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(ALL);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const categories = [ALL, ...new Set(products.map((p) => p.category?.name ?? 'Khác'))];

  // Dữ liệu dẫn xuất: tính lại mỗi lần render, KHÔNG lưu vào state
  const visibleProducts = products
    .filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    .filter((p) => category === ALL || p.category?.name === category)
    .filter((p) => !onlyInStock || p.inStock)
    .sort(sorters[sortBy]);

  const handleReset = () => {
    setKeyword('');
    setCategory(ALL);
    setOnlyInStock(false);
    setSortBy('default');
  };

  return (
    <>
      <Row className="g-2 align-items-center mb-3">
        <Col md={5}>
          <Form.Control
            placeholder="Tìm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="rating">Đánh giá cao</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Check
            type="switch"
            id="only-in-stock"
            label="Còn hàng"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
          />
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" className="w-100" onClick={handleReset}>
            Xóa lọc
          </Button>
        </Col>
      </Row>

      <ButtonGroup className="mb-3 flex-wrap">
        {categories.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={name === category ? 'primary' : 'outline-primary'}
            onClick={() => setCategory(name)}
          >
            {name}
          </Button>
        ))}
      </ButtonGroup>

      <p className="text-muted">{`Tìm thấy ${visibleProducts.length}/${products.length} sản phẩm`}</p>

      {visibleProducts.length === 0 ? (
        <Alert variant="warning">Không có sản phẩm phù hợp</Alert>
      ) : (
        <ProductList products={visibleProducts} onAddToCart={onAddToCart} />
      )}
    </>
  );
};

export default ProductFilter;
```

`src/App.jsx`

```jsx
import ProductFilter from './components/ProductFilter';
import { products } from './data/products';

const App = () => (
  <div className="container my-4">
    <ProductFilter products={products} />
  </div>
);

export default App;
```

Điểm cần nhớ: chỉ lưu vào state những gì người dùng **chọn** (từ khóa, danh mục, công tắc, kiểu sắp xếp). Danh sách hiển thị và số lượng tìm thấy là dữ liệu dẫn xuất, tính lại mỗi lần render nên luôn khớp với bộ lọc. Object `sorters` thay cho chuỗi `if/else` dài khi chọn hàm so sánh.

### Đáp án Bài 4

`src/data/registerConfig.js`

```js
export const fields = [
  { id: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com', required: true },
  { id: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 8 ký tự', required: true, helpText: 'Dùng cả chữ và số' },
  { id: 'confirmPassword', label: 'Nhập lại mật khẩu', type: 'password', required: true },
  { id: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '09xx xxx xxx' },
  { id: 'birthday', label: 'Ngày sinh', type: 'date' },
];

export const genders = ['Nam', 'Nữ', 'Khác'];
export const majors = ['Software Engineering', 'Artificial Intelligence', 'Digital Marketing'];

export const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthday: '',
  gender: 'Nam',
  major: '',
  agree: false,
};
```

`src/components/InputField.jsx`

```jsx
import Form from 'react-bootstrap/Form';

const InputField = ({ id, label, helpText, error, ...inputProps }) => (
  <Form.Group className="mb-3" controlId={id}>
    <Form.Label>
      {label}
      {inputProps.required && <span className="text-danger"> *</span>}
    </Form.Label>
    <Form.Control {...inputProps} isInvalid={Boolean(error)} />
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    {helpText && !error && <Form.Text muted>{helpText}</Form.Text>}
  </Form.Group>
);

export default InputField;
```

`src/components/RegisterForm.jsx`

```jsx
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputField from './InputField';
import AppButton from './AppButton';
import { fields, genders, majors, initialValues } from '../data/registerConfig';

// Thông báo cho các ô nhập bắt buộc
const REQUIRED_MESSAGES = {
  fullName: 'Vui lòng nhập họ và tên',
  email: 'Vui lòng nhập email',
  password: 'Vui lòng nhập mật khẩu',
  confirmPassword: 'Vui lòng nhập lại mật khẩu',
};

// Kiểm tra dữ liệu khi submit, trả về object lỗi { tênTrường: 'thông báo' }
const validate = (values) => {
  const errors = {};
  Object.entries(REQUIRED_MESSAGES).forEach(([name, message]) => {
    if (!values[name].trim()) errors[name] = message;
  });
  if (values.confirmPassword && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp';
  }
  if (!values.major) errors.major = 'Vui lòng chọn chuyên ngành';
  if (!values.agree) errors.agree = 'Bạn cần đồng ý điều khoản';
  return errors;
};

const RegisterForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  // Một hàm cho mọi ô: dựa vào name + type của phần tử phát sinh sự kiện
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Người dùng đã sửa ô này → ẩn lỗi của riêng ô đó
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitted(null);
      return;
    }
    setSubmitted(values);
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(null);
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Đăng ký tài khoản</Card.Title>
            {/* noValidate: tắt bong bóng thông báo mặc định của trình duyệt */}
            <Form noValidate onSubmit={handleSubmit}>
              {fields.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  name={field.id}
                  value={values[field.id]}
                  onChange={handleChange}
                  error={errors[field.id]}
                />
              ))}

              <Form.Group className="mb-3">
                <Form.Label className="d-block">Giới tính</Form.Label>
                {genders.map((gender) => (
                  <Form.Check
                    inline
                    key={gender}
                    type="radio"
                    name="gender"
                    id={`gender-${gender}`}
                    label={gender}
                    value={gender}
                    checked={values.gender === gender}
                    onChange={handleChange}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-3" controlId="major">
                <Form.Label>
                  Chuyên ngành <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="major"
                  value={values.major}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.major)}
                >
                  <option value="">-- Chọn chuyên ngành --</option>
                  {majors.map((major) => (
                    <option key={major}>{major}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.major}</Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                className="mb-3"
                type="checkbox"
                id="agree"
                name="agree"
                label="Tôi đồng ý điều khoản"
                checked={values.agree}
                onChange={handleChange}
                isInvalid={Boolean(errors.agree)}
                feedback={errors.agree}
                feedbackType="invalid"
              />

              <div className="d-flex gap-2">
                <AppButton type="submit" className="flex-grow-1">Đăng ký</AppButton>
                <AppButton variant="outline-secondary" onClick={handleReset}>Làm lại</AppButton>
              </div>
            </Form>

            {submitted && (
              <Alert variant="success" className="mt-3 mb-0">
                <Alert.Heading as="h6">{`Đã nhận đăng ký của ${submitted.fullName}`}</Alert.Heading>
                <pre className="mb-0 small">{JSON.stringify(submitted, null, 2)}</pre>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterForm;
```

Điểm cần nhớ: `[name]: value` (computed property) cho phép một hàm `handleChange` cập nhật đúng thuộc tính dựa vào `name` của ô. `noValidate` tắt bong bóng mặc định của trình duyệt để form dùng thông báo tự viết. `Form.Control.Feedback type="invalid"` chỉ hiện khi điều khiển đứng ngay trước nó có `isInvalid`; với `Form.Check` thông báo truyền qua prop `feedback`. Ở bài này lỗi được lưu trong state `errors` và chỉ tính lại khi bấm “Đăng ký”; Bài 5 chuyển sang tính lỗi trực tiếp từ `values` và báo ngay khi rời ô.

### Đáp án Bài 5

`InputField.jsx` giữ nguyên như Bài 4.

`src/utils/validateRegister.js`

```js
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

export const validateRegister = (values) => {
  const errors = {};
  const fullName = values.fullName.trim();

  if (!fullName) errors.fullName = 'Vui lòng nhập họ tên';
  else if (fullName.length < 3) errors.fullName = 'Họ tên phải có ít nhất 3 ký tự';

  if (!values.email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Email không đúng định dạng';

  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (values.password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    errors.password = 'Mật khẩu phải có cả chữ và số';

  if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp';

  // Không bắt buộc: chỉ kiểm tra khi người dùng có nhập
  const phone = values.phone.replace(/\s/g, '');
  if (phone && !PHONE_REGEX.test(phone)) errors.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0';

  if (values.birthday) {
    const age = new Date().getFullYear() - new Date(values.birthday).getFullYear();
    if (age < 16) errors.birthday = 'Bạn phải từ 16 tuổi trở lên';
  }

  if (!values.major) errors.major = 'Vui lòng chọn chuyên ngành';
  if (!values.agree) errors.agree = 'Bạn cần đồng ý điều khoản';

  return errors;
};
```

`src/components/ValidatedRegisterForm.jsx`

```jsx
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputField from './InputField';
import AppButton from './AppButton';
import { fields, genders, majors, initialValues } from '../data/registerConfig';
import { validateRegister } from '../utils/validateRegister';

const ValidatedRegisterForm = () => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');

  // errors là dữ liệu dẫn xuất từ values → tính lại mỗi lần render
  const errors = validateRegister(values);
  const isValid = Object.keys(errors).length === 0;
  // Chỉ hiện lỗi của ô đã được chạm (blur) hoặc sau khi bấm submit
  const showError = (name) => (touched[name] ? errors[name] : undefined);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSuccess('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Đánh dấu tất cả là đã chạm để lộ mọi lỗi còn lại
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);
    if (!isValid) return;

    setSuccess(`Đăng ký thành công! Chào mừng ${values.fullName.trim()}.`);
    setValues(initialValues);
    setTouched({});
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Đăng ký tài khoản</Card.Title>
            {success && <Alert variant="success">{success}</Alert>}

            <Form noValidate onSubmit={handleSubmit}>
              {fields.map((field) => (
                <InputField
                  key={field.id}
                  {...field}
                  name={field.id}
                  value={values[field.id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError(field.id)}
                />
              ))}

              <Form.Group className="mb-3">
                <Form.Label className="d-block">Giới tính</Form.Label>
                {genders.map((gender) => (
                  <Form.Check
                    inline
                    key={gender}
                    type="radio"
                    name="gender"
                    id={`v-gender-${gender}`}
                    label={gender}
                    value={gender}
                    checked={values.gender === gender}
                    onChange={handleChange}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-3" controlId="v-major">
                <Form.Label>
                  Chuyên ngành <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="major"
                  value={values.major}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(showError('major'))}
                >
                  <option value="">-- Chọn chuyên ngành --</option>
                  {majors.map((major) => (
                    <option key={major}>{major}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{showError('major')}</Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                className="mb-3"
                type="checkbox"
                id="v-agree"
                name="agree"
                label="Tôi đồng ý điều khoản"
                checked={values.agree}
                onChange={handleChange}
                isInvalid={Boolean(showError('agree'))}
                feedback={showError('agree')}
                feedbackType="invalid"
              />

              <AppButton type="submit" className="w-100">
                Đăng ký
              </AppButton>
              <Form.Text muted className="d-block mt-2">
                {isValid ? 'Thông tin hợp lệ' : `Còn ${Object.keys(errors).length} mục chưa hợp lệ`}
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ValidatedRegisterForm;
```

Điểm cần nhớ: `errors` được tính từ `values` mỗi lần render nên luôn đúng, không cần đồng bộ. `touched` quyết định **khi nào** hiện lỗi, còn `errors` quyết định **lỗi gì**. Khi submit, đánh dấu mọi ô là touched để lộ hết lỗi còn lại. `noValidate` tắt bong bóng mặc định của trình duyệt để chỉ dùng thông báo tự viết.

## Đáp án mẫu bài 6 đến 10

### Đáp án Bài 6

`src/components/TodoList.jsx`

```jsx
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';

const initialTodos = [
  { id: 1, title: 'Ôn lại ES6', done: true },
  { id: 2, title: 'Làm bài tập useState', done: false },
];

const FILTERS = { all: 'Tất cả', active: 'Chưa xong', done: 'Đã xong' };

const TodoList = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const validateTitle = (text, ignoreId = null) => {
    const value = text.trim();
    if (!value) return 'Nội dung không được để trống';
    if (value.length > 60) return 'Tối đa 60 ký tự';
    const duplicated = todos.some(
      (t) => t.id !== ignoreId && t.title.toLowerCase() === value.toLowerCase(),
    );
    return duplicated ? 'Công việc này đã có trong danh sách' : '';
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const message = validateTitle(title);
    if (message) {
      setError(message);
      return;
    }
    setTodos((prev) => [...prev, { id: Date.now(), title: title.trim(), done: false }]);
    setTitle('');
    setError('');
  };

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const startEdit = ({ id, title: current }) => {
    setEditingId(id);
    setEditText(current);
  };

  const saveEdit = () => {
    if (validateTitle(editText, editingId)) return; // giữ ô sửa nếu chưa hợp lệ
    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, title: editText.trim() } : t)),
    );
    setEditingId(null);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') saveEdit();
    if (event.key === 'Escape') setEditingId(null);
  };

  const visibleTodos = todos.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done,
  );
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Card style={{ maxWidth: 520 }}>
      <Card.Body>
        <Card.Title>Việc cần làm</Card.Title>

        <Form noValidate onSubmit={handleAdd} className="mb-3">
          <InputGroup hasValidation>
            <Form.Control
              placeholder="Thêm công việc rồi nhấn Enter"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              isInvalid={Boolean(error)}
            />
            <Button type="submit">Thêm</Button>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </InputGroup>
        </Form>

        <ButtonGroup size="sm" className="mb-3">
          {Object.entries(FILTERS).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? 'dark' : 'outline-dark'}
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <ListGroup>
          {visibleTodos.map((todo) => (
            <ListGroup.Item key={todo.id} className="d-flex align-items-center gap-2">
              <Form.Check
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Hoàn thành ${todo.title}`}
              />
              {editingId === todo.id ? (
                <Form.Control
                  size="sm"
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={saveEdit}
                  isInvalid={Boolean(validateTitle(editText, todo.id))}
                />
              ) : (
                <span
                  className={`flex-grow-1 ${todo.done ? 'text-decoration-line-through text-muted' : ''}`}
                  onDoubleClick={() => startEdit(todo)}
                  title="Nhấp đúp để sửa"
                >
                  {todo.title}
                </span>
              )}
              <Button size="sm" variant="outline-danger" onClick={() => deleteTodo(todo.id)}>
                Xóa
              </Button>
            </ListGroup.Item>
          ))}
          {visibleTodos.length === 0 && (
            <ListGroup.Item className="text-muted">Không có công việc</ListGroup.Item>
          )}
        </ListGroup>

        <div className="d-flex justify-content-between mt-3 small text-muted">
          <span>{`Còn ${remaining} việc chưa xong`}</span>
          {todos.some((t) => t.done) && (
            <Button
              size="sm"
              variant="link"
              className="p-0"
              onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
            >
              Xóa việc đã xong
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodoList;
```

Điểm cần nhớ: thêm dùng `[...prev, item]`, sửa dùng `map` + `{ ...t, done: !t.done }`, xóa dùng `filter`: cả ba đều tạo mảng mới nên React nhận ra thay đổi. `id: Date.now()` đủ dùng cho bài tập; dự án thật nên lấy `id` từ server hoặc `crypto.randomUUID()`.

### Đáp án Bài 7

`src/reducers/cartReducer.js`

```js
import { getFinalPrice } from '../utils/format';

export const MAX_QUANTITY = 10;

export const CART_ACTIONS = {
  ADD: 'cart/add',
  INCREASE: 'cart/increase',
  DECREASE: 'cart/decrease',
  REMOVE: 'cart/remove',
  CLEAR: 'cart/clear',
};

export const initialCart = { items: [] };

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
              : item,
          ),
        };
      }
      const newItem = {
        id: product.id,
        name: product.name,
        price: getFinalPrice(product),
        quantity: 1,
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case CART_ACTIONS.INCREASE:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
            : item,
        ),
      };

    case CART_ACTIONS.DECREASE:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0), // giảm về 0 thì tự xóa
      };

    case CART_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case CART_ACTIONS.CLEAR:
      return initialCart;

    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};

// Selector: tính số liệu từ state, không lưu vào state
export const getCartTotals = ({ items }) => ({
  totalQuantity: items.reduce((sum, { quantity }) => sum + quantity, 0),
  totalPrice: items.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
});
```

`src/components/CartSummary.jsx`

```jsx
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from 'react-bootstrap/Alert';
import { formatVND } from '../utils/format';
import { CART_ACTIONS, MAX_QUANTITY, getCartTotals } from '../reducers/cartReducer';

const CartSummary = ({ cart, dispatch }) => {
  const { items } = cart;
  const { totalQuantity, totalPrice } = getCartTotals(cart);

  if (items.length === 0) return <Alert variant="info">Giỏ hàng đang trống</Alert>;

  return (
    <>
      <Table bordered hover size="sm" className="align-middle">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th className="text-center">Số lượng</th>
            <th>Thành tiền</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, name, price, quantity }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{formatVND(price)}</td>
              <td className="text-center">
                <ButtonGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch({ type: CART_ACTIONS.DECREASE, payload: id })}
                  >
                    −
                  </Button>
                  <Button variant="light" disabled>{quantity}</Button>
                  <Button
                    variant="outline-secondary"
                    disabled={quantity >= MAX_QUANTITY}
                    onClick={() => dispatch({ type: CART_ACTIONS.INCREASE, payload: id })}
                  >
                    +
                  </Button>
                </ButtonGroup>
              </td>
              <td>{formatVND(price * quantity)}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => dispatch({ type: CART_ACTIONS.REMOVE, payload: id })}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="fw-bold">
            <td colSpan={2}>Tổng cộng</td>
            <td className="text-center">{totalQuantity}</td>
            <td colSpan={2}>{formatVND(totalPrice)}</td>
          </tr>
        </tfoot>
      </Table>
      <Button variant="outline-danger" onClick={() => dispatch({ type: CART_ACTIONS.CLEAR })}>
        Xóa toàn bộ giỏ
      </Button>
    </>
  );
};

export default CartSummary;
```

`src/pages/CartDemoPage.jsx`

```jsx
import { useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ProductList from '../components/ProductList';
import CartSummary from '../components/CartSummary';
import { products } from '../data/products';
import { cartReducer, initialCart, CART_ACTIONS, getCartTotals } from '../reducers/cartReducer';

const CartDemoPage = () => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const { totalQuantity } = getCartTotals(cart);

  const handleAddToCart = (product) => dispatch({ type: CART_ACTIONS.ADD, payload: product });

  return (
    <Row className="g-4">
      <Col lg={7}>
        <h4>Sản phẩm</h4>
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </Col>
      <Col lg={5}>
        <h4>
          Giỏ hàng <Badge bg="primary">{totalQuantity}</Badge>
        </h4>
        <CartSummary cart={cart} dispatch={dispatch} />
      </Col>
    </Row>
  );
};

export default CartDemoPage;
```

Điểm cần nhớ: component chỉ mô tả **chuyện gì xảy ra** (`dispatch({ type: ADD, payload: product })`), còn reducer quyết định **state thay đổi thế nào**. Reducer là hàm thuần nên có thể kiểm tra riêng: `cartReducer(initialCart, { type: CART_ACTIONS.ADD, payload: products[0] })` phải trả về giỏ có 1 dòng. Tổng tiền là selector, không lưu trong state.

### Đáp án Bài 8

`src/reducers/loginReducer.js`

```js
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email không đúng định dạng';
  if (!password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  return errors;
};

export const initialLoginState = {
  values: { email: '', password: '', remember: false },
  errors: {},
  touched: {},
  status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
  message: '',
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FIELD': {
      const { name, value } = action.payload;
      const values = { ...state.values, [name]: value };
      return {
        ...state,
        values,
        errors: validateLogin(values),
        status: state.status === 'error' ? 'idle' : state.status,
        message: '',
      };
    }
    case 'BLUR_FIELD':
      return { ...state, touched: { ...state.touched, [action.payload]: true } };

    case 'SUBMIT': {
      const errors = validateLogin(state.values);
      const hasError = Object.keys(errors).length > 0;
      return {
        ...state,
        errors,
        touched: { email: true, password: true },
        status: hasError ? 'idle' : 'submitting',
      };
    }
    case 'LOGIN_SUCCESS':
      return { ...state, status: 'success', message: `Xin chào ${action.payload}!` };

    case 'LOGIN_FAILURE':
      return { ...state, status: 'error', message: action.payload };

    case 'RESET':
      return initialLoginState;

    default:
      return state;
  }
};
```

`src/components/LoginForm.jsx`

```jsx
import { useReducer } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { loginReducer, initialLoginState, validateLogin } from '../reducers/loginReducer';

const DEMO_ACCOUNT = { email: 'admin@fpt.edu.vn', password: '12345678' };

// Giả lập gọi API mất 1 giây
const fakeLoginApi = ({ email, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) resolve(email);
      else reject(new Error('Email hoặc mật khẩu không đúng'));
    }, 1000);
  });

const LoginForm = ({ onLoginSuccess }) => {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const { values, errors, touched, status, message } = state;
  const isSubmitting = status === 'submitting';

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    dispatch({ type: 'CHANGE_FIELD', payload: { name, value: type === 'checkbox' ? checked : value } });
  };

  const handleBlur = (event) => dispatch({ type: 'BLUR_FIELD', payload: event.target.name });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SUBMIT' });
    // state chưa đổi ngay sau dispatch → tự kiểm tra lại bằng values hiện tại
    if (Object.keys(validateLogin(values)).length > 0) return;

    try {
      const email = await fakeLoginApi(values);
      dispatch({ type: 'LOGIN_SUCCESS', payload: email });
      onLoginSuccess?.(email);
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  };

  if (status === 'success') {
    return (
      <Alert variant="success" style={{ maxWidth: 420 }}>
        {message}{' '}
        <Button size="sm" variant="outline-success" onClick={() => dispatch({ type: 'RESET' })}>
          Đăng nhập lại
        </Button>
      </Alert>
    );
  }

  return (
    <Card style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title className="mb-3">Đăng nhập</Card.Title>
        {status === 'error' && <Alert variant="danger">{message}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="login-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.email && Boolean(errors.email)}
              isValid={touched.email && !errors.email}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="login-password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.password && Boolean(errors.password)}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Check
            className="mb-3"
            id="login-remember"
            name="remember"
            label="Ghi nhớ đăng nhập"
            checked={values.remember}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" /> Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>
          <Form.Text muted className="d-block mt-2">
            {`Tài khoản thử: ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password}`}
          </Form.Text>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
```

Điểm cần nhớ: reducer chỉ tính state mới; việc chờ API (`setTimeout`, `await`) nằm trong `handleSubmit`, xong mới `dispatch` kết quả. Một biến `status` thay cho nhiều boolean rời rạc (`isLoading`, `isError`, `isSuccess`) nên không bao giờ rơi vào trạng thái mâu thuẫn như vừa loading vừa success.

### Đáp án Bài 9

`src/context/ThemeContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Tạo context (giá trị mặc định dùng khi quên bọc Provider)
const ThemeContext = createContext(null);

// 2. Provider: giữ state và chia sẻ cho toàn bộ cây con
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// 3. Custom hook: gọn khi dùng và báo lỗi rõ khi quên Provider
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme phải được dùng bên trong <ThemeProvider>');
  return context;
};
```

`src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email) => setUser({ email, name: email.split('@')[0] });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return context;
};
```

`src/components/layout/Header.jsx`

```jsx
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { APP_NAME } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'primary'} variant="dark">
      <Container>
        <Navbar.Brand>{APP_NAME}</Navbar.Brand>
        <div className="d-flex align-items-center gap-2">
          <Button size="sm" variant="outline-light" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
          </Button>
          {isLoggedIn ? (
            <>
              <Navbar.Text className="text-white">{`Xin chào, ${user.name}`}</Navbar.Text>
              <Button size="sm" variant="light" onClick={logout}>Đăng xuất</Button>
            </>
          ) : (
            <Navbar.Text className="text-white-50">Chưa đăng nhập</Navbar.Text>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
```

`src/components/layout/Layout.jsx`

```jsx
import Container from 'react-bootstrap/Container';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children, title = 'Trang chủ' }) => {
  const { theme } = useTheme();

  return (
    <div data-bs-theme={theme} className="bg-body text-body min-vh-100">
      <Header />
      <Container>
        <h2 className="my-4">{title}</h2>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
```

`src/App.jsx`

```jsx
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginForm from './components/LoginForm';

const HomeContent = () => {
  const { isLoggedIn, user, login } = useAuth();
  return isLoggedIn ? (
    <p>{`Bạn đang đăng nhập bằng ${user.email}. Thử bấm nút Tối/Sáng trên Header.`}</p>
  ) : (
    <LoginForm onLoginSuccess={login} />
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Layout title="useContext: Theme và Auth">
        <HomeContent />
      </Layout>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
```

Điểm cần nhớ: `useAuth()` chỉ dùng được bên trong `AuthProvider`, nên phần nội dung trang được tách thành `HomeContent` nằm dưới Provider. `data-bs-theme` là tính năng của Bootstrap 5.3: gắn ở thẻ cha thì mọi component con tự đổi màu. Header lấy dữ liệu trực tiếp từ context, không cần `App → Layout → Header` truyền props.

### Đáp án Bài 10

`ThemeContext.jsx`, `AuthContext.jsx` giữ nguyên như Bài 9; `cartReducer.js`, `CartSummary.jsx` giữ nguyên như Bài 7; `ProductFilter.jsx` như Bài 3; `InputField.jsx` như Bài 4; `LoginForm.jsx` như Bài 8.

`src/context/CartContext.jsx`

```jsx
import { createContext, useContext, useReducer } from 'react';
import { cartReducer, initialCart, CART_ACTIONS, getCartTotals } from '../reducers/cartReducer';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // Đóng gói dispatch thành các hàm có tên rõ nghĩa
  const value = {
    cart,
    dispatch,
    ...getCartTotals(cart),
    addToCart: (product) => dispatch({ type: CART_ACTIONS.ADD, payload: product }),
    clearCart: () => dispatch({ type: CART_ACTIONS.CLEAR }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart phải được dùng bên trong <CartProvider>');
  return context;
};
```

`src/components/layout/Header.jsx`

```jsx
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { APP_NAME } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const menuItems = [
  { key: 'shop', label: 'Cửa hàng' },
  { key: 'cart', label: 'Giỏ hàng' },
  { key: 'checkout', label: 'Thanh toán' },
];

const Header = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const { totalQuantity } = useCart();

  const handleNavClick = (event, key) => {
    event.preventDefault(); // chặn nhảy trang của thẻ <a>
    onNavigate(key);
  };

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'primary'} variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="#" onClick={(e) => handleNavClick(e, 'shop')}>
          {APP_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {menuItems.map(({ key, label }) => (
              <Nav.Link
                key={key}
                href={`#${key}`}
                active={currentPage === key}
                onClick={(e) => handleNavClick(e, key)}
              >
                {label}
                {key === 'cart' && totalQuantity > 0 && (
                  <Badge bg="warning" text="dark" className="ms-1">{totalQuantity}</Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex align-items-center gap-2">
            <Button size="sm" variant="outline-light" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
            </Button>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="text-white">{`Xin chào, ${user.name}`}</Navbar.Text>
                <Button size="sm" variant="light" onClick={logout}>Đăng xuất</Button>
              </>
            ) : (
              <Button size="sm" variant="light" onClick={() => onNavigate('login')}>
                Đăng nhập
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
```

`src/components/layout/Layout.jsx`

```jsx
import Container from 'react-bootstrap/Container';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children, title = 'Trang chủ', currentPage, onNavigate }) => {
  const { theme } = useTheme();

  return (
    <div data-bs-theme={theme} className="bg-body text-body min-vh-100 pb-5">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <Container>
        <h2 className="my-4">{title}</h2>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
```

`src/pages/ShopPage.jsx`

```jsx
import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ProductFilter from '../components/ProductFilter';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`Đã thêm "${product.name}" vào giỏ`);
  };

  return (
    <>
      <ProductFilter products={products} onAddToCart={handleAddToCart} />
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          show={Boolean(toastMessage)}
          onClose={() => setToastMessage('')}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ShopPage;
```

`src/pages/CartPage.jsx`

```jsx
import Button from 'react-bootstrap/Button';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';

const CartPage = ({ onNavigate }) => {
  const { cart, dispatch, totalQuantity } = useCart();

  return (
    <>
      <CartSummary cart={cart} dispatch={dispatch} />
      {totalQuantity > 0 && (
        <div className="text-end">
          <Button variant="success" onClick={() => onNavigate('checkout')}>
            Tiến hành thanh toán
          </Button>
        </div>
      )}
    </>
  );
};

export default CartPage;
```

`src/pages/CheckoutPage.jsx`

```jsx
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputField from '../components/InputField';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatVND } from '../utils/format';

const SHIPPING_FEE = 30000;
const FREE_SHIP_FROM = 1000000;
const PAYMENT_METHODS = ['COD', 'Chuyển khoản', 'Ví điện tử'];

const validateCheckout = ({ receiver, phone, address, payment }) => {
  const errors = {};
  if (receiver.trim().length < 3) errors.receiver = 'Tên người nhận ít nhất 3 ký tự';
  if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0';
  if (address.trim().length < 10) errors.address = 'Địa chỉ quá ngắn (ít nhất 10 ký tự)';
  if (!payment) errors.payment = 'Chọn phương thức thanh toán';
  return errors;
};

const CheckoutPage = ({ onNavigate }) => {
  const { cart, totalPrice, totalQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [values, setValues] = useState({
    receiver: user?.name ?? '',
    phone: '',
    address: '',
    payment: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState(null);

  const errors = validateCheckout(values);
  const hasErrors = Object.keys(errors).length > 0;
  const shipping = totalPrice >= FREE_SHIP_FROM ? 0 : SHIPPING_FEE;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;

    setOrder({
      code: `DH${Date.now().toString().slice(-6)}`,
      receiver: values.receiver.trim(),
      total: totalPrice + shipping,
    });
    clearCart();
  };

  if (order) {
    return (
      <Alert variant="success">
        <Alert.Heading>Đặt hàng thành công!</Alert.Heading>
        <p className="mb-2">
          {`Mã đơn ${order.code} · Người nhận: ${order.receiver} · Tổng thanh toán: ${formatVND(order.total)}`}
        </p>
        <Button variant="outline-success" onClick={() => onNavigate('shop')}>Tiếp tục mua sắm</Button>
      </Alert>
    );
  }

  if (totalQuantity === 0) {
    return (
      <Alert variant="info">
        Giỏ hàng trống.{' '}
        <Alert.Link href="#" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>
          Quay lại cửa hàng
        </Alert.Link>
      </Alert>
    );
  }

  const errorOf = (name) => (submitted ? errors[name] : undefined);

  return (
    <Row className="g-4">
      <Col md={7}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">Thông tin giao hàng</Card.Title>
            <Form noValidate onSubmit={handleSubmit}>
              <InputField id="receiver" name="receiver" label="Người nhận" required
                value={values.receiver} onChange={handleChange} error={errorOf('receiver')} />
              <InputField id="phone" name="phone" label="Số điện thoại" type="tel" required
                value={values.phone} onChange={handleChange} error={errorOf('phone')} />
              <InputField id="address" name="address" label="Địa chỉ" as="textarea" rows={2} required
                value={values.address} onChange={handleChange} error={errorOf('address')} />

              <Form.Group className="mb-3">
                <Form.Label className="d-block">
                  Thanh toán <span className="text-danger">*</span>
                </Form.Label>
                {PAYMENT_METHODS.map((method, index) => (
                  <Form.Check
                    inline
                    key={method}
                    type="radio"
                    id={`payment-${index}`}
                    name="payment"
                    value={method}
                    label={method}
                    checked={values.payment === method}
                    onChange={handleChange}
                    isInvalid={Boolean(errorOf('payment'))}
                  />
                ))}
                {errorOf('payment') && <div className="text-danger small">{errorOf('payment')}</div>}
              </Form.Group>

              <InputField id="note" name="note" label="Ghi chú" placeholder="Không bắt buộc"
                value={values.note} onChange={handleChange} />

              <Button type="submit" variant="success" className="w-100">Đặt hàng</Button>
              {submitted && hasErrors && (
                <Form.Text className="text-danger d-block mt-2">
                  {`Vui lòng sửa ${Object.keys(errors).length} lỗi trước khi đặt hàng`}
                </Form.Text>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col md={5}>
        <Card>
          <Card.Header>{`Đơn hàng (${totalQuantity} sản phẩm)`}</Card.Header>
          <ListGroup variant="flush">
            {cart.items.map(({ id, name, price, quantity }) => (
              <ListGroup.Item key={id} className="d-flex justify-content-between">
                <span>{`${name} × ${quantity}`}</span>
                <span>{formatVND(price * quantity)}</span>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Phí giao hàng</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between fw-bold">
              <span>Tổng thanh toán</span>
              <span>{formatVND(totalPrice + shipping)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CheckoutPage;
```

`src/App.jsx`

```jsx
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginForm from './components/LoginForm';

const TITLES = { shop: 'Cửa hàng', cart: 'Giỏ hàng', checkout: 'Thanh toán', login: 'Đăng nhập' };

const AppContent = () => {
  const [page, setPage] = useState('shop');
  const { login } = useAuth();

  const handleLoginSuccess = (email) => {
    login(email);
    setPage('shop');
  };

  return (
    <Layout title={TITLES[page]} currentPage={page} onNavigate={setPage}>
      {page === 'shop' && <ShopPage />}
      {page === 'cart' && <CartPage onNavigate={setPage} />}
      {page === 'checkout' && <CheckoutPage onNavigate={setPage} />}
      {page === 'login' && <LoginForm onLoginSuccess={handleLoginSuccess} />}
    </Layout>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
```

Điểm cần nhớ: Context + `useReducer` tạo thành kho dữ liệu dùng chung: `ShopPage` thêm hàng, `Header` đọc số lượng, `CheckoutPage` đọc danh sách và xóa giỏ, nhưng không component nào phải truyền giỏ hàng qua props cho component khác. State nào chỉ một trang dùng (bộ lọc, form thanh toán, Toast) vẫn để `useState` cục bộ. Chuyển trang bằng state `page` chỉ là tạm thời; bài sau sẽ thay bằng React Router.

## Checklist tự đánh giá và bước tiếp theo

Nếu trả lời được các câu hỏi dưới đây mà không nhìn tài liệu, bạn đã nắm chắc các hook cơ bản.

| Kiến thức | Luyện ở bài | Câu hỏi tự kiểm tra |
| --- | --- | --- |
| Quy tắc của hook | Tất cả | Vì sao không được gọi `useState` trong `if` hay sau `return` sớm? |
| `useState` và functional update | 1, 6 | Vì sao 3 lần `setCount(count + 1)` chỉ tăng 1? |
| Cập nhật bất biến | 1, 4, 6, 7 | Viết được thêm/sửa/xóa phần tử mảng trong state không dùng `push`/`splice`? |
| Sự kiện | 1, 2, 6, 10 | Khác nhau giữa `onClick={fn}`, `onClick={fn()}` và `onClick={() => fn(id)}`? |
| Controlled component | 2, 4, 5 | Checkbox đọc `value` hay `checked`? Radio controlled viết thế nào? |
| Dữ liệu dẫn xuất | 3, 5, 6, 7 | Vì sao không nên lưu danh sách đã lọc hay tổng tiền vào state? |
| Validation | 4, 5, 6, 8, 10 | Vai trò riêng của `errors` và `touched` là gì? Vì sao cần `noValidate`? |
| `useReducer` | 7, 8, 10 | Những gì **không** được làm trong reducer? Khi nào chọn `useReducer` thay `useState`? |
| `useContext` | 9, 10 | Ba bước tạo và dùng một context? Vì sao nên viết custom hook `useXxx`? |
| Context + Reducer | 10 | Dữ liệu nào nên đưa vào context, dữ liệu nào nên giữ cục bộ? |

**Bước tiếp theo:** học `useEffect` để lấy `products` từ json-server bằng axios (thay file `products.js`) và lưu giỏ hàng vào `localStorage`; `useRef` để tự focus vào ô lỗi đầu tiên khi submit; `useMemo`/`useCallback` để tối ưu danh sách lớn; và React Router để thay state `page` bằng URL thật (`/`, `/cart`, `/checkout`).
