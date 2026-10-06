# useContext trong React — Lý thuyết, Lưu ý & Hướng dẫn Step-by-Step

> Môn: FER202 – ReactJS
> Stack minh hoạ: React 18 + Vite

---

## Mục lục

1. [Vấn đề: Prop Drilling](#1-vấn-đề-prop-drilling)
2. [Lý thuyết cơ bản về Context](#2-lý-thuyết-cơ-bản-về-context)
3. [Cú pháp 3 bước: Create – Provide – Consume](#3-cú-pháp-3-bước-create--provide--consume)
4. [Cơ chế re-render của Context](#4-cơ-chế-re-render-của-context)
5. [Ví dụ 1 (cơ bản): Đổi giao diện Sáng/Tối — Step-by-step](#5-ví-dụ-1-cơ-bản-đổi-giao-diện-sángtối--step-by-step)
6. [Ví dụ 2 (nâng cao): Giỏ hàng với useContext + useReducer — Step-by-step](#6-ví-dụ-2-nâng-cao-giỏ-hàng-với-usecontext--usereducer--step-by-step)
7. [Ví dụ 3: Đăng nhập (AuthContext) + bảo vệ trang](#7-ví-dụ-3-đăng-nhập-authcontext--bảo-vệ-trang)
8. [Những lưu ý quan trọng khi dùng useContext](#8-những-lưu-ý-quan-trọng-khi-dùng-usecontext)
9. [Khi nào nên / không nên dùng Context](#9-khi-nào-nên--không-nên-dùng-context)
10. [React 19: thay đổi liên quan đến Context](#10-react-19-thay-đổi-liên-quan-đến-context)
11. [Tổng kết nhanh (Cheat sheet)](#11-tổng-kết-nhanh-cheat-sheet)
12. [Bài tập thực hành](#12-bài-tập-thực-hành)
13. [Câu hỏi ôn tập](#13-câu-hỏi-ôn-tập)

---

## 1. Vấn đề: Prop Drilling

Trong React, dữ liệu đi **một chiều từ cha xuống con qua props**. Khi một component ở rất sâu cần dữ liệu từ component gốc, ta phải truyền props qua **tất cả các tầng trung gian**, kể cả những tầng không dùng đến dữ liệu đó. Hiện tượng này gọi là **prop drilling**.

```
App (user)
 └── Layout (user)        ← không dùng, chỉ chuyền tiếp
      └── Header (user)   ← không dùng, chỉ chuyền tiếp
           └── Avatar (user)  ← thật sự cần
```

```jsx
function App() {
  const user = { name: "An" };
  return <Layout user={user} />;
}
function Layout({ user }) { return <Header user={user} />; }
function Header({ user }) { return <Avatar user={user} />; }
function Avatar({ user }) { return <span>Xin chào {user.name}</span>; }
```

**Hậu quả:**
- Code dài, khó đọc, khó bảo trì.
- Đổi tên/kiểu prop phải sửa nhiều file.
- Component trung gian bị "dính" vào dữ liệu không liên quan → khó tái sử dụng.

👉 **Context** sinh ra để giải quyết vấn đề này: cho phép component ở bất kỳ độ sâu nào **đọc trực tiếp** dữ liệu từ một "kênh" chung mà không cần truyền props qua từng tầng.

---

## 2. Lý thuyết cơ bản về Context

### 2.1. Context là gì?

**Context** là cơ chế của React để **chia sẻ dữ liệu cho cả một cây component con** (subtree) mà không phải truyền props thủ công.

Hình dung: Context như một **đài phát thanh**:
- `createContext()` → tạo ra **một tần số** (kênh).
- `<Context.Provider value={...}>` → **đài phát** dữ liệu trên tần số đó cho mọi component nằm bên trong.
- `useContext(Context)` → **chiếc radio** dò đúng tần số để nghe dữ liệu.

### 2.2. Ba thành phần

| Thành phần | Vai trò | Ví dụ |
|---|---|---|
| `createContext(defaultValue)` | Tạo đối tượng Context | `const ThemeContext = createContext("light")` |
| `<XxxContext.Provider value={...}>` | Cung cấp giá trị cho cây con | `<ThemeContext.Provider value="dark">` |
| `useContext(XxxContext)` | Đọc giá trị ở component con | `const theme = useContext(ThemeContext)` |

### 2.3. `useContext` là gì?

`useContext` là một **React Hook** cho phép function component đọc giá trị của một Context.

```js
const value = useContext(SomeContext);
```

- **Tham số:** đối tượng Context (kết quả của `createContext`), **không phải** `Provider` hay `Consumer`.
- **Trả về:** `value` của **Provider gần nhất phía trên** component đang gọi.
- Nếu **không có Provider nào** phía trên → trả về `defaultValue` đã truyền vào `createContext`.

### 2.4. Quy tắc tìm Provider

React tìm **ngược lên trên** cây component, lấy **Provider gần nhất** của đúng Context đó.

```jsx
<ThemeContext.Provider value="dark">
  <Page />                         {/* useContext → "dark" */}
  <ThemeContext.Provider value="light">
    <Sidebar />                    {/* useContext → "light" (Provider gần nhất) */}
  </ThemeContext.Provider>
</ThemeContext.Provider>
<Footer />                         {/* ngoài mọi Provider → defaultValue */}
```

> ⚠️ `useContext` **không** nhìn thấy Provider nằm **trong chính component** gọi nó — chỉ nhìn thấy Provider ở **phía trên** (cha, ông...).

### 2.5. Cách viết cũ (để đọc hiểu code cũ)

Trước khi có Hooks, ta đọc Context bằng `Consumer` (render props) hoặc `static contextType` trong class component:

```jsx
<ThemeContext.Consumer>
  {(theme) => <div className={theme}>...</div>}
</ThemeContext.Consumer>
```

Hiện nay **ưu tiên `useContext`** vì ngắn gọn, dễ đọc hơn.

---

## 3. Cú pháp 3 bước: Create – Provide – Consume

```jsx
import { createContext, useContext, useState } from "react";

// BƯỚC 1 — CREATE: tạo context (thường đặt ở file riêng)
const ThemeContext = createContext("light");

// BƯỚC 2 — PROVIDE: bọc cây component bằng Provider
export default function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />; // KHÔNG cần truyền props
}

// BƯỚC 3 — CONSUME: đọc giá trị ở bất kỳ đâu bên trong
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme hiện tại: {theme}
    </button>
  );
}
```

**Ghi nhớ:** Context chỉ là **kênh truyền**. Muốn dữ liệu **thay đổi được**, phải kết hợp với **state** (`useState` / `useReducer`) và đưa cả **giá trị + hàm cập nhật** vào `value`.

---

## 4. Cơ chế re-render của Context

Đây là phần **quan trọng nhất** để dùng Context đúng và hiệu quả.

1. Khi `value` của Provider **thay đổi** (so sánh bằng `Object.is`, tức so sánh **tham chiếu**), **mọi component** gọi `useContext(ContextĐó)` bên trong sẽ **re-render**.
2. Việc re-render này **xuyên qua `React.memo`** — dù component cha được memo và không re-render, component con dùng `useContext` vẫn re-render.
3. Nếu `value` là **object/array tạo mới mỗi lần render** (`value={{ a, b }}`), thì mỗi lần Provider re-render là một object **mới** → tất cả consumer re-render, **kể cả khi `a`, `b` không đổi**.

```jsx
// ❌ Mỗi lần App render → object mới → mọi consumer re-render
<UserContext.Provider value={{ user, login, logout }}>

// ✅ Dùng useMemo / useCallback để giữ ổn định tham chiếu
const login = useCallback((u) => setUser(u), []);
const logout = useCallback(() => setUser(null), []);
const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
<UserContext.Provider value={value}>
```

---

## 5. Ví dụ 1 (cơ bản): Đổi giao diện Sáng/Tối — Step-by-step

### Mục tiêu
Một nút ở Header bật/tắt chế độ Dark mode; Header, Content, Footer đều đổi màu theo — **không truyền props**.

### Bước 1 — Tạo project

```bash
npm create vite@latest theme-context-demo -- --template react
cd theme-context-demo
npm install
npm run dev
```

### Bước 2 — Tổ chức thư mục

```
src/
├── contexts/
│   └── ThemeContext.jsx     ← Context + Provider + custom hook
├── components/
│   ├── Header.jsx
│   ├── Content.jsx
│   └── Footer.jsx
├── App.jsx
├── App.css
└── main.jsx
```

### Bước 3 — Tạo Context, Provider và custom hook

`src/contexts/ThemeContext.jsx`

```jsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";

// 1. Tạo context. Default = null để phát hiện lỗi quên bọc Provider
const ThemeContext = createContext(null);

// 2. Component Provider: chứa state + logic
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Giữ value ổn định, chỉ đổi khi theme đổi
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 3. Custom hook: gọn hơn + báo lỗi rõ ràng
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme phải được dùng bên trong <ThemeProvider>");
  }
  return context;
}
```

> 💡 **Vì sao viết custom hook `useTheme()`?**
> - Component không cần import `ThemeContext` và `useContext` riêng lẻ.
> - Bắt lỗi sớm khi quên bọc Provider (thay vì nhận `null`/default và lỗi khó hiểu ở chỗ khác).
> - Dễ đổi cách cài đặt bên trong mà không ảnh hưởng nơi sử dụng.

### Bước 4 — Bọc ứng dụng bằng Provider

`src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Bước 5 — Dùng Context trong các component

`src/components/Header.jsx`

```jsx
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={`box ${theme}`}>
      <h2>My App</h2>
      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
      </button>
    </header>
  );
}
```

`src/components/Content.jsx`

```jsx
import { useTheme } from "../contexts/ThemeContext";

export default function Content() {
  const { theme } = useTheme();
  return (
    <main className={`box ${theme}`}>
      <p>Giao diện hiện tại: <b>{theme}</b></p>
    </main>
  );
}
```

`src/components/Footer.jsx`

```jsx
import { useTheme } from "../contexts/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  return <footer className={`box ${theme}`}>© 2026 FER202</footer>;
}
```

`src/App.jsx`

```jsx
import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";

export default function App() {
  // App KHÔNG cần biết gì về theme
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
```

### Bước 6 — CSS

`src/App.css`

```css
.box { padding: 16px; margin: 8px; border-radius: 8px; transition: 0.3s; }
.light { background: #ffffff; color: #222; border: 1px solid #ddd; }
.dark  { background: #222;    color: #f5f5f5; border: 1px solid #444; }
```

### Bước 7 — Chạy và kiểm tra
- `npm run dev` → bấm nút → cả Header, Content, Footer đổi màu.
- Thử bỏ `<ThemeProvider>` trong `main.jsx` → thấy lỗi rõ ràng: *"useTheme phải được dùng bên trong <ThemeProvider>"*.

---

## 6. Ví dụ 2 (nâng cao): Giỏ hàng với useContext + useReducer — Step-by-step

### Mục tiêu
- Danh sách sản phẩm, nút **Add to cart**.
- Header hiển thị **số lượng** trong giỏ.
- Trang giỏ hàng: tăng/giảm/xoá, tính **tổng tiền**.
- Tách **state** và **dispatch** ra 2 context để tối ưu re-render.

### Bước 1 — Cấu trúc

```
src/
├── contexts/
│   ├── cartReducer.js
│   └── CartContext.jsx
├── components/
│   ├── CartBadge.jsx
│   ├── ProductList.jsx
│   └── Cart.jsx
├── data/products.js
└── App.jsx
```

### Bước 2 — Dữ liệu mẫu

`src/data/products.js`

```js
export const products = [
  { id: 1, name: "Bàn phím cơ", price: 850000 },
  { id: 2, name: "Chuột không dây", price: 320000 },
  { id: 3, name: "Tai nghe", price: 590000 },
];
```

### Bước 3 — Viết reducer (logic thuần, dễ test)

`src/contexts/cartReducer.js`

```js
export const initialCart = { items: [] }; // item: { id, name, price, qty }

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exist = state.items.find((i) => i.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "DECREASE":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR":
      return initialCart;
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
}
```

> ⚠️ Reducer phải là **pure function** và **immutable**: luôn trả về object/array **mới**, không `push`, không sửa trực tiếp `state`.

### Bước 4 — Tạo 2 Context (state & dispatch) + Provider

`src/contexts/CartContext.jsx`

```jsx
import { createContext, useContext, useReducer } from "react";
import { cartReducer, initialCart } from "./cartReducer";

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartStateContext);
  if (ctx === null) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchContext);
  if (ctx === null) throw new Error("useCartDispatch phải nằm trong <CartProvider>");
  return ctx;
}
```

> 💡 **Vì sao tách 2 context?** `dispatch` của `useReducer` **không bao giờ đổi tham chiếu**. Component chỉ cần *gửi action* (như nút "Add to cart") dùng `useCartDispatch()` sẽ **không re-render** khi giỏ hàng thay đổi.

### Bước 5 — Component chỉ GỬI action

`src/components/ProductList.jsx`

```jsx
import { products } from "../data/products";
import { useCartDispatch } from "../contexts/CartContext";

export default function ProductList() {
  const dispatch = useCartDispatch(); // không re-render khi cart đổi

  return (
    <div>
      <h3>Sản phẩm</h3>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} — {p.price.toLocaleString("vi-VN")}đ{" "}
          <button onClick={() => dispatch({ type: "ADD", payload: p })}>
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Bước 6 — Component ĐỌC state

`src/components/CartBadge.jsx`

```jsx
import { useCart } from "../contexts/CartContext";

export default function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return <span>🛒 Giỏ hàng ({count})</span>;
}
```

`src/components/Cart.jsx`

```jsx
import { useCart, useCartDispatch } from "../contexts/CartContext";

export default function Cart() {
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) return <p>Giỏ hàng trống.</p>;

  return (
    <div>
      <h3>Giỏ hàng</h3>
      {items.map((i) => (
        <div key={i.id}>
          {i.name} x {i.qty}{" "}
          <button onClick={() => dispatch({ type: "ADD", payload: i })}>+</button>
          <button onClick={() => dispatch({ type: "DECREASE", payload: i.id })}>-</button>
          <button onClick={() => dispatch({ type: "REMOVE", payload: i.id })}>Xoá</button>
        </div>
      ))}
      <p><b>Tổng: {total.toLocaleString("vi-VN")}đ</b></p>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Xoá hết</button>
    </div>
  );
}
```

### Bước 7 — Lắp ráp

`src/App.jsx`

```jsx
import { CartProvider } from "./contexts/CartContext";
import CartBadge from "./components/CartBadge";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

export default function App() {
  return (
    <CartProvider>
      <header><CartBadge /></header>
      <ProductList />
      <hr />
      <Cart />
    </CartProvider>
  );
}
```

### Bước 8 — Kiểm tra
- Bấm "Add to cart" → badge tăng, giỏ hàng cập nhật.
- Mở **React DevTools → Profiler → "Highlight updates"**: `ProductList` **không** nhấp nháy khi giỏ thay đổi (vì chỉ dùng dispatch).

---

## 7. Ví dụ 3: Đăng nhập (AuthContext) + bảo vệ trang

Kết hợp với `react-router-dom` — một tình huống rất hay gặp trong bài thi/lab.

```bash
npm install react-router-dom
```

`src/contexts/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username, password) => {
    // Demo: thực tế sẽ gọi API (axios.post('/login', ...))
    if (username === "admin" && password === "123") {
      const u = { username, role: "admin" };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải nằm trong <AuthProvider>");
  return ctx;
}
```

`src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
```

`src/pages/Login.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(form.username, form.password)) navigate("/dashboard");
    else setError("Sai tài khoản hoặc mật khẩu");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Đăng nhập</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
```

`src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Xin chào, {user.username}</h2>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* AuthProvider bọc BrowserRouter hoặc ngược lại đều được.
          Nếu Provider cần dùng useNavigate thì Provider phải nằm TRONG BrowserRouter. */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Lồng nhiều Provider

Khi có nhiều context, lồng chúng ở gốc ứng dụng:

```jsx
<AuthProvider>
  <ThemeProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ThemeProvider>
</AuthProvider>
```

> Provider nào **cần dùng** context khác thì phải nằm **bên trong** Provider đó (ví dụ `CartProvider` cần `useAuth()` → phải nằm trong `AuthProvider`).

---

## 8. Những lưu ý quan trọng khi dùng useContext

### ⚠️ Lưu ý 1: Quên bọc Provider → nhận defaultValue âm thầm
`useContext` **không báo lỗi** khi thiếu Provider; nó lặng lẽ trả về `defaultValue`. Nếu default là `{}` hoặc `undefined`, lỗi sẽ xuất hiện ở chỗ khác rất khó dò (`Cannot read properties of undefined`, `setTheme is not a function`...).

✅ **Cách xử lý:** `createContext(null)` + custom hook ném lỗi rõ ràng (như các ví dụ trên).

### ⚠️ Lưu ý 2: Truyền sai đối số cho useContext

```jsx
useContext(ThemeContext.Provider); // ❌ SAI
useContext(ThemeContext.Consumer); // ❌ SAI
useContext(ThemeContext);          // ✅ ĐÚNG
```

### ⚠️ Lưu ý 3: Gọi useContext trong component chứa chính Provider đó

```jsx
function App() {
  const theme = useContext(ThemeContext); // ❌ nhận defaultValue, KHÔNG phải "dark"
  return (
    <ThemeContext.Provider value="dark">
      ...
    </ThemeContext.Provider>
  );
}
```
✅ Provider phải nằm ở **component cha** của nơi gọi `useContext`.

### ⚠️ Lưu ý 4: value là object mới mỗi lần render → re-render thừa
Dùng `useMemo` cho object `value`, `useCallback` cho các hàm trong `value` (xem mục 4).

### ⚠️ Lưu ý 5: Mọi consumer đều re-render khi value đổi — kể cả chỉ dùng 1 phần
Context **không có "selector"**: component chỉ lấy `theme` vẫn re-render nếu `user` trong cùng context thay đổi.

✅ **Cách xử lý:**
- **Tách context** theo mục đích (ThemeContext, AuthContext, CartContext riêng).
- **Tách state và dispatch** thành 2 context (mục 6).
- Dữ liệu thay đổi **rất thường xuyên** (vị trí chuột, giá trị input gõ liên tục) → **không nên** đặt vào context toàn cục.

### ⚠️ Lưu ý 6: `React.memo` không chặn được re-render do context
Nếu component dùng `useContext`, nó sẽ re-render khi context đổi, bất kể có `memo`. Muốn tối ưu, tách phần đọc context ra component nhỏ, hoặc đọc context ở cha rồi truyền props cần thiết xuống con được `memo`.

### ⚠️ Lưu ý 7: Không dùng Context thay cho mọi props
Props vẫn là cách **tốt nhất, rõ ràng nhất** để truyền dữ liệu 1–2 tầng. Lạm dụng context khiến:
- Khó biết dữ liệu đến từ đâu.
- Component phụ thuộc ngầm vào Provider → **khó tái sử dụng và khó test**.

Trước khi dùng Context, thử: **truyền `children`** (component composition) để giảm tầng trung gian.

```jsx
// Thay vì Layout nhận user rồi chuyền xuống...
<Layout>
  <Avatar user={user} />   {/* App truyền thẳng vào Avatar */}
</Layout>
```

### ⚠️ Lưu ý 8: Context không phải "state management"
Context chỉ là **cơ chế truyền dữ liệu (dependency injection)**. Việc **quản lý** state vẫn do `useState`/`useReducer` đảm nhiệm. Context + useReducer phù hợp app nhỏ–vừa; app lớn, state phức tạp, cần devtools/middleware → cân nhắc **Redux Toolkit**, **Zustand**...

### ⚠️ Lưu ý 9: Không mutate trực tiếp giá trị trong context

```jsx
const { user } = useAuth();
user.name = "B"; // ❌ React không biết để re-render, gây bug khó tìm
```
✅ Luôn cập nhật qua hàm setter/dispatch do Provider cung cấp.

### ⚠️ Lưu ý 10: Tổ chức file & Fast Refresh (Vite)
Vite Fast Refresh khuyến nghị một file **chỉ export component**. File Context export cả component (`ThemeProvider`) lẫn hook (`useTheme`) có thể hiện cảnh báo ESLint `react-refresh/only-export-components` và mất state khi hot reload. Cách làm gọn:
- Chấp nhận cảnh báo (vẫn chạy bình thường), **hoặc**
- Tách: `ThemeContext.js` (createContext), `ThemeProvider.jsx` (component), `useTheme.js` (hook).

### ⚠️ Lưu ý 11: Khởi tạo state tốn kém / đọc localStorage
Dùng **lazy initializer** `useState(() => ...)` (như AuthContext) để chỉ đọc `localStorage` **một lần** khi mount.

### ⚠️ Lưu ý 12: Quy tắc của Hooks vẫn áp dụng
`useContext` chỉ được gọi ở **cấp cao nhất** của function component hoặc custom hook — **không** gọi trong `if`, vòng lặp, hàm xử lý sự kiện, hay class component.

---

## 9. Khi nào nên / không nên dùng Context

| ✅ Nên dùng | ❌ Không nên dùng |
|---|---|
| Theme (sáng/tối), ngôn ngữ (i18n) | Dữ liệu chỉ cần ở 1–2 tầng (dùng props) |
| Thông tin người dùng đăng nhập, quyền | Dữ liệu thay đổi liên tục, tần suất cao |
| Giỏ hàng, thông báo (toast) toàn cục | Mọi state của ứng dụng dồn vào 1 context |
| Cấu hình chung (API base URL, settings) | State server phức tạp (dùng React Query / RTK Query) |

**So sánh nhanh:**

| | Props | Context | Redux Toolkit / Zustand |
|---|---|---|---|
| Phạm vi | Cha → con trực tiếp | Cả cây con | Toàn ứng dụng |
| Cài thêm thư viện | Không | Không | Có |
| Tối ưu re-render | Tốt | Phải tự tối ưu (tách context, memo) | Có selector sẵn |
| Devtools, middleware | — | — | Có |
| Phù hợp | Mọi nơi | App nhỏ–vừa, dữ liệu ít đổi | App lớn, state phức tạp |

---

## 10. React 19: thay đổi liên quan đến Context

- **Dùng Context trực tiếp làm Provider:** `<ThemeContext value="dark">` thay cho `<ThemeContext.Provider value="dark">` (cách cũ vẫn chạy nhưng sẽ dần bị loại bỏ).
- **API `use(Context)`:** giống `useContext` nhưng **được gọi trong điều kiện** (`if`, sau `return` sớm):

```jsx
import { use } from "react";

function Heading({ show }) {
  if (!show) return null;
  const theme = use(ThemeContext); // hợp lệ ở React 19
  return <h1 className={theme}>Hello</h1>;
}
```

> Với React 18 (stack môn học hiện tại) → dùng `.Provider` và `useContext` như các ví dụ trên.

---

## 11. Tổng kết nhanh (Cheat sheet)

```jsx
// contexts/XContext.jsx
import { createContext, useContext, useState, useMemo } from "react";

const XContext = createContext(null);                      // 1. Create

export function XProvider({ children }) {                  // 2. Provide
  const [data, setData] = useState(initial);
  const value = useMemo(() => ({ data, setData }), [data]);
  return <XContext.Provider value={value}>{children}</XContext.Provider>;
}

export function useX() {                                   // 3. Consume (custom hook)
  const ctx = useContext(XContext);
  if (!ctx) throw new Error("useX must be used within XProvider");
  return ctx;
}

// main.jsx:   <XProvider><App /></XProvider>
// Bất kỳ đâu: const { data, setData } = useX();
```

**Checklist khi làm bài:**
- [ ] `createContext(null)` + custom hook có kiểm tra lỗi.
- [ ] Provider bọc **đúng phạm vi** (đủ rộng để mọi consumer nằm trong).
- [ ] `value` được `useMemo`, hàm được `useCallback` (hoặc dùng `dispatch`).
- [ ] Tách context theo mục đích; tách state/dispatch khi cần.
- [ ] Không mutate state; cập nhật qua setter/dispatch.
- [ ] Không gọi `useContext` trong điều kiện / vòng lặp.

---

## 12. Bài tập thực hành

**Bài 1 — LanguageContext (cơ bản)**
Tạo context quản lý ngôn ngữ `vi`/`en`. Có object `translations = { vi: {...}, en: {...} }`. Nút ở Header chuyển ngôn ngữ; mọi text trong Navbar, Home, Footer đổi theo. Yêu cầu custom hook `useLanguage()` trả về `{ lang, t, switchLang }` với `t(key)` trả về chuỗi đã dịch.

**Bài 2 — Notification/Toast (trung bình)**
Tạo `ToastContext` với hàm `showToast(message, variant)`. Toast tự ẩn sau 3 giây. Gọi `showToast` từ bất kỳ component nào (form submit thành công, xoá sản phẩm...). Gợi ý: dùng `react-bootstrap` `Toast`/`ToastContainer`.

**Bài 3 — Cart + Auth + json-server (nâng cao)**
- `json-server` cung cấp `/products`, `/users`.
- `AuthContext`: đăng nhập bằng cách gọi `axios.get('/users?username=...&password=...')`.
- `CartContext` (useReducer): chỉ cho phép "Add to cart" khi đã đăng nhập; lưu giỏ hàng vào `localStorage`, khôi phục khi tải lại trang.
- Trang `/cart` được bảo vệ bằng `ProtectedRoute`.
- Header hiển thị tên người dùng và số lượng sản phẩm.

---

## 13. Câu hỏi ôn tập

1. `useContext(MyContext)` trả về giá trị gì khi **không có** Provider nào phía trên?
   → **`defaultValue`** truyền vào `createContext(defaultValue)`.

2. Có 2 Provider của cùng một Context lồng nhau, component con nhận giá trị nào?
   → Của **Provider gần nhất** phía trên nó.

3. Vì sao `value={{ user, setUser }}` có thể gây re-render thừa?
   → Mỗi lần render tạo **object mới** (tham chiếu khác) → React coi là thay đổi → mọi consumer re-render. Khắc phục bằng `useMemo`.

4. Component được bọc `React.memo` có re-render khi context nó dùng thay đổi không?
   → **Có.** `memo` chỉ so sánh props, không chặn cập nhật từ context.

5. Đối số đúng của `useContext` là gì: `MyContext`, `MyContext.Provider` hay `MyContext.Consumer`?
   → **`MyContext`**.

6. Context có thay thế được Redux không?
   → Context chỉ là **cơ chế truyền dữ liệu**; kết hợp `useReducer` có thể thay Redux cho app nhỏ–vừa, nhưng thiếu selector, middleware, devtools của Redux cho app lớn.

7. Tại sao nên tách `StateContext` và `DispatchContext`?
   → `dispatch` có tham chiếu ổn định; component chỉ gửi action sẽ **không re-render** khi state đổi.

8. Gọi `useContext` bên trong `if (...) { }` có hợp lệ không?
   → **Không** (vi phạm Rules of Hooks). Ở React 19 có thể dùng `use(Context)` trong điều kiện.
