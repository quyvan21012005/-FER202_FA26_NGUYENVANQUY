# React Router trong ReactJS – Lý thuyết và 5 bài tập cơ bản - created by traltb@fe.edu.vn


**Chuẩn bị:** Vite + React 19 + React-Bootstrap 2 + `react-router-dom` 7.

```bash
npm create vite@latest router-basic -- --template react
cd router-basic
npm install
npm install react-bootstrap bootstrap react-router-dom
```

Trong `src/main.jsx` import `bootstrap/dist/css/bootstrap.min.css`. Xóa `App.css`, `index.css` nếu không dùng.

---

## Phần A. Lý thuyết React Router

### A1. Routing là gì? Vì sao cần React Router?

Ứng dụng React thông thường là **SPA (Single Page Application)**: trình duyệt chỉ tải **một** file `index.html`, sau đó JavaScript tự vẽ lại giao diện. Nhưng người dùng vẫn muốn:

- Mỗi "trang" có **URL riêng** (`/about`, `/products/5`) để bookmark, gửi link cho bạn.
- Nút **Back/Forward** của trình duyệt hoạt động.
- Nhấn F5 vẫn ở đúng trang.

**Routing** = ánh xạ *URL → component cần hiển thị*. React không có sẵn tính năng này, nên dùng thư viện **React Router**.

So sánh hai cách chuyển trang:

| | Thẻ `<a href="/about">` | `<Link to="/about">` của React Router |
| --- | --- | --- |
| Cách hoạt động | Trình duyệt gửi request mới, tải lại **toàn bộ** trang | Chặn hành vi mặc định, đổi URL bằng History API, React chỉ vẽ lại phần thay đổi |
| State trong app (giỏ hàng, form đang gõ) | **Mất hết** | Giữ nguyên |
| Tốc độ | Chậm (tải lại JS, CSS) | Gần như tức thì |

➡ Trong ứng dụng React, **chuyển trang nội bộ luôn dùng `Link`/`NavLink`**, chỉ dùng `<a>` cho link ra ngoài (website khác).

### A2. Cài đặt và `BrowserRouter`

```bash
npm install react-router-dom
```

> Từ v7, mọi thứ nằm trong gói `react-router`; gói `react-router-dom` vẫn phát hành và export y hệt để tương thích code v6. Hai cách import đều được: `from 'react-router-dom'` hoặc `from 'react-router'`.

Bọc toàn bộ ứng dụng trong `BrowserRouter` (thường ở `main.jsx`):

```jsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

> `useTransitions={false}` (có từ React Router 7.15): mặc định React Router cập nhật URL bên trong `React.startTransition` (ưu tiên thấp). Khi ô nhập lấy giá trị từ URL (Bài 5) hoặc vừa đổi state vừa chuyển trang trong cùng một hàm, cập nhật "chậm" này gây lỗi khó đoán: gõ nhanh bị mất ký tự, trang bị chuyển nhầm. Tắt đi để URL cập nhật đồng bộ như `useState` – cách đơn giản và an toàn cho người mới học.

`BrowserRouter` theo dõi URL trên thanh địa chỉ và cung cấp thông tin đó cho mọi component con. **Mọi** `Routes`, `Link`, `useNavigate`, ... phải nằm bên trong nó, nếu không sẽ báo lỗi *"useNavigate() may be used only in the context of a `<Router>` component"*.

React Router 7 có 3 chế độ, môn FER202 chủ yếu dùng hai chế độ đầu:

| Chế độ | Cách khai báo | Dùng khi |
| --- | --- | --- |
| **Declarative** | `<BrowserRouter>` + `<Routes>`/`<Route>` trong JSX | Học cơ bản, app nhỏ – **tài liệu này** |
| **Data** | `createBrowserRouter([...])` + `<RouterProvider>` | Cần `loader`, `action` (tải dữ liệu trước khi render) – xem `HookRouter.md` Bài 5 |
| **Framework** | Dự án tạo bằng `create-react-router` (thay Remix) | Ứng dụng lớn, SSR – ngoài phạm vi môn |

### A3. `Routes` và `Route` – khai báo bảng định tuyến

```jsx
import { Routes, Route } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
```

- `Route` gồm `path` (mẫu URL) và `element` (JSX cần render – viết `<HomePage />`, **không** phải `HomePage`).
- `Routes` xem URL hiện tại, chọn **một** route khớp nhất rồi render `element` của nó.
- React Router 7 xếp hạng route theo độ cụ thể, nên **thứ tự khai báo không quan trọng**: `/about` luôn thắng `*`, `/products/new` luôn thắng `/products/:id`.
- `path="*"` khớp mọi URL còn lại → dùng làm **trang 404**.
- Phần nằm **ngoài** `Routes` (navbar, footer) hiển thị ở mọi trang.

### A4. `Link` và `NavLink`

```jsx
import { Link, NavLink } from 'react-router-dom';

<Link to="/about">Giới thiệu</Link>

<NavLink to="/" end>Trang chủ</NavLink>
<NavLink to="/products">Sản phẩm</NavLink>
```

`NavLink` = `Link` + biết mình có **đang active** hay không:

- Tự thêm class `active` khi URL khớp (Bootstrap tô sáng `.nav-link.active`).
- Mặc định khớp **cả các URL con**: `/products` active cả khi đang ở `/products/5`. Đó là điều ta muốn với menu "Sản phẩm".
- Riêng `to="/"` thì mọi URL đều bắt đầu bằng `/`, nên phải thêm **`end`** để chỉ active khi URL đúng bằng `/`.
- `className`, `style` và `children` có thể là **hàm** nhận `{ isActive, isPending }`:

```jsx
<NavLink to="/cart" className={({ isActive }) => (isActive ? 'fw-bold text-danger' : 'text-dark')}>
  Giỏ hàng
</NavLink>
```

Kết hợp với React-Bootstrap: dùng prop `as` để component Bootstrap render thành `NavLink`/`Link`:

```jsx
<Nav.Link as={NavLink} to="/products">Sản phẩm</Nav.Link>
<Navbar.Brand as={Link} to="/">Shop</Navbar.Brand>
<Button as={Link} to="/register">Đăng ký</Button>
```

> Không viết `<Nav.Link href="/products">` – đó là thẻ `<a>` thường, trang sẽ tải lại.

### A5. Route lồng nhau, Layout route, `Outlet`, `index`

Hầu hết website có **khung chung** (menu, footer) và chỉ thay phần nội dung. Thay vì lặp `<AppNavbar />` ở mọi trang, ta dùng **layout route**:

```jsx
<Routes>
  <Route path="/" element={<MainLayout />}>       {/* route cha */}
    <Route index element={<HomePage />} />        {/* "/"        */}
    <Route path="books" element={<BooksPage />} /> {/* "/books"   */}
    <Route path="help" element={<HelpLayout />}>   {/* lồng cấp 2 */}
      <Route path="faq" element={<FaqPage />} />   {/* "/help/faq" */}
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

```jsx
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <>
    <AppNavbar />
    <main>
      <Outlet /> {/* route con khớp URL được render TẠI ĐÂY */}
    </main>
    <Footer />
  </>
);
```

Các quy tắc cần nhớ:

| Khái niệm | Ý nghĩa |
| --- | --- |
| `<Outlet />` | "Chỗ trống" trong component cha, nơi route con được vẽ vào. Quên `Outlet` → trang con không hiện. |
| `index` | Route con **mặc định**, hiển thị khi URL đúng bằng path của cha. Route index không có `path`. |
| Path con không có `/` đầu | Tương đối với cha: `books` trong cha `/` → `/books`; `faq` trong cha `help` → `/help/faq`. |
| Link tương đối | Trong `HelpLayout`, `<NavLink to="faq">` = `/help/faq`. `to=".."` lên một cấp. Link bắt đầu bằng `/` là tuyệt đối. |
| Route chỉ có `element`, không `path` | "Pathless layout route": bọc nhóm route bằng một layout mà không thêm đoạn URL nào. |

### A6. Tham số động trên URL – `useParams`

Khi có nhiều trang giống nhau chỉ khác dữ liệu (`/products/1`, `/products/2`, ...), khai báo **một** route với tham số `:tên`:

```jsx
<Route path="/products/:id" element={<ProductDetailPage />} />
```

```jsx
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();                       // "5" – luôn là CHUỖI
  const product = products.find((p) => p.id === Number(id));
  if (!product) return <p>Không tìm thấy sản phẩm {id}</p>;
  return <h2>{product.name}</h2>;
};
```

- Tên thuộc tính lấy từ `useParams()` phải **trùng** tên sau dấu `:` trong path.
- Giá trị luôn là **string** → so sánh với id kiểu số phải `Number(id)`.
- Người dùng có thể gõ bất cứ thứ gì lên URL → **luôn xử lý trường hợp không tìm thấy**.
- Có thể có nhiều tham số: `/courses/:code/lessons/:no` → `const { code, no } = useParams()`.
- Tham số tùy chọn: `/:lang?/about` khớp cả `/about` và `/en/about`.
- Splat: `/files/*` → `useParams()['*']` chứa phần còn lại của URL.
- Tạo link: `<Link to={`/products/${p.id}`}>`.

### A7. Điều hướng bằng code – `useNavigate` và `<Navigate>`

`Link` dùng khi người dùng **bấm vào link**. Khi cần chuyển trang **sau một xử lý** (gửi form xong, đăng nhập thành công, bấm nút "Quay lại") dùng `useNavigate`:

```jsx
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ...kiểm tra dữ liệu
    navigate('/success', { state: { name: 'An' }, replace: true });
  };

  return <Button onClick={() => navigate(-1)}>Quay lại</Button>;
};
```

| Cách gọi | Kết quả |
| --- | --- |
| `navigate('/products')` | Đi tới `/products`, thêm một mục vào lịch sử |
| `navigate('/login', { replace: true })` | Đi tới `/login` nhưng **thay** mục hiện tại → nút Back không quay lại trang cũ |
| `navigate(-1)` / `navigate(1)` | Lùi / tiến một bước, giống nút Back / Forward |
| `navigate('/success', { state: {...} })` | Gửi kèm dữ liệu sang trang mới mà không hiện trên URL |

> **Không** gọi `navigate()` trực tiếp trong thân component khi render (sẽ có cảnh báo). Chỉ gọi trong hàm xử lý sự kiện hoặc `useEffect`. Khi cần **chuyển trang ngay lúc render** (ví dụ: chưa đăng nhập, thiếu dữ liệu), trả về component `<Navigate>`:

```jsx
if (!user) return <Navigate to="/login" replace />;
```

### A8. Đọc thông tin URL hiện tại – `useLocation`

```jsx
const location = useLocation();
// location.pathname → "/success"
// location.search   → "?q=dell"
// location.hash     → "#top"
// location.state    → dữ liệu gửi qua navigate(..., { state }) hoặc <Link state={...}>
```

Lưu ý về `location.state`:

- Chỉ tồn tại khi đi tới trang **bằng điều hướng trong app**. Gõ thẳng URL hoặc mở tab mới → `state` là `null`. Luôn kiểm tra `null`.
- F5 trên cùng tab vẫn giữ `state` (trình duyệt lưu trong history), nhưng không nên lưu dữ liệu quan trọng ở đây.
- Chỉ đưa dữ liệu nhỏ, tuần tự hóa được (object, chuỗi, số) – không đưa hàm.

`useLocation` còn dùng để chạy hiệu ứng khi đổi trang, ví dụ cuộn lên đầu:

```jsx
const { pathname } = useLocation();
useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
```

### A9. Query string – `useSearchParams`

Phần sau dấu `?` của URL (`/students?class=SE20B04&q=an`) thích hợp để lưu **trạng thái tìm kiếm, lọc, sắp xếp, phân trang**: chia sẻ link là người nhận thấy đúng kết quả, F5 không mất bộ lọc, nút Back quay về bộ lọc trước.

```jsx
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

const q = searchParams.get('q') ?? '';            // null nếu không có → giá trị mặc định
const page = Number(searchParams.get('page') ?? 1); // luôn là chuỗi → tự ép kiểu

setSearchParams({ q: 'an', class: 'SE20B04' });   // ghi đè TOÀN BỘ query string
setSearchParams({});                              // xóa hết

// Đổi MỘT tham số, giữ nguyên các tham số khác – dùng dạng hàm (prev) => next
// giống functional update của useState: luôn tính từ query string mới nhất.
setSearchParams((prev) => {
  const next = new URLSearchParams(prev);
  next.set('page', '2');    // hoặc next.delete('page')
  return next;
}, { replace: true });
```

- `searchParams` giống `URLSearchParams` chuẩn của trình duyệt: `get`, `has`, `getAll`, `set`, `delete`, `toString`.
- **URL chính là state**: không cần thêm `useState` cho từ khóa/bộ lọc; danh sách hiển thị là dữ liệu dẫn xuất tính từ `searchParams` mỗi lần render.
- Ô tìm kiếm cập nhật theo từng phím → dùng `{ replace: true }` để không tạo một mục lịch sử cho mỗi ký tự.
- Ô nhập có `value` đọc từ URL cần `BrowserRouter useTransitions={false}` (mục A2); nếu không, gõ nhanh sẽ bị mất ký tự vì URL cập nhật trễ hơn ô nhập.

So sánh nhanh 3 nơi truyền dữ liệu qua URL:

| | `useParams` | `useSearchParams` | `location.state` |
| --- | --- | --- | --- |
| Ví dụ URL | `/products/5` | `/products?sort=price` | `/success` (không thấy trên URL) |
| Dùng cho | Xác định **tài nguyên nào** | **Tùy chọn hiển thị**: lọc, sắp xếp, trang | Dữ liệu tạm khi chuyển trang |
| Chia sẻ link giữ được? | Có | Có | Không |
| Khai báo trong `Route`? | Có (`:id`) | Không | Không |

### A10. Bảng tổng hợp API cơ bản

| API | Loại | Dùng để |
| --- | --- | --- |
| `BrowserRouter` | Component | Bọc toàn app, kích hoạt routing |
| `Routes`, `Route` | Component | Khai báo URL → component |
| `Link` | Component | Link chuyển trang không tải lại |
| `NavLink` | Component | Link cho menu, tự biết active |
| `Outlet` | Component | Chỗ hiển thị route con trong layout |
| `Navigate` | Component | Chuyển trang ngay khi render |
| `useNavigate` | Hook | Chuyển trang bằng code |
| `useParams` | Hook | Đọc tham số động `:id` |
| `useSearchParams` | Hook | Đọc/ghi query string `?a=1` |
| `useLocation` | Hook | Đọc URL hiện tại và `state` |
| `useOutletContext` | Hook | Route con nhận dữ liệu cha truyền qua `<Outlet context={...} />` |

### A11. Nâng cao (giới thiệu – học tiếp trong `HookRouter.md`)

**Route bảo vệ (Protected route):** một layout route kiểm tra đăng nhập, chưa đăng nhập thì `Navigate` về `/login` và nhớ trang đang muốn vào:

```jsx
const RequireAuth = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
};

<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/orders" element={<Orders />} />
</Route>
```

Sau khi đăng nhập: `navigate(location.state?.from?.pathname ?? '/', { replace: true })`.

**Data Router:** khai báo route bằng object, mỗi route có thể có `loader` (tải dữ liệu **trước** khi render), `action` (xử lý `<Form>` submit), `errorElement` (trang lỗi riêng), `lazy` (tách code):

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products/:id', element: <ProductDetail />, loader: ({ params }) => getProduct(params.id) },
    ],
  },
]);

createRoot(root).render(<RouterProvider router={router} />);
// Trong ProductDetail: const product = useLoaderData();
```

### A12. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| Lỗi *"useNavigate() may be used only in the context of a <Router>"* | Component dùng hook router nằm ngoài `BrowserRouter` | Bọc `BrowserRouter` ở `main.jsx` |
| Bấm menu trang bị tải lại, mất state | Dùng `<a href>` hoặc `Nav.Link href` | Dùng `Link`/`NavLink` hoặc `as={NavLink} to=...` |
| Menu "Trang chủ" luôn sáng | `NavLink to="/"` thiếu `end` | Thêm `end` |
| Route con không hiển thị | Layout thiếu `<Outlet />` | Thêm `<Outlet />` vào layout |
| Route con viết `path="/books"` lồng trong cha `/admin` báo lỗi | Path con tuyệt đối không bắt đầu bằng path cha | Viết tương đối `path="books"` |
| `element={HomePage}` không hiện gì | Truyền component chứ không phải JSX | `element={<HomePage />}` |
| `products.find(p => p.id === id)` luôn `undefined` | `id` từ `useParams` là chuỗi | `Number(id)` |
| `location.state` là `null` gây lỗi đọc thuộc tính | Vào trang bằng cách gõ URL | Kiểm tra `null`, `Navigate` về trang trước đó |
| Cảnh báo *"You should call navigate() in a React.useEffect()"* | Gọi `navigate()` trong thân component | Dùng `<Navigate>` hoặc gọi trong event/`useEffect` |
| Gõ nhanh vào ô tìm kiếm (value lấy từ URL) bị mất ký tự | URL cập nhật trong `startTransition` (mặc định), trễ hơn ô nhập | `<BrowserRouter useTransitions={false}>` |
| Deploy lên Vercel/Netlify, F5 ở `/about` bị 404 | Server không biết route của SPA | Cấu hình rewrite mọi URL về `index.html` (Vite dev server đã tự làm) |

---

## Phần B. Bài tập

| Bài | Chủ đề | Kỹ thuật chính |
| --- | --- | --- |
| 1 | Portfolio cá nhân | `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink` + `end`, trang 404 |
| 2 | Thư viện FPT | Layout route, `Outlet`, `index`, route lồng 2 cấp, link tương đối, `Navigate` |
| 3 | Danh sách môn học | Tham số động `:code`, `useParams`, xử lý không tìm thấy |
| 4 | Đăng ký sự kiện | `useNavigate` (đường dẫn, `-1`, `replace`, `state`), `useLocation`, `<Navigate>` |
| 5 | Danh bạ sinh viên | `useSearchParams`: tìm kiếm + lọc lưu trên URL |

Mỗi bài làm trong project `router-basic` (có thể tạo thư mục `src/bai1`, `src/bai2`, ... và đổi component trong `App.jsx` sang bài đang làm).

---

### Bài 1. Portfolio cá nhân – nhiều trang và trang 404

**Mục tiêu:** khai báo route, chuyển trang bằng `Link`/`NavLink`, hiểu `end` và route `*`.

**Yêu cầu:**

1. Website có 4 trang: Trang chủ `/`, Kỹ năng `/skills`, Dự án `/projects`, Liên hệ `/contact`.
2. Navbar (React-Bootstrap) xuất hiện ở mọi trang: tên bạn ở bên trái (bấm về trang chủ), 4 mục menu bên phải.
3. Mục menu của trang hiện tại được tô sáng; ở `/skills` thì "Trang chủ" **không** sáng.
4. Trang chủ có nút "Xem dự án của mình" chuyển sang `/projects`.
5. Trang Kỹ năng hiển thị danh sách (`ListGroup`), trang Dự án hiển thị 3 `Card`.
6. URL không tồn tại (`/abc`) hiện trang 404 có link "Về trang chủ".
7. Chuyển trang **không** tải lại trình duyệt.

**Các bước làm:**

1. Bọc `<App />` trong `<BrowserRouter>` ở `main.jsx`.
2. Tạo 5 component trang: `HomePage`, `SkillsPage`, `ProjectsPage`, `ContactPage`, `NotFoundPage`.
3. Tạo `AppNavbar`: mảng `MENU = [{ to, label }]`, `map` ra `<Nav.Link as={NavLink} to={item.to} end={item.to === '/'}>`. `Navbar.Brand as={Link} to="/"`.
4. Trong `App`: `<AppNavbar />` đặt **ngoài** `Routes`; bên trong `Routes` khai báo 4 route + `path="*"`.
5. Nút trang chủ: `<Button as={Link} to="/projects">`.

**Tiêu chí hoàn thành:**

- [ ] Bấm từng mục menu: URL đổi, nội dung đổi, mục đó sáng, các mục khác không sáng.
- [ ] Mở tab Network (F12): chuyển trang không có request tải lại `index.html`.
- [ ] Gõ `/abc` → trang 404; bấm "Về trang chủ" → về `/`.
- [ ] Nút Back/Forward của trình duyệt hoạt động đúng.
- [ ] Không dùng `<a href>` cho link nội bộ.

---

### Bài 2. Thư viện FPT – Layout chung và route lồng nhau

**Mục tiêu:** dùng layout route + `Outlet` để không lặp navbar/footer, hiểu `index`, path tương đối, route lồng 2 cấp.

**Yêu cầu:**

1. Mọi trang có chung `MainLayout`: navbar (Trang chủ, Sách, Hướng dẫn) + footer "© 2026 Thư viện FPT University ...".
2. Các trang: Trang chủ `/`, Danh sách sách `/books` (bảng 3 cuốn).
3. Trang Hướng dẫn có **layout riêng** `HelpLayout`: tiêu đề + 2 tab "Câu hỏi thường gặp" (`/help/faq`) và "Nội quy" (`/help/rules`).
4. Vào `/help` thì tự chuyển sang `/help/faq`.
5. Menu "Hướng dẫn" vẫn sáng khi đang ở `/help/faq` hoặc `/help/rules`.
6. Trang 404 vẫn có navbar và footer.

**Các bước làm:**

1. Tạo `MainLayout` gồm `Navbar` + `<Container as="main"><Outlet /></Container>` + `footer`.
2. Khai báo route cha `<Route path="/" element={<MainLayout />}>`, bên trong:
    - `<Route index element={<HomePage />} />`
    - `<Route path="books" ... />` (không có `/` ở đầu)
    - `<Route path="help" element={<HelpLayout />}>` chứa `index` → `<Navigate to="faq" replace />`, `faq`, `rules`
    - `<Route path="*" ... />`
3. `HelpLayout`: `Nav variant="tabs"` với `<Nav.Link as={NavLink} to="faq">` (link **tương đối**) + `<Outlet />`.
4. Navbar: "Trang chủ" có `end`, "Hướng dẫn" **không** có `end`.

**Tiêu chí hoàn thành:**

- [ ] Navbar và footer chỉ viết **một lần** trong `MainLayout`.
- [ ] Bấm "Hướng dẫn" → URL là `/help/faq`, cả menu "Hướng dẫn" và tab "Câu hỏi thường gặp" cùng sáng.
- [ ] Bấm tab "Nội quy" → `/help/rules`, menu "Hướng dẫn" vẫn sáng.
- [ ] Trang chủ → Hướng dẫn → Nội quy, rồi bấm Back: về `/help/faq`; Back lần nữa: về trang chủ (nhờ `replace`, lịch sử không có mục `/help` nên không bị kẹt ở đó).
- [ ] `/xyz` → 404 có navbar + footer.

---

### Bài 3. Danh sách môn học – tham số động và `useParams`

**Mục tiêu:** khai báo route `:code`, đọc tham số bằng `useParams`, tạo link động, xử lý tham số sai.

**Yêu cầu:**

1. File `courses.js` chứa mảng 5 môn: `{ code, name, credits, semester, desc }` (PRF192, WED201c, PRO192, FER202, SWP391).
2. `/` tự chuyển sang `/courses`.
3. `/courses`: bảng các môn, mã môn là link tới `/courses/<mã>`.
4. `/courses/:code`: Card chi tiết (mã, kỳ, số tín chỉ, tên, mô tả) + link "← Quay lại danh sách".
5. Mã không phân biệt hoa thường: `/courses/fer202` cũng hiện FER202.
6. Mã không tồn tại (`/courses/ABC123`) → thông báo đỏ "Không tìm thấy môn học có mã ABC123" + link về danh sách.

**Các bước làm:**

1. Viết `findCourse(code)` so sánh `toLowerCase()`.
2. Khai báo:
    ```jsx
    <Route path="/" element={<Navigate to="/courses" replace />} />
    <Route path="/courses" element={<CourseListPage />} />
    <Route path="/courses/:code" element={<CourseDetailPage />} />
    ```
3. `CourseListPage`: `<Link to={`/courses/${c.code}`}>`.
4. `CourseDetailPage`: `const { code } = useParams();` → `findCourse(code)` → không có thì return `Alert`.

**Tiêu chí hoàn thành:**

- [ ] Vào `/` → URL thành `/courses`.
- [ ] Bấm FER202 → `/courses/FER202` hiện đúng thông tin.
- [ ] Sửa URL thành `/courses/PRF192` → nội dung đổi theo (cùng một component, khác tham số).
- [ ] `/courses/fer202` hiển thị được; `/courses/ABC123` báo không tìm thấy, không lỗi trắng trang.
- [ ] Chỉ có **một** route chi tiết dùng chung cho mọi môn.

---

### Bài 4. Đăng ký sự kiện – điều hướng bằng code và truyền state

**Mục tiêu:** dùng `useNavigate` với đường dẫn, `-1`, `replace`, `state`; đọc `state` bằng `useLocation`; chặn truy cập trực tiếp bằng `<Navigate>`.

**Yêu cầu:**

1. `/`: Card giới thiệu "FPTU Tech Day 2026" + nút "Đăng ký ngay" → `/register`.
2. `/register`: form Họ tên, Email, Buổi tham dự (Sáng/Chiều) + nút "Quay lại" (về trang trước) + "Gửi đăng ký".
3. Gửi khi thiếu họ tên hoặc email không có `@` → hiện lỗi, không chuyển trang.
4. Gửi hợp lệ → chuyển sang `/success` hiển thị "Cảm ơn <tên>, vé đã gửi tới <email>" và buổi đã chọn. Dữ liệu **không** hiện trên URL.
5. Ở `/success` bấm Back của trình duyệt → về trang sự kiện, **không** quay lại form.
6. Gõ thẳng `/success` (không qua form) → tự chuyển về `/register`.
7. Trang thành công có nút "Đăng ký thêm người khác" và "Về trang sự kiện".

**Các bước làm:**

1. `EventPage`: `const navigate = useNavigate();` nút `onClick={() => navigate('/register')}`.
2. `RegisterPage`: state form `{ name, email, session }` (một `handleChange` dùng `[e.target.name]`), state `error`.
3. `handleSubmit`: `e.preventDefault()` → kiểm tra → `navigate('/success', { state: form, replace: true })`.
4. Nút "Quay lại": `navigate(-1)`.
5. `SuccessPage`: `const data = useLocation().state;` → `if (!data) return <Navigate to="/register" replace />;`.

**Tiêu chí hoàn thành:**

- [ ] Nhập tên "  Trần Bình " → trang thành công hiện "Cảm ơn Trần Bình" (đã `trim`).
- [ ] URL trang thành công đúng là `/success`, không có `?name=...`.
- [ ] Back ở trang thành công → về `/` (giải thích được vì sao: `replace: true`).
- [ ] Gõ `/success` trên thanh địa chỉ → về `/register`, không lỗi.
- [ ] Không gọi `navigate()` trong thân component lúc render (Console không có cảnh báo).

---

### Bài 5. Danh bạ sinh viên – tìm kiếm và lọc trên URL

**Mục tiêu:** lưu trạng thái tìm kiếm/lọc trong query string bằng `useSearchParams`, không dùng `useState` cho bộ lọc.

> Trước khi làm: kiểm tra `main.jsx` đã có `<BrowserRouter useTransitions={false}>` (mục A2).

**Yêu cầu:**

1. Dữ liệu 6 sinh viên `{ id, name, className, gpa }`, 3 lớp `SE20B01`, `SE20B02`, `SE20B04`.
2. Ô tìm kiếm theo tên **hoặc** MSSV (không phân biệt hoa thường) và ô chọn lớp ("Tất cả lớp" + 3 lớp).
3. Bộ lọc lưu trên URL: `/?q=anh&class=SE20B02`. Bộ lọc rỗng thì **xóa** tham số khỏi URL.
4. Mở link có sẵn tham số → ô nhập, ô chọn và bảng hiện đúng theo URL; F5 không mất bộ lọc.
5. Dòng "Tìm thấy x/6 sinh viên"; không có kết quả thì bảng hiện "Không có sinh viên phù hợp."
6. Nút "Xóa lọc" xóa toàn bộ query string.
7. Gõ phím **không** tạo một mục lịch sử cho mỗi ký tự; đổi lớp thì có (Back quay về lớp trước).

**Các bước làm:**

1. `const [searchParams, setSearchParams] = useSearchParams();`
2. `const q = searchParams.get('q') ?? '';` và tương tự `class`.
3. Hàm `updateParam(key, value, replace)`: `setSearchParams((prev) => { const next = new URLSearchParams(prev); /* set hoặc delete */ return next; }, { replace })`.
4. Ô tìm kiếm: `value={q}` và `onChange={(e) => updateParam('q', e.target.value, true)}`; ô chọn lớp gọi `updateParam('class', value)`.
5. `result = STUDENTS.filter(...)` tính ngay khi render (dữ liệu dẫn xuất).
6. "Xóa lọc": `setSearchParams({})`.

**Tiêu chí hoàn thành:**

- [ ] Gõ `anh` → URL `?q=anh`, tìm thấy 2/6 (Phạm Minh **Anh**, Võ T**hanh** Dũng – vì sao?).
- [ ] Chọn lớp SE20B02 → URL `?q=anh&class=SE20B02`, còn 1/6.
- [ ] Xóa trắng ô tìm kiếm → `q` biến mất khỏi URL.
- [ ] Mở `/?class=SE20B04&q=hân` → chọn sẵn SE20B04, 1 kết quả (Đỗ Ngọc Hân).
- [ ] "Xóa lọc" → 6/6; bấm Back → bộ lọc cũ quay lại.
- [ ] Gõ nhanh "nguyen van" (không dừng) → ô nhập hiện đủ "nguyen van", URL `?q=nguyen+van`.
- [ ] Không có `useState` nào cho `q` hay `class`.

---



## Phần C. Checklist lưu ý khi dùng React Router

- [ ] `BrowserRouter` bọc toàn bộ app, chỉ **một** lần, có `useTransitions={false}` khi mới học.
- [ ] Link nội bộ dùng `Link`/`NavLink` (hoặc `as={NavLink}`), không dùng `<a href>`.
- [ ] `NavLink to="/"` luôn có `end`.
- [ ] `element={<Page />}` – truyền JSX, không truyền tên component.
- [ ] Có route `path="*"` cho trang 404.
- [ ] Phần chung (navbar, footer) đặt trong layout route + `<Outlet />`, không lặp ở từng trang.
- [ ] Path route con viết tương đối (không `/` đầu).
- [ ] Giá trị từ `useParams`/`useSearchParams` là **chuỗi** → ép kiểu khi cần, luôn xử lý không tìm thấy / `null`.
- [ ] `navigate()` chỉ gọi trong event handler hoặc `useEffect`; lúc render dùng `<Navigate>`.
- [ ] Dùng `replace: true` khi không muốn người dùng Back về trang cũ (sau khi gửi form, đăng nhập, redirect).
- [ ] `location.state` có thể `null` – luôn kiểm tra.
- [ ] Bộ lọc/tìm kiếm/phân trang cần chia sẻ được → lưu trên URL bằng `useSearchParams` thay vì `useState`.

