# Lab 6 – Axios nâng cao, React Router và json-server (Exercise 27 – Phần 3)

> Toàn bộ code đã được build và chạy thử (React 18.3, Vite 5, axios 1.7, react-bootstrap 2.10, React Router 6.26, json-server 0.17.4). Phiên bản cuối trùng với lời giải tham khảo `exercise27-part3-advanced` trong cùng thư mục. Sinh viên nên **gõ lại và hiểu** từng đoạn, không copy cả khối.

## Mục lục

- [Phần I. Tổng quan](#phần-i-tổng-quan)
- [TODO 0 – Chuẩn bị project](#todo-0--chuẩn-bị-project)
- [TODO 1 – NC1: async/await](#todo-1--nc1-chuyển-sang-asyncawait)
- [TODO 2 – NC2: axios instance, interceptors, tầng service](#todo-2--nc2-axios-instance-interceptors-và-tầng-service)
- [TODO 3 – NC3: Nhiều request cùng lúc](#todo-3--nc3-nhiều-request-cùng-lúc)
- [TODO 4 – NC4: Chọn id và hủy request](#todo-4--nc4-chọn-id-và-hủy-request-abortcontroller)
- [TODO 5 – NC5: Giao diện react-bootstrap](#todo-5--nc5-giao-diện-bằng-react-bootstrap)
- [TODO 6 – NC6: Ứng dụng CRUD với React Router](#todo-6--nc6-ứng-dụng-crud-với-react-router)
- [TODO 7 – NC7: Lưu dữ liệu thật với json-server](#todo-7--nc7-lưu-dữ-liệu-thật-với-json-server)
- [TODO 8 – NC8: Custom hook useAxios](#todo-8--nc8-custom-hook-useaxios)
- [TODO 9 – NC9: Tìm kiếm có debounce](#todo-9--nc9-tìm-kiếm-có-debounce)
- [TODO 10 – NC10: Xóa hàng loạt và optimistic update](#todo-10--nc10-thao-tác-hàng-loạt-và-optimistic-update)
- [Phần III. Kiểm thử tổng](#phần-iii-kiểm-thử-tổng)
- [Phần IV. Lỗi thường gặp](#phần-iv-lỗi-thường-gặp)
- [Phần V. Câu hỏi tự kiểm tra](#phần-v-câu-hỏi-tự-kiểm-tra)
- [Phần VI. Checklist tổng (theo đề)](#phần-vi-checklist-tổng-theo-đề)

---

## Phần I. Tổng quan

### I.1. Bảng TODO

| TODO | Yêu cầu đề | Kỹ thuật chính | File chính sau khi xong |
|---|---|---|---|
| 0 | – | Chuẩn bị project Phần 1–2 | `src/*.jsx` |
| 1 | NC1 | `async/await`, `try/catch/finally` | 7 component Phần 1–2 |
| 2 | NC2 | `axios.create`, interceptors, tầng service | `api/axiosClient.js`, `api/postApi.js` |
| 3 | NC3 | `Promise.all`, `Promise.allSettled`, đo thời gian | `PostDetail.jsx` |
| 4 | NC4 | `AbortController`, `axios.isCancel`, race condition | `AxiosDemo.jsx` |
| 5 | NC5 | Spinner, Alert, Card, Form + validate, Modal, Toast | `components/**` |
| 6 | NC6 | Routes lồng nhau, `useParams`, `useNavigate`, `useSearchParams`, 404 | `App.jsx`, `pages/**` |
| 7 | NC7 | json-server, `.env`, `import.meta.env` | `db.json`, `.env` |
| 8 | NC8 | Custom hook `useAxios`, `refetch` | `hooks/useAxios.js` |
| 9 | NC9 | Debounce, `q` trên URL | `hooks/useDebounce.js` |
| 10 | NC10 | `Promise.allSettled` xóa hàng loạt, optimistic update | `pages/PostListPage.jsx` |

### I.2. Luồng dữ liệu sau khi hoàn thành

```
 .env (VITE_API_URL)
        │
        ▼
 api/axiosClient.js ── request interceptor: log, gắn token, ghi giờ bắt đầu
        │              response interceptor: đo thời gian, gắn err.userMessage tiếng Việt
        ▼
 api/postApi.js     ── getAll, getById, getComments, create, update, patch, remove (+ userApi)
        │ (signal)
        ▼
 hooks/useAxios.js  ── loading / data / error / headers / refetch + AbortController
        │
        ▼
 pages/*.jsx        ── PostListPage, PostDetailPage, PostCreatePage, PostEditPage...
        │ props
        ▼
 components/*.jsx   ── react-bootstrap: Card, Table, Form, Modal, Toast...
```

### I.3. Cấu trúc thư mục cuối cùng

```
exercise27/
├── db.json, db.backup.json        # TODO 7
├── .env, .env.example             # TODO 7
└── src/
    ├── main.jsx                   # BrowserRouter + CSS Bootstrap
    ├── App.jsx                    # khai báo routes (TODO 6)
    ├── api/
    │   ├── axiosClient.js         # TODO 2, 7
    │   └── postApi.js             # TODO 2
    ├── hooks/
    │   ├── useAxios.js            # TODO 8
    │   ├── useDebounce.js         # TODO 9
    │   └── useFlash.js            # TODO 6
    ├── components/
    │   ├── Layout.jsx, AppNavbar.jsx, ConfirmModal.jsx, PostForm.jsx
    │   ├── common/  (LoadingSpinner, ErrorAlert, EmptyState, AsyncContent)
    │   └── http/    (PostListCard, CreatePostCard, UpdatePostCard, PatchPostCard,
    │                 DeletePostCard, RequestConfigCard, ResultBox)
    └── pages/
        ├── AxiosDemoPage.jsx, HttpRequestsPage.jsx, NotFoundPage.jsx
        └── PostListPage.jsx, PostDetailPage.jsx, PostCreatePage.jsx, PostEditPage.jsx
```

### I.4. Bốn quy tắc dùng xuyên suốt

1. **Không `.then()`** khi gọi API – chỉ `async/await` + `try/catch/finally` (từ TODO 1).
2. **Component không chứa URL đầy đủ** – chỉ gọi `postApi.xxx()` (từ TODO 2).
3. **Mọi GET trong `useEffect` có `AbortController`** + cleanup `abort()` (từ TODO 4).
4. **POST/PUT/PATCH/DELETE nằm trong event handler**, không nằm trong `useEffect`.

---

## TODO 0 – Chuẩn bị project

**Yêu cầu**
- Có project Exercise 27 đã làm xong **Phần 1 và Phần 2** (7 component: `AxiosDemo`, `PostList`, `CreatePost`, `UpdatePost`, `PatchPost`, `DeletePost`, `RequestConfig`) chạy được với JSONPlaceholder.

**Làm từng bước**

1. Nếu chưa có project:

    ```bash
    npm create vite@latest exercise27 -- --template react
    cd exercise27
    npm install
    npm install axios
    ```

2. Chạy `npm run dev`, mở http://localhost:5173 và xác nhận cả 7 khối hiển thị.

3. Khởi tạo git để mỗi TODO là một commit – dễ quay lại khi lỗi:

    ```bash
    git init
    git add .
    git commit -m "Phần 1-2 hoàn thành"
    ```

**Checklist TODO 0**
- [ ] `npm run dev` chạy, trang hiện đủ 7 khối, không lỗi đỏ trong Console (F12).
- [ ] Hiểu Phần 2: GET có `params`, POST trả `201` + `id: 101`, PUT gửi đủ trường, PATCH gửi một phần, DELETE cập nhật giao diện bằng `filter`.

---

## TODO 1 – NC1: Chuyển sang async/await

**Yêu cầu**
1. Viết lại **tất cả** 7 component Phần 1–2 bằng `async/await` + `try/catch/finally`, bỏ hoàn toàn `.then()/.catch()/.finally()`.
2. Không truyền hàm async trực tiếp vào `useEffect`: khai báo hàm async **bên trong** rồi gọi.
3. Thêm state `loading` cho các component GET; tắt `loading` trong `finally`.
4. Hàm xử lý sự kiện gửi POST/PUT/PATCH/DELETE (`handleSubmit`, `handleUpdate`...) cũng viết dạng `async`.

**Lý thuyết cần nắm**

| Promise chain | async/await |
|---|---|
| `axios.get(url).then(res => ...)` | `const res = await axios.get(url)` |
| `.catch(err => ...)` | `try { ... } catch (err) { ... }` |
| `.finally(() => ...)` | `finally { ... }` |

- `async` biến hàm thành hàm **luôn trả về Promise**. `await` tạm dừng hàm đó (không chặn trình duyệt) tới khi Promise xong.
- `finally` **luôn chạy** dù thành công hay lỗi → nơi tắt `loading`/`submitting`.
- Vì sao **không** viết `useEffect(async () => {...})`? `useEffect` chỉ chấp nhận callback trả về **hàm cleanup** hoặc `undefined`. Hàm async trả về Promise → React báo cảnh báo và cleanup không bao giờ chạy.

```jsx
// ❌ Sai
useEffect(async () => {
  const res = await axios.get(url);
}, []);

// ✅ Đúng
useEffect(() => {
  const fetchData = async () => {
    try { const res = await axios.get(url); setData(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  fetchData();
}, []);
```

**Làm từng bước**

1. `src/AxiosDemo.jsx` – thêm state `loading`, chuyển sang async/await:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    const AxiosDemo = () => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        // KHÔNG viết useEffect(async () => ...) – khai báo hàm async bên trong rồi gọi
        const fetchPost = async () => {
          try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
            setData(response.data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false); // luôn chạy, dù thành công hay lỗi
          }
        };

        fetchPost();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h1>Axios Demo</h1>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </div>
      );
    };

    export default AxiosDemo;
    ```

2. `src/PostList.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    const PostList = () => {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
              params: { userId: 1, _limit: 5 }, // → /posts?userId=1&_limit=5
            });
            setPosts(response.data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchPosts();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h2>GET – Danh sách bài viết của user 1</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>#{post.id} – {post.title}</li>
            ))}
          </ul>
        </div>
      );
    };

    export default PostList;
    ```

3. `src/CreatePost.jsx` – event handler `async`:

    ```jsx
    import { useState } from 'react';
    import axios from 'axios';

    const CreatePost = () => {
      const [title, setTitle] = useState('');
      const [body, setBody] = useState('');
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [submitting, setSubmitting] = useState(false);

      // Event handler cũng có thể là hàm async
      const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            title,
            body,
            userId: 1,
          });
          setResult({ status: response.status, data: response.data });
          setTitle('');
          setBody('');
        } catch (err) {
          setError(err.message);
        } finally {
          setSubmitting(false);
        }
      };

      return (
        <div>
          <h2>POST – Tạo bài viết</h2>
          <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <br />
            <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} required />
            <br />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Tạo bài viết'}
            </button>
          </form>

          {error && <div>Error: {error}</div>}
          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default CreatePost;
    ```

4. `src/UpdatePost.jsx` – GET trong `useEffect`, PUT trong handler; thêm `saving` để disable nút:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    const URL = 'https://jsonplaceholder.typicode.com/posts/1';

    const UpdatePost = () => {
      const [post, setPost] = useState(null);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);

      // 1. GET dữ liệu cũ đổ vào form
      useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await axios.get(URL);
            setPost(response.data);
          } catch (err) {
            setError(err.message);
          }
        };
        fetchPost();
      }, []);

      // 2. PUT gửi ĐẦY ĐỦ các trường
      const handleUpdate = async () => {
        setSaving(true);
        setError(null);
        try {
          const response = await axios.put(URL, {
            id: post.id,
            userId: post.userId,
            title: post.title,
            body: post.body,
          });
          setResult({ status: response.status, data: response.data });
        } catch (err) {
          setError(err.message);
        } finally {
          setSaving(false);
        }
      };

      if (error) return <div>Error: {error}</div>;
      if (!post) return <div>Loading...</div>;

      return (
        <div>
          <h2>PUT – Cập nhật bài viết #{post.id}</h2>
          <input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          <br />
          <textarea value={post.body} onChange={(e) => setPost({ ...post, body: e.target.value })} />
          <br />
          <button onClick={handleUpdate} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật (PUT)'}
          </button>

          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default UpdatePost;
    ```

5. `src/PatchPost.jsx`:

    ```jsx
    import { useState } from 'react';
    import axios from 'axios';

    const PatchPost = () => {
      const [title, setTitle] = useState('');
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);

      const handlePatch = async () => {
        setSaving(true);
        setError(null);
        try {
          // PATCH chỉ gửi trường thay đổi
          const response = await axios.patch('https://jsonplaceholder.typicode.com/posts/1', { title });
          setResult({ status: response.status, data: response.data });
        } catch (err) {
          setError(err.message);
        } finally {
          setSaving(false);
        }
      };

      return (
        <div>
          <h2>PATCH – Sửa tiêu đề bài viết #1</h2>
          <input placeholder="Tiêu đề mới" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={handlePatch} disabled={!title.trim() || saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật (PATCH)'}
          </button>

          {error && <div>Error: {error}</div>}
          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default PatchPost;
    ```

6. `src/DeletePost.jsx` – dùng `setPosts((prev) => ...)` (dạng hàm) để luôn lọc trên danh sách mới nhất:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    const API = 'https://jsonplaceholder.typicode.com/posts';

    const DeletePost = () => {
      const [posts, setPosts] = useState([]);
      const [message, setMessage] = useState('');
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get(API, { params: { _limit: 5 } });
            setPosts(response.data);
          } catch (err) {
            setError(err.message);
          }
        };
        fetchPosts();
      }, []);

      const handleDelete = async (id) => {
        if (!window.confirm(`Xóa bài viết #${id}?`)) return; // NC5 sẽ thay bằng Modal
        try {
          const response = await axios.delete(`${API}/${id}`);
          setPosts((prev) => prev.filter((p) => p.id !== id)); // cập nhật giao diện
          setMessage(`Đã xóa bài #${id} – Status: ${response.status}`);
        } catch (err) {
          setError(err.message);
        }
      };

      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h2>DELETE – Xóa bài viết</h2>
          {message && <p>{message}</p>}
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                #{post.id} – {post.title} <button onClick={() => handleDelete(post.id)}>Xóa</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default DeletePost;
    ```

7. `src/RequestConfig.jsx` – phân loại lỗi trong `catch` giống bản gốc:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';

    const RequestConfig = () => {
      const [info, setInfo] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchWithConfig = async () => {
          try {
            const response = await axios({
              method: 'get',
              url: 'https://jsonplaceholder.typicode.com/posts',
              params: { _page: 1, _limit: 3 },
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer demo-token-123',
              },
              timeout: 5000,
            });
            setInfo({
              status: response.status,
              contentType: response.headers['content-type'],
              total: response.headers['x-total-count'],
              data: response.data,
            });
          } catch (err) {
            if (err.code === 'ECONNABORTED') setError('Request quá thời gian (timeout)');
            else if (err.response) setError(`Server trả lỗi ${err.response.status}`);
            else setError(err.message);
          }
        };
        fetchWithConfig();
      }, []);

      if (error) return <div>Error: {error}</div>;
      if (!info) return <div>Loading...</div>;

      return (
        <div>
          <h2>Cấu hình request</h2>
          <p>Status: {info.status}</p>
          <p>Content-Type: {info.contentType}</p>
          <p>Tổng số bài viết (x-total-count): {info.total}</p>
          <ul>
            {info.data.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        </div>
      );
    };

    export default RequestConfig;
    ```

8. `src/App.jsx` giữ nguyên như Phần 2 (render 7 component, ngăn cách bằng `<hr />`).

**Checklist TODO 1**
- [ ] Ctrl+Shift+F tìm `.then(` trong `src/` → **0 kết quả**.
- [ ] Không có `useEffect(async`.
- [ ] Mọi `try` đều có `catch`; component GET có `finally { setLoading(false) }`.
- [ ] Kết quả hiển thị y như trước khi sửa (POST vẫn `201`, `id: 101`).
- [ ] Thử tắt mạng (DevTools → Network → **Offline**) rồi F5 → các khối hiện `Error: Network Error`, không trắng trang.

---

## TODO 2 – NC2: axios instance, interceptors và tầng service

**Yêu cầu**
1. Tạo `src/api/axiosClient.js` bằng `axios.create({ baseURL, timeout, headers })`. Mọi component dùng `axiosClient` (qua service), **không** viết URL đầy đủ.
2. **Request interceptor:** log `method + url` ra console; gắn `Authorization: Bearer <token>` nếu `localStorage` có `token`.
3. **Response interceptor:** đo thời gian xử lý mỗi request (ms); chuyển lỗi thành câu tiếng Việt: 404 → "Không tìm thấy", mất mạng → "Không kết nối được server", 5xx → "Máy chủ lỗi".
4. Tách hàm gọi API ra `src/api/postApi.js`: `getAll`, `getById`, `create`, `update`, `patch`, `remove`.

**Lý thuyết cần nắm**

```
component ─► postApi.getAll() ─► axiosClient ─► [request interceptor] ─► server
component ◄─ res / err.userMessage ◄─ [response interceptor] ◄──────────── server
```

- **Instance:** một "bản sao" axios có cấu hình riêng. Đổi server chỉ sửa **1 dòng** `baseURL`.
- **Interceptor** là hàm chạy **trước mọi request** / **sau mọi response** → nơi đặt logic dùng chung (log, token, đo giờ, xử lý lỗi) thay vì lặp ở từng component.
- Đo thời gian: request interceptor ghi `config.metadata = { start: performance.now() }`; response interceptor lấy `performance.now() - start`. `config` đi kèm response nên đọc lại được.
- Phân loại lỗi axios:

| Điều kiện | Ý nghĩa |
|---|---|
| `axios.isCancel(err)` | Request bị hủy chủ động (TODO 4) – **không phải lỗi** |
| `err.code === 'ECONNABORTED'` | Quá `timeout` |
| `err.response` có giá trị | Server trả về 4xx/5xx – đọc `err.response.status` |
| `err.request` có, `err.response` không | Gửi đi nhưng không nhận được gì – mất mạng / server tắt |

- Interceptor **không** biến lỗi thành object khác, mà gắn thêm `err.userMessage` rồi `Promise.reject(error)` → lỗi hủy vẫn nhận ra được bằng `axios.isCancel`, component chỉ cần đọc `err.userMessage`.
- **Tầng service** (`postApi`): component chỉ biết "lấy danh sách bài viết", không biết URL/method. Mỗi hàm nhận thêm `signal` để dùng cho TODO 4.

**Làm từng bước**

1. Tạo `src/api/axiosClient.js` (tạm thời `baseURL` là JSONPlaceholder, TODO 7 sẽ đổi sang biến môi trường):

    ```js
    import axios from "axios";

    // NC2 – axios instance dùng chung
    const axiosClient = axios.create({
      baseURL: "https://jsonplaceholder.typicode.com", // NC7 sẽ đổi sang biến môi trường
      timeout: 8000,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    // Thông báo lỗi thân thiện
    export function getErrorMessage(err) {
      if (err.code === "ECONNABORTED") return "Kết nối quá chậm (timeout)";
      if (err.response) {
        const { status } = err.response;
        if (status === 404) return "Không tìm thấy dữ liệu (404)";
        if (status >= 500) return `Máy chủ lỗi (${status})`;
        return `Yêu cầu không hợp lệ (${status})`;
      }
      if (err.request) return "Không kết nối được server";
      return err.message;
    }

    // Interceptor REQUEST: log + đo thời gian + gắn header
    axiosClient.interceptors.request.use((config) => {
      config.metadata = { start: performance.now() };
      // Ví dụ header xác thực (JSONPlaceholder bỏ qua, nhưng thấy được trong tab Network)
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`, config.params ?? "", config.data ?? "");
      return config;
    });

    // Interceptor RESPONSE: thời gian xử lý + chuẩn hóa lỗi
    axiosClient.interceptors.response.use(
      (response) => {
        response.duration = Math.round(performance.now() - response.config.metadata.start);
        console.log(`✅ ${response.status} ${response.config.url} (${response.duration}ms)`);
        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.log("🚫 Canceled", error.config?.url);
        } else {
          error.userMessage = getErrorMessage(error);
          console.warn("❌", error.config?.url, error.userMessage);
        }
        return Promise.reject(error);
      }
    );

    export default axiosClient;
    ```

2. Tạo `src/api/postApi.js` – mỗi HTTP method một hàm; thêm `getComments` và `userApi` dùng cho TODO 3:

    ```js
    import axiosClient from "./axiosClient";

    // NC2 – Tầng service: mỗi HTTP method một hàm
    const postApi = {
      // GET – danh sách (có query params: _page, _limit, userId...)
      getAll: (params = {}, signal) => axiosClient.get("/posts", { params, signal }),
      // GET – một bản ghi
      getById: (id, signal) => axiosClient.get(`/posts/${id}`, { signal }),
      // GET – tài nguyên lồng nhau
      getComments: (id, signal) => axiosClient.get(`/posts/${id}/comments`, { signal }),
      // POST – tạo mới (server trả 201 + object có id)
      create: (data) => axiosClient.post("/posts", data),
      // PUT – thay TOÀN BỘ object
      update: (id, data) => axiosClient.put(`/posts/${id}`, data),
      // PATCH – sửa MỘT PHẦN
      patch: (id, partial) => axiosClient.patch(`/posts/${id}`, partial),
      // DELETE – xóa
      remove: (id) => axiosClient.delete(`/posts/${id}`),
    };

    export const userApi = {
      getAll: (signal) => axiosClient.get("/users", { signal }),
      getById: (id, signal) => axiosClient.get(`/users/${id}`, { signal }),
    };

    export default postApi;
    ```

3. Sửa 7 component: bỏ `import axios`, thay URL đầy đủ bằng hàm service, đọc lỗi bằng `err.userMessage`.

    | Trước (TODO 1) | Sau (TODO 2) |
    |---|---|
    | `axios.get('https://.../posts/1')` | `postApi.getById(1)` |
    | `axios.get('https://.../posts', { params })` | `postApi.getAll(params)` |
    | `axios.post('https://.../posts', data)` | `postApi.create(data)` |
    | `axios.put(URL, data)` | `postApi.update(id, data)` |
    | `axios.patch(URL, { title })` | `postApi.patch(id, { title })` |
    | `axios.delete(\`${API}/${id}\`)` | `postApi.remove(id)` |
    | `axios({ url: 'https://.../posts', ... })` | `axiosClient({ url: '/posts', ... })` |
    | `setError(err.message)` | `setError(err.userMessage)` |

    `src/AxiosDemo.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi from './api/postApi';

    const AxiosDemo = () => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPost = async () => {
          try {
            const res = await postApi.getById(1); // không còn URL đầy đủ trong component
            setData(res.data);
          } catch (err) {
            setError(err.userMessage); // câu tiếng Việt do interceptor gắn vào
          } finally {
            setLoading(false);
          }
        };
        fetchPost();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h1>Axios Demo</h1>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </div>
      );
    };

    export default AxiosDemo;
    ```

    `src/PostList.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi from './api/postApi';

    const PostList = () => {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const res = await postApi.getAll({ userId: 1, _limit: 5 });
            setPosts(res.data);
          } catch (err) {
            setError(err.userMessage);
          } finally {
            setLoading(false);
          }
        };
        fetchPosts();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h2>GET – Danh sách bài viết của user 1</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>#{post.id} – {post.title}</li>
            ))}
          </ul>
        </div>
      );
    };

    export default PostList;
    ```

    `src/CreatePost.jsx`:

    ```jsx
    import { useState } from 'react';
    import postApi from './api/postApi';

    const CreatePost = () => {
      const [title, setTitle] = useState('');
      const [body, setBody] = useState('');
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [submitting, setSubmitting] = useState(false);

      // Event handler cũng có thể là hàm async
      const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const response = await postApi.create({
            title,
            body,
            userId: 1,
          });
          setResult({ status: response.status, data: response.data });
          setTitle('');
          setBody('');
        } catch (err) {
          setError(err.userMessage);
        } finally {
          setSubmitting(false);
        }
      };

      return (
        <div>
          <h2>POST – Tạo bài viết</h2>
          <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <br />
            <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} required />
            <br />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Tạo bài viết'}
            </button>
          </form>

          {error && <div>Error: {error}</div>}
          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default CreatePost;
    ```

    `src/UpdatePost.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi from './api/postApi';

    const POST_ID = 1;

    const UpdatePost = () => {
      const [post, setPost] = useState(null);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);

      // 1. GET dữ liệu cũ đổ vào form
      useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await postApi.getById(POST_ID);
            setPost(response.data);
          } catch (err) {
            setError(err.userMessage);
          }
        };
        fetchPost();
      }, []);

      // 2. PUT gửi ĐẦY ĐỦ các trường
      const handleUpdate = async () => {
        setSaving(true);
        setError(null);
        try {
          const response = await postApi.update(POST_ID, {
            id: post.id,
            userId: post.userId,
            title: post.title,
            body: post.body,
          });
          setResult({ status: response.status, data: response.data });
        } catch (err) {
          setError(err.userMessage);
        } finally {
          setSaving(false);
        }
      };

      if (error) return <div>Error: {error}</div>;
      if (!post) return <div>Loading...</div>;

      return (
        <div>
          <h2>PUT – Cập nhật bài viết #{post.id}</h2>
          <input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          <br />
          <textarea value={post.body} onChange={(e) => setPost({ ...post, body: e.target.value })} />
          <br />
          <button onClick={handleUpdate} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật (PUT)'}
          </button>

          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default UpdatePost;
    ```

    `src/PatchPost.jsx`:

    ```jsx
    import { useState } from 'react';
    import postApi from './api/postApi';

    const PatchPost = () => {
      const [title, setTitle] = useState('');
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);

      const handlePatch = async () => {
        setSaving(true);
        setError(null);
        try {
          // PATCH chỉ gửi trường thay đổi
          const response = await postApi.patch(1, { title });
          setResult({ status: response.status, data: response.data });
        } catch (err) {
          setError(err.userMessage);
        } finally {
          setSaving(false);
        }
      };

      return (
        <div>
          <h2>PATCH – Sửa tiêu đề bài viết #1</h2>
          <input placeholder="Tiêu đề mới" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={handlePatch} disabled={!title.trim() || saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật (PATCH)'}
          </button>

          {error && <div>Error: {error}</div>}
          {result && (
            <div>
              <p>Status: {result.status}</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    };

    export default PatchPost;
    ```

    `src/DeletePost.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi from './api/postApi';

    const DeletePost = () => {
      const [posts, setPosts] = useState([]);
      const [message, setMessage] = useState('');
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await postApi.getAll({ _limit: 5 });
            setPosts(response.data);
          } catch (err) {
            setError(err.userMessage);
          }
        };
        fetchPosts();
      }, []);

      const handleDelete = async (id) => {
        if (!window.confirm(`Xóa bài viết #${id}?`)) return; // NC5 sẽ thay bằng Modal
        try {
          const response = await postApi.remove(id);
          setPosts((prev) => prev.filter((p) => p.id !== id)); // cập nhật giao diện
          setMessage(`Đã xóa bài #${id} – Status: ${response.status}`);
        } catch (err) {
          setError(err.userMessage);
        }
      };

      if (error) return <div>Error: {error}</div>;

      return (
        <div>
          <h2>DELETE – Xóa bài viết</h2>
          {message && <p>{message}</p>}
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                #{post.id} – {post.title} <button onClick={() => handleDelete(post.id)}>Xóa</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default DeletePost;
    ```

    `src/RequestConfig.jsx` – dùng `axiosClient(config)` với URL tương đối; `res.duration` do interceptor tính:

    ```jsx
    import { useState, useEffect } from 'react';
    import axiosClient from './api/axiosClient';

    const RequestConfig = () => {
      const [info, setInfo] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchWithConfig = async () => {
          try {
            // axiosClient(config): url tương đối, baseURL lấy từ instance
            const res = await axiosClient({
              method: 'get',
              url: '/posts',
              params: { _page: 1, _limit: 3 },
              headers: { Accept: 'application/json', 'X-Client': 'FER202' },
              timeout: 5000, // ghi đè timeout 8000 của instance cho riêng request này
            });
            setInfo({
              status: res.status,
              duration: res.duration, // do response interceptor tính
              contentType: res.headers['content-type'],
              total: res.headers['x-total-count'],
              data: res.data,
            });
          } catch (err) {
            setError(err.userMessage);
          }
        };
        fetchWithConfig();
      }, []);

      if (error) return <div>Error: {error}</div>;
      if (!info) return <div>Loading...</div>;

      return (
        <div>
          <h2>Cấu hình request</h2>
          <p>Status: {info.status} · {info.duration} ms</p>
          <p>Content-Type: {info.contentType}</p>
          <p>Tổng số bài viết (x-total-count): {info.total}</p>
          <ul>
            {info.data.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        </div>
      );
    };

    export default RequestConfig;
    ```

4. Thử header token: mở Console trình duyệt, gõ `localStorage.setItem('token', 'abc123')` rồi F5.

**Checklist TODO 2**
- [ ] Tìm `jsonplaceholder` trong `src/` → chỉ còn trong `axiosClient.js`.
- [ ] Tìm `from 'axios'` / `from "axios"` → chỉ còn trong `axiosClient.js`.
- [ ] Console hiện log `➡️ GET /posts/1` và `✅ 200 /posts/1 (… ms)` cho mỗi request.
- [ ] Sau khi đặt `token`: Network → chọn request → **Request Headers** có `Authorization: Bearer abc123`.
- [ ] Sửa tạm `getById` thành `/postsX/${id}` → AxiosDemo hiện "Không tìm thấy dữ liệu (404)". Khôi phục lại.
- [ ] Network → Offline → F5 → hiện "Không kết nối được server".
- [ ] RequestConfig hiện thêm thời gian (ms).

---

## TODO 3 – NC3: Nhiều request cùng lúc

**Yêu cầu**
1. Tạo component `PostDetail`: lấy bài viết, **sau đó** lấy **song song** tác giả (`/users/:userId`) và bình luận (`/posts/:id/comments`) bằng `Promise.all`.
2. Đo và so sánh thời gian gọi **tuần tự** với gọi **song song**.
3. Đổi sang `Promise.allSettled` để nếu phần bình luận lỗi thì **vẫn hiển thị** bài viết và tác giả.

**Lý thuyết cần nắm**

```
Tuần tự  : |-- post --|-- user --|-- comments --|          ≈ t1 + t2 + t3
Kết hợp  : |-- post --|-- user -----|                      ≈ t1 + max(t2, t3)
                      |-- comments -|
```

- Bước 1 **phải** tuần tự: chưa có `post` thì chưa biết `post.userId`.
- Bước 2 song song: `user` và `comments` **không phụ thuộc nhau**.
- `Promise.all([p1, p2])` khởi động 2 request **cùng lúc**, chờ cả hai; kết quả theo đúng thứ tự mảng.

| | `Promise.all` | `Promise.allSettled` |
|---|---|---|
| 1 request lỗi | Cả nhóm lỗi ngay → nhảy vào `catch` | Không ném lỗi, chờ tất cả |
| Kết quả | `[res1, res2]` | `[{ status: 'fulfilled', value }, { status: 'rejected', reason }]` |
| Dùng khi | Thiếu 1 phần thì vô nghĩa | Các phần độc lập, lỗi phụ vẫn hiện phần chính |

**Làm từng bước**

1. Tạo `src/PostDetail.jsx` – **phiên bản 1** dùng `Promise.all`:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi, { userApi } from './api/postApi';

    // Phiên bản 1 – Promise.all: 1 request lỗi → cả nhóm lỗi
    const PostDetail = ({ postId = 1 }) => {
      const [detail, setDetail] = useState(null); // { post, author, comments }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const loadDetail = async () => {
          setLoading(true);
          setError(null);
          try {
            // Bước 1 – TUẦN TỰ: phải có post mới biết userId của tác giả
            const { data: post } = await postApi.getById(postId);

            // Bước 2 – SONG SONG: tác giả và bình luận không phụ thuộc nhau
            const [userRes, commentsRes] = await Promise.all([
              userApi.getById(post.userId),
              postApi.getComments(postId),
            ]);

            setDetail({ post, author: userRes.data, comments: commentsRes.data });
          } catch (err) {
            setError(err.userMessage);
          } finally {
            setLoading(false);
          }
        };
        loadDetail();
      }, [postId]);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      const { post, author, comments } = detail;
      return (
        <div>
          <h2>{post.title}</h2>
          <p>
            Tác giả: <strong>{author.name}</strong> ({author.email})
          </p>
          <p>{post.body}</p>
          <h3>Bình luận ({comments.length})</h3>
          <ul>
            {comments.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>: {c.body}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default PostDetail;
    ```

2. Thêm vào `App.jsx`:

    ```jsx
    import PostDetail from './PostDetail';
    // ...
    <hr />
    <PostDetail postId={1} />
    ```

3. **Thử nhược điểm của `Promise.all`:** sửa tạm `getComments` trong `postApi.js` thành `/postsX/${id}/comments` → **cả** khối PostDetail báo lỗi, dù bài viết và tác giả lấy được. Khôi phục lại.

4. **Phiên bản 2** – thay toàn bộ `src/PostDetail.jsx`: dùng `Promise.allSettled` và thêm nút **Đo thời gian**:

    ```jsx
    import { useState, useEffect } from 'react';
    import postApi, { userApi } from './api/postApi';

    // NC3.2 – Đo thời gian: tuần tự (3 await nối tiếp) và song song (1 await + Promise.all)
    const measure = async (id) => {
      let t0 = performance.now();
      const { data: p1 } = await postApi.getById(id);
      await userApi.getById(p1.userId);
      await postApi.getComments(id);
      const sequential = Math.round(performance.now() - t0);

      t0 = performance.now();
      const { data: p2 } = await postApi.getById(id);
      await Promise.all([userApi.getById(p2.userId), postApi.getComments(id)]);
      const parallel = Math.round(performance.now() - t0);

      return { sequential, parallel };
    };

    // Phiên bản 2 – Promise.allSettled: bình luận lỗi vẫn hiện bài viết + tác giả
    const PostDetail = ({ postId = 1 }) => {
      const [detail, setDetail] = useState(null); // { post, author, comments, warning }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [timing, setTiming] = useState(null);

      useEffect(() => {
        const loadDetail = async () => {
          setLoading(true);
          setError(null);
          try {
            // Bước 1 – bắt buộc: lỗi ở đây là lỗi cả trang
            const { data: post } = await postApi.getById(postId);

            // Bước 2 – phần phụ: allSettled KHÔNG ném lỗi, trả kết quả từng request
            const [userResult, commentsResult] = await Promise.allSettled([
              userApi.getById(post.userId),
              postApi.getComments(postId),
            ]);

            setDetail({
              post,
              author: userResult.status === 'fulfilled' ? userResult.value.data : null,
              comments: commentsResult.status === 'fulfilled' ? commentsResult.value.data : [],
              warning: [userResult, commentsResult].some((r) => r.status === 'rejected')
                ? 'Một số thông tin phụ (tác giả / bình luận) không tải được.'
                : null,
            });
          } catch (err) {
            setError(err.userMessage);
          } finally {
            setLoading(false);
          }
        };
        loadDetail();
      }, [postId]);

      const handleMeasure = async () => {
        try {
          setTiming(await measure(postId));
        } catch (err) {
          setError(err.userMessage);
        }
      };

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      const { post, author, comments, warning } = detail;
      return (
        <div>
          {warning && <p style={{ color: 'orange' }}>⚠ {warning}</p>}
          <h2>{post.title}</h2>
          <p>
            Tác giả: <strong>{author?.name ?? `User ${post.userId}`}</strong>
            {author && ` (${author.email})`}
          </p>
          <p>{post.body}</p>

          <button onClick={handleMeasure}>Đo thời gian</button>
          {timing && (
            <p>
              Tuần tự: {timing.sequential} ms | Song song: {timing.parallel} ms
            </p>
          )}

          <h3>Bình luận ({comments.length})</h3>
          <ul>
            {comments.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>: {c.body}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default PostDetail;
    ```

5. Đo thời gian: DevTools → Network → **Throttling: Fast 4G** hoặc **Slow 4G** (để số liệu rõ hơn) → bấm **Đo thời gian** 3 lần, ghi lại kết quả.

**Checklist TODO 3**
- [ ] Tab Network: request `/users/1` và `/posts/1/comments` **bắt đầu cùng lúc** (cột Waterfall thẳng hàng), sau request `/posts/1`.
- [ ] Nút **Đo thời gian**: số "Song song" nhỏ hơn "Tuần tự".
- [ ] Phiên bản 2: sửa tạm URL bình luận sai → bài viết + tác giả **vẫn hiện**, có dòng cảnh báo màu cam, "Bình luận (0)".
- [ ] Sửa tạm URL bài viết sai → cả khối báo lỗi (bước 1 là bắt buộc).
- [ ] Giải thích được: vì sao bước 1 không đưa vào `Promise.all` cùng 2 request kia?

---

## TODO 4 – NC4: Chọn id và hủy request (AbortController)

**Yêu cầu**
1. `AxiosDemo` có ô nhập **Post ID** (1–100). Đổi id thì gọi lại API (`useEffect` deps `[postId]`).
2. Dùng `AbortController`, truyền `signal` cho axios, gọi `abort()` trong **cleanup** của `useEffect`.
3. Trong `catch`, bỏ qua lỗi hủy bằng `axios.isCancel(error)`.
4. Kiểm tra: bật **Slow 3G**, đổi id thật nhanh → request cũ hiện *(canceled)*, màn hình chỉ hiển thị bài cuối cùng.

**Lý thuyết cần nắm – race condition**

```
Gõ id = 1  → request A (chậm, 900ms) ──────────────────────► về SAU → ghi đè bài 12 bằng bài 1 ✗
Gõ id = 12 → request B (nhanh, 300ms) ───────► về TRƯỚC
```

- Response **không** về theo thứ tự gửi. Không hủy request cũ thì dữ liệu cũ có thể ghi đè dữ liệu mới.
- **Cleanup** của `useEffect` chạy **trước** lần effect kế tiếp và khi component unmount → chỗ lý tưởng để `controller.abort()`.
- Request bị hủy ném `CanceledError` → `axios.isCancel(err)` = `true` → `return`, **không** hiện lỗi, **không** tắt loading (request mới đang chạy).
- StrictMode (dev) chạy effect 2 lần khi mới vào: thấy 1 request *(canceled)* + 1 request thành công là **bình thường** – chứng tỏ cleanup hoạt động.

**Làm từng bước**

1. Thay toàn bộ `src/AxiosDemo.jsx`:

    ```jsx
    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import postApi from './api/postApi';

    const AxiosDemo = () => {
      const [postId, setPostId] = useState(1);
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        // 1. Mỗi lần effect chạy (postId đổi) tạo một controller MỚI
        const controller = new AbortController();

        const fetchPost = async () => {
          setLoading(true);
          setError(null);
          try {
            // 2. Truyền signal cho axios
            const res = await postApi.getById(postId, controller.signal);
            setData(res.data);
          } catch (err) {
            // 3. Request bị hủy → không phải lỗi, bỏ qua
            if (axios.isCancel(err)) return;
            setData(null);
            setError(err.userMessage ?? err.message);
          } finally {
            // Request đã bị hủy thì request mới đang chạy → không tắt loading
            if (!controller.signal.aborted) setLoading(false);
          }
        };

        fetchPost();

        // 4. Cleanup: chạy TRƯỚC lần effect kế tiếp và khi unmount → hủy request cũ
        return () => controller.abort();
      }, [postId]);

      return (
        <div>
          <h1>Axios Demo</h1>
          <label>
            Post ID (1–100):{' '}
            <input
              type="number"
              min={1}
              max={100}
              value={postId}
              onChange={(e) => setPostId(Number(e.target.value) || 1)}
            />
          </label>{' '}
          <button onClick={() => setPostId((id) => Math.max(1, id - 1))}>‹ Trước</button>{' '}
          <button onClick={() => setPostId((id) => id + 1)}>Sau ›</button>

          {loading && <div>Loading...</div>}
          {!loading && error && <div>Error: {error}</div>}
          {!loading && data && (
            <div>
              <h2>
                #{data.id} – {data.title}
              </h2>
              <p>{data.body}</p>
            </div>
          )}
        </div>
      );
    };

    export default AxiosDemo;
    ```

2. Service đã nhận `signal` từ TODO 2: `getById: (id, signal) => axiosClient.get(\`/posts/${id}\`, { signal })`.

3. Component import lại `axios` **chỉ để dùng `axios.isCancel`** – vẫn không gọi `axios.get(...)` trực tiếp, mọi request vẫn đi qua `postApi`.

**Checklist TODO 4**
- [ ] Gõ id 5 → hiện bài #5; bấm "Sau ›" → bài #6.
- [ ] Gõ id 999 → "Không tìm thấy dữ liệu (404)".
- [ ] Network → **Slow 3G** → bấm "Sau ›" liên tục 4 lần → 3 request đầu *(canceled)*, chỉ request cuối thành công, màn hình hiện đúng bài cuối, **không** có dòng Error.
- [ ] Console hiện `🚫 Canceled /posts/…` cho các request bị hủy (log của interceptor).
- [ ] Mới vào trang thấy 1 request *(canceled)* (do StrictMode) – giải thích được lý do.

---

## TODO 5 – NC5: Giao diện bằng react-bootstrap

**Yêu cầu**
1. Cài `react-bootstrap bootstrap`, import CSS Bootstrap **một lần** trong `main.jsx`.
2. Loading → `Spinner`; Error → `Alert variant="danger"`; dữ liệu → `Card` / `Table` / `ListGroup`.
3. Form POST/PUT dùng `Form`, `Form.Control`, có kiểm tra dữ liệu bằng `isInvalid` + `Form.Control.Feedback`: **title ≥ 5 ký tự, body ≥ 10 ký tự**.
4. Xác nhận xóa bằng `Modal` thay `window.confirm`; thông báo kết quả bằng `Toast`.

**Lý thuyết cần nắm**
- Mỗi khối dữ liệu có **4 trạng thái**: loading → error → empty (rỗng) → success. Tách 3 component dùng chung `LoadingSpinner`, `ErrorAlert`, `EmptyState` để không lặp JSX.
- `noValidate` trên `<Form>` tắt kiểm tra mặc định của trình duyệt → dùng giao diện lỗi của Bootstrap.
- `Form.Control.Feedback type="invalid"` chỉ hiện khi ô liền trước có `isInvalid={true}`.
- `Modal` điều khiển bằng state: `toDelete = null` → ẩn; `toDelete = post` → hiện. Khi đang xóa (`loading`) không cho đóng modal.
- `Toast` có `autohide` + `delay` tự ẩn; đặt trong `ToastContainer position="bottom-end"`.

**Làm từng bước**

1. Cài thư viện:

    ```bash
    npm install react-bootstrap bootstrap
    ```

2. `src/main.jsx`:

    ```jsx
    import { StrictMode } from 'react';
    import { createRoot } from 'react-dom/client';
    import 'bootstrap/dist/css/bootstrap.min.css'; // import CSS Bootstrap MỘT lần ở đây
    import App from './App.jsx';

    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    ```

3. Tạo thư mục `src/components/common`, `src/components/http`. Component dùng chung:

    `src/components/common/LoadingSpinner.jsx`:

    ```jsx
    import { Spinner } from "react-bootstrap";

    export default function LoadingSpinner({ text = "Đang tải dữ liệu..." }) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">{text}</p>
        </div>
      );
    }
    ```

    `src/components/common/ErrorAlert.jsx` (nút Thử lại dùng ở TODO 8):

    ```jsx
    import { Alert, Button } from "react-bootstrap";

    export default function ErrorAlert({ message, onRetry }) {
      return (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <span>❌ {message}</span>
          {onRetry && (
            <Button variant="outline-danger" size="sm" onClick={onRetry}>Thử lại</Button>
          )}
        </Alert>
      );
    }
    ```

    `src/components/common/EmptyState.jsx`:

    ```jsx
    import { Alert } from "react-bootstrap";

    export default function EmptyState({ text = "Không có dữ liệu." }) {
      return <Alert variant="info">{text}</Alert>;
    }
    ```

    `src/components/ConfirmModal.jsx`:

    ```jsx
    import { Modal, Button, Spinner } from "react-bootstrap";

    export default function ConfirmModal({ show, title, message, confirmText = "Xác nhận", loading, onConfirm, onCancel }) {
      return (
        <Modal show={show} onHide={loading ? undefined : onCancel} centered>
          <Modal.Header closeButton={!loading}><Modal.Title>{title}</Modal.Title></Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCancel} disabled={loading}>Hủy</Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? <><Spinner size="sm" /> Đang xử lý...</> : confirmText}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    ```

    `src/components/http/ResultBox.jsx` – hiện status + JSON trả về (dùng cho POST/PUT/PATCH):

    ```jsx
    import { Badge } from "react-bootstrap";

    // Hiển thị status + JSON response
    export default function ResultBox({ result }) {
      if (!result) return null;
      return (
        <div className="mt-3">
          <div className="small mb-1">
            Status <Badge bg={result.status < 300 ? "success" : "danger"}>{result.status}</Badge>
            {result.duration != null && <span className="text-muted"> · {result.duration} ms</span>}
          </div>
          <pre className="bg-light p-2 small mb-0" style={{ maxHeight: 220, overflow: "auto" }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      );
    }
    ```

4. Chuyển 6 component của Phần 2 thành dạng **Card** trong `src/components/http/` (đổi tên có hậu tố `Card`). Từ bước này mọi GET đều có `AbortController` như TODO 4.

    `PostListCard.jsx` (2.1 – GET):

    ```jsx
    // 2.1 – GET có params · NC5: Card + ListGroup + Spinner + Alert
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, ListGroup } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import LoadingSpinner from "../common/LoadingSpinner";
    import ErrorAlert from "../common/ErrorAlert";
    import EmptyState from "../common/EmptyState";

    export default function PostListCard() {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await postApi.getAll({ userId: 1, _limit: 5 }, controller.signal);
            setPosts(res.data);
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.1 · GET</strong> /posts?userId=1&amp;_limit=5</Card.Header>
          <Card.Body>
            {loading && <LoadingSpinner />}
            {!loading && error && <ErrorAlert message={error} />}
            {!loading && !error && posts.length === 0 && <EmptyState text="Không có bài viết" />}
            {!loading && !error && posts.length > 0 && (
              <ListGroup variant="flush">
                {posts.map((p) => <ListGroup.Item key={p.id}>#{p.id} – {p.title}</ListGroup.Item>)}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      );
    }
    ```

    `CreatePostCard.jsx` (2.2 – POST, có validate):

    ```jsx
    // 2.2 – POST  ·  NC1 async/await · NC5 Form có validate
    import { useState } from "react";
    import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import ResultBox from "./ResultBox";

    export default function CreatePostCard() {
      const [title, setTitle] = useState("");
      const [body, setBody] = useState("");
      const [errors, setErrors] = useState({});
      const [submitting, setSubmitting] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (title.trim().length < 5) errs.title = "Tiêu đề tối thiểu 5 ký tự";
        if (body.trim().length < 10) errs.body = "Nội dung tối thiểu 10 ký tự";
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSubmitting(true);
        setError(null);
        try {
          const res = await postApi.create({ title: title.trim(), body: body.trim(), userId: 1 });
          setResult({ status: res.status, duration: res.duration, data: res.data });
          setTitle("");
          setBody("");
        } catch (err) {
          setError(err.userMessage);
        } finally {
          setSubmitting(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.2 · POST</strong> /posts</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Control className="mb-2" placeholder="Title" value={title} isInvalid={!!errors.title}
                onChange={(e) => setTitle(e.target.value)} />
              <Form.Control.Feedback type="invalid" className="mb-2">{errors.title}</Form.Control.Feedback>
              <Form.Control as="textarea" rows={2} className="mb-2" placeholder="Body" value={body} isInvalid={!!errors.body}
                onChange={(e) => setBody(e.target.value)} />
              <Form.Control.Feedback type="invalid" className="mb-2">{errors.body}</Form.Control.Feedback>
              <Button type="submit" disabled={submitting}>
                {submitting ? <><Spinner size="sm" /> Đang gửi...</> : "Tạo bài viết"}
              </Button>
            </Form>
            {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
            <ResultBox result={result} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `UpdatePostCard.jsx` (2.3 – GET + PUT):

    ```jsx
    // 2.3 – GET + PUT · NC5: Form.Control, Spinner trong nút
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import LoadingSpinner from "../common/LoadingSpinner";
    import ErrorAlert from "../common/ErrorAlert";
    import ResultBox from "./ResultBox";

    const POST_ID = 1;

    export default function UpdatePostCard() {
      const [form, setForm] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);
      const [result, setResult] = useState(null);
      const [saveError, setSaveError] = useState(null);

      // GET dữ liệu cũ đổ vào form
      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await postApi.getById(POST_ID, controller.signal);
            setForm(res.data);
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      const handleUpdate = async () => {
        setSaving(true);
        setSaveError(null);
        try {
          // PUT gửi ĐẦY ĐỦ các trường
          const res = await postApi.update(POST_ID, { id: form.id, userId: form.userId, title: form.title, body: form.body });
          setResult({ status: res.status, duration: res.duration, data: res.data });
        } catch (err) {
          setSaveError(err.userMessage);
        } finally {
          setSaving(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.3 · PUT</strong> /posts/{POST_ID}</Card.Header>
          <Card.Body>
            {loading && <LoadingSpinner />}
            {!loading && error && <ErrorAlert message={error} />}
            {!loading && form && (
              <>
                <Form.Control className="mb-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Form.Control as="textarea" rows={3} className="mb-2" value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })} />
                <Button variant="primary" onClick={handleUpdate} disabled={saving}>
                  {saving ? <Spinner size="sm" /> : "Cập nhật (PUT)"}
                </Button>
              </>
            )}
            {saveError && <Alert variant="danger" className="mt-3 mb-0">{saveError}</Alert>}
            <ResultBox result={result} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `PatchPostCard.jsx` (2.4 – PATCH):

    ```jsx
    // 2.4 – PATCH  ·  NC1
    import { useState } from "react";
    import { Card, Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import ResultBox from "./ResultBox";

    export default function PatchPostCard() {
      const [title, setTitle] = useState("");
      const [saving, setSaving] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);

      const handlePatch = async () => {
        setSaving(true);
        setError(null);
        try {
          const res = await postApi.patch(1, { title: title.trim() }); // chỉ gửi trường thay đổi
          setResult({ status: res.status, duration: res.duration, data: res.data });
        } catch (err) {
          setError(err.userMessage);
        } finally {
          setSaving(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.4 · PATCH</strong> /posts/1</Card.Header>
          <Card.Body>
            <InputGroup>
              <Form.Control placeholder="Tiêu đề mới" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Button variant="warning" onClick={handlePatch} disabled={!title.trim() || saving}>
                {saving ? <Spinner size="sm" /> : "PATCH"}
              </Button>
            </InputGroup>
            {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
            <ResultBox result={result} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `DeletePostCard.jsx` (2.5 – DELETE, Modal + Toast):

    ```jsx
    // 2.5 – DELETE · NC5: Modal xác nhận (thay window.confirm) + Toast thông báo
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, ListGroup, Button, Toast, ToastContainer } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import ConfirmModal from "../ConfirmModal";
    import LoadingSpinner from "../common/LoadingSpinner";
    import ErrorAlert from "../common/ErrorAlert";
    import EmptyState from "../common/EmptyState";

    export default function DeletePostCard() {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [toDelete, setToDelete] = useState(null);   // bài đang chờ xác nhận xóa
      const [deleting, setDeleting] = useState(false);
      const [toast, setToast] = useState(null);         // { bg, message }

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await postApi.getAll({ _limit: 5 }, controller.signal);
            setPosts(res.data);
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      const handleDelete = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(toDelete.id);
          setPosts((prev) => prev.filter((p) => p.id !== toDelete.id));
          setToast({ bg: "success", message: `DELETE /posts/${toDelete.id} → ${res.status}` });
          setToDelete(null);
        } catch (err) {
          setToast({ bg: "danger", message: "Xóa thất bại: " + err.userMessage });
        } finally {
          setDeleting(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.5 · DELETE</strong> /posts/:id</Card.Header>
          <Card.Body>
            {loading && <LoadingSpinner />}
            {!loading && error && <ErrorAlert message={error} />}
            {!loading && !error && posts.length === 0 && <EmptyState text="Đã xóa hết" />}
            <ListGroup variant="flush">
              {posts.map((p) => (
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                  <span>#{p.id} – {p.title}</span>
                  <Button size="sm" variant="outline-danger" onClick={() => setToDelete(p)}>Xóa</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>

          <ConfirmModal show={!!toDelete} title="Xóa bài viết" message={`Xóa bài viết #${toDelete?.id}?`}
            confirmText="Xóa" loading={deleting} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />

          <ToastContainer position="bottom-end" className="p-3 position-fixed">
            <Toast show={!!toast} bg={toast?.bg} onClose={() => setToast(null)} delay={3500} autohide>
              <Toast.Body className="text-white">{toast?.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Card>
      );
    }
    ```

    `RequestConfigCard.jsx` (2.6 – `axiosClient(config)`):

    ```jsx
    // 2.6 – axios(config): headers, params, timeout · NC5: Table + ListGroup
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, ListGroup, Table } from "react-bootstrap";
    import axiosClient from "../../api/axiosClient";
    import LoadingSpinner from "../common/LoadingSpinner";
    import ErrorAlert from "../common/ErrorAlert";

    export default function RequestConfigCard() {
      const [info, setInfo] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await axiosClient({
              method: "get",
              url: "/posts",
              params: { _page: 1, _limit: 3 },
              headers: { Accept: "application/json", "X-Client": "FER202" },
              timeout: 5000,
              signal: controller.signal,
            });
            setInfo({
              status: res.status,
              duration: res.duration,
              contentType: res.headers["content-type"],
              total: res.headers["x-total-count"],
              items: res.data,
            });
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.6 · axios(config)</strong> headers · params · timeout</Card.Header>
          <Card.Body>
            {error && <ErrorAlert message={error} />}
            {!error && !info && <LoadingSpinner />}
            {info && (
              <>
                <Table size="sm" bordered className="small">
                  <tbody>
                    <tr><th>Status</th><td>{info.status}</td></tr>
                    <tr><th>Thời gian</th><td>{info.duration} ms</td></tr>
                    <tr><th>Content-Type</th><td>{info.contentType}</td></tr>
                    <tr><th>x-total-count</th><td>{info.total}</td></tr>
                  </tbody>
                </Table>
                <ListGroup variant="flush">
                  {info.items.map((p) => <ListGroup.Item key={p.id}>{p.title}</ListGroup.Item>)}
                </ListGroup>
              </>
            )}
          </Card.Body>
        </Card>
      );
    }
    ```

5. `src/AxiosDemo.jsx` phiên bản Bootstrap (logic giữ nguyên TODO 4, chỉ đổi giao diện, thêm footer status/thời gian):

    ```jsx
    // NC1 (async/await) · NC4 (chọn id + AbortController) · NC5 (react-bootstrap) – nâng cấp AxiosDemo của Phần 1
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, Spinner, Alert, Form, Row, Col, Badge, Button } from "react-bootstrap";
    import postApi from "./api/postApi";

    export default function AxiosDemo() {
      const [postId, setPostId] = useState(1);
      const [data, setData] = useState(null);
      const [meta, setMeta] = useState(null);        // { status, duration, contentType }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      // async/await + try/catch/finally + AbortController, deps [postId]
      useEffect(() => {
        const controller = new AbortController();

        const fetchPost = async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await postApi.getById(postId, controller.signal);
            setData(res.data);
            setMeta({ status: res.status, duration: res.duration, contentType: res.headers["content-type"] });
          } catch (err) {
            if (axios.isCancel(err)) return;
            setData(null);
            setError(err.userMessage ?? err.message);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };

        fetchPost();
        return () => controller.abort();
      }, [postId]);

      return (
        <>
          <h1 className="mb-3">Axios Demo <Badge bg="primary">react-bootstrap</Badge></h1>

          <Row className="mb-3 g-2 align-items-end">
            <Col xs="auto">
              <Form.Label htmlFor="postId">Post ID (1–100, thử 999 để xem lỗi 404)</Form.Label>
              <Form.Control id="postId" type="number" min={1} value={postId}
                onChange={(e) => setPostId(Number(e.target.value) || 1)} style={{ width: 160 }} />
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" onClick={() => setPostId((id) => Math.max(1, id - 1))}>‹ Trước</Button>{" "}
              <Button variant="outline-secondary" onClick={() => setPostId((id) => id + 1)}>Sau ›</Button>
            </Col>
          </Row>

          {loading && (
            <div className="text-center py-5"><Spinner animation="border" /><p className="mt-2">Loading...</p></div>
          )}

          {!loading && error && <Alert variant="danger">❌ Error: {error}</Alert>}

          {!loading && data && (
            <Card className="shadow-sm">
              <Card.Header>Post #{data.id} · userId {data.userId}</Card.Header>
              <Card.Body>
                <Card.Title as="h2" className="fs-4 text-capitalize">{data.title}</Card.Title>
                <Card.Text style={{ whiteSpace: "pre-line" }}>{data.body}</Card.Text>
              </Card.Body>
              {meta && (
                <Card.Footer className="small text-muted">
                  Status <Badge bg="success">{meta.status}</Badge> · {meta.duration} ms · {meta.contentType}
                </Card.Footer>
              )}
            </Card>
          )}
        </>
      );
    }
    ```

6. `src/App.jsx` – bố cục lưới 2 cột:

    ```jsx
    import { Container, Row, Col } from 'react-bootstrap';
    import AxiosDemo from './AxiosDemo';
    import PostListCard from './components/http/PostListCard';
    import CreatePostCard from './components/http/CreatePostCard';
    import UpdatePostCard from './components/http/UpdatePostCard';
    import PatchPostCard from './components/http/PatchPostCard';
    import DeletePostCard from './components/http/DeletePostCard';
    import RequestConfigCard from './components/http/RequestConfigCard';

    export default function App() {
      return (
        <Container className="py-4">
          <AxiosDemo />
          <h2 className="mt-5 mb-3">HTTP Requests với axios</h2>
          <Row xs={1} lg={2} className="g-4">
            <Col><PostListCard /></Col>
            <Col><CreatePostCard /></Col>
            <Col><UpdatePostCard /></Col>
            <Col><PatchPostCard /></Col>
            <Col><DeletePostCard /></Col>
            <Col><RequestConfigCard /></Col>
          </Row>
        </Container>
      );
    }
    ```

    Xóa các file cũ `PostList.jsx`, `CreatePost.jsx`, `UpdatePost.jsx`, `PatchPost.jsx`, `DeletePost.jsx`, `RequestConfig.jsx`. `PostDetail.jsx` giữ lại – TODO 6 sẽ chuyển thành trang.

**Checklist TODO 5**
- [ ] Trang có giao diện Bootstrap (nút xanh, Card có viền) → CSS đã import.
- [ ] Đang tải hiện `Spinner`; lỗi hiện `Alert` đỏ.
- [ ] POST với title 3 ký tự hoặc body 5 ký tự → ô đỏ + dòng lỗi, **không** có request trong Network.
- [ ] Nút POST/PUT/PATCH hiện Spinner và bị disable khi đang gửi.
- [ ] Bấm Xóa → `Modal` hiện (không còn hộp thoại `confirm` của trình duyệt); xác nhận → dòng biến mất + `Toast` xanh góc phải dưới, tự ẩn sau ~3.5 giây.
- [ ] Tìm `window.confirm` / `alert(` trong `src/` → 0 kết quả.

---

## TODO 6 – NC6: Ứng dụng CRUD với React Router

**Yêu cầu**
1. Cài `react-router-dom`. Khai báo các route:

    | Route | Trang | Request |
    |---|---|---|
    | `/posts` | Danh sách + phân trang + lọc theo tác giả | GET `?_page=&_limit=&userId=` |
    | `/posts/new` | Tạo bài viết | POST |
    | `/posts/:id` | Chi tiết + bình luận + sửa nhanh tiêu đề + xóa | GET, PATCH, DELETE |
    | `/posts/:id/edit` | Sửa toàn bộ | GET + PUT |
    | `*` | Trang 404 | – |

    Thêm 2 trang giữ lại bài cũ: `/` (AxiosDemo) và `/http` (6 card của Phần 2).
2. Dùng `useParams`, `useNavigate`, `useSearchParams` (lưu `page` và `userId` trên URL).
3. Layout chung (`Navbar` + `<Outlet />`), menu dùng `NavLink`.
4. Sau khi POST/PUT/DELETE thành công: `navigate()` về trang phù hợp, kèm thông báo qua `state`.
5. Tổng số trang lấy từ header `x-total-count`.

**Lý thuyết cần nắm**

Cây route:

```
<Route element={<Layout />}>                 ← layout route: Navbar + <Outlet/> + Toast
  index            → AxiosDemoPage           /
  http             → HttpRequestsPage        /http
  posts
    index          → PostListPage            /posts?page=2&userId=1
    new            → PostCreatePage          /posts/new
    :id            → PostDetailPage          /posts/5
    :id/edit       → PostEditPage            /posts/5/edit
  *                → NotFoundPage
```

| Hook | Dùng để | Ví dụ |
|---|---|---|
| `useParams()` | Đọc tham số trên path | `/posts/5` → `{ id: "5" }` (luôn là **chuỗi**) |
| `useNavigate()` | Chuyển trang bằng code | `navigate('/posts', { state: { flash } })`, `navigate(-1)` |
| `useSearchParams()` | Đọc/ghi query string như state | `?page=2&userId=1` – F5 / gửi link vẫn giữ |
| `useLocation()` | Đọc `state` được gửi kèm | `location.state?.flash` |
| `useOutletContext()` | Trang con nhận dữ liệu từ layout | `const { notify } = useOutletContext()` |

- **Thông báo sau khi chuyển trang:** trang gửi `navigate('/posts', { state: { flash: { bg, message } } })` → trang đích đọc `location.state.flash`, hiện Toast, rồi xóa state bằng `navigate(..., { replace: true, state: null })` để F5 không hiện lại (hook `useFlash`).
- **Toast dùng chung:** `Layout` giữ state toast và truyền hàm `notify(bg, message)` xuống qua `<Outlet context={{ notify }} />`.
- `NavLink to="/posts" end`: không có `end`, mục "Bài viết" sáng cả khi đang ở `/posts/new`.
- json-server và JSONPlaceholder trả header `X-Total-Count` khi có `_page` → `Math.ceil(total / LIMIT)` = số trang.

**Làm từng bước**

1. Cài thư viện:

    ```bash
    npm install react-router-dom
    ```

2. `src/main.jsx` – bọc `BrowserRouter`:

    ```jsx
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import { BrowserRouter } from "react-router-dom";
    import "bootstrap/dist/css/bootstrap.min.css";
    import App from "./App.jsx";

    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    ```

3. `src/App.jsx`:

    ```jsx
    import { Routes, Route } from "react-router-dom";
    import Layout from "./components/Layout";
    import AxiosDemoPage from "./pages/AxiosDemoPage";
    import HttpRequestsPage from "./pages/HttpRequestsPage";
    import PostListPage from "./pages/PostListPage";
    import PostDetailPage from "./pages/PostDetailPage";
    import PostCreatePage from "./pages/PostCreatePage";
    import PostEditPage from "./pages/PostEditPage";
    import NotFoundPage from "./pages/NotFoundPage";

    // NC6 – React Router: Layout route + nested routes + 404
    export default function App() {
      return (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<AxiosDemoPage />} />            {/* Phần 1 nâng cao: NC1, NC4, NC5 */}
            <Route path="http" element={<HttpRequestsPage />} />   {/* Phần 2 nâng cao: NC1, NC2, NC5, NC8 */}
            <Route path="posts">
              <Route index element={<PostListPage />} />           {/* NC6, NC8, NC9, NC10 */}
              <Route path="new" element={<PostCreatePage />} />    {/* POST */}
              <Route path=":id" element={<PostDetailPage />} />    {/* NC3 + PATCH + DELETE */}
              <Route path=":id/edit" element={<PostEditPage />} /> {/* PUT */}
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      );
    }
    ```

4. Layout, Navbar, 404:

    `src/components/Layout.jsx`:

    ```jsx
    import { useState, useCallback } from "react";
    import { Outlet } from "react-router-dom";
    import { Container, Toast, ToastContainer } from "react-bootstrap";
    import AppNavbar from "./AppNavbar";

    export default function Layout() {
      const [toast, setToast] = useState(null); // { bg, message }
      const notify = useCallback((bg, message) => setToast({ bg, message }), []);

      return (
        <>
          <AppNavbar />
          <Container className="py-4">
            {/* Truyền notify xuống mọi trang con qua useOutletContext() */}
            <Outlet context={{ notify }} />
          </Container>

          <ToastContainer position="bottom-end" className="p-3 position-fixed">
            <Toast show={!!toast} bg={toast?.bg} onClose={() => setToast(null)} delay={3500} autohide>
              <Toast.Body className="text-white">{toast?.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        </>
      );
    }
    ```

    `src/components/AppNavbar.jsx` (`as={NavLink}` giữ giao diện Bootstrap nhưng điều hướng bằng Router):

    ```jsx
    import { Navbar, Nav, Container } from "react-bootstrap";
    import { NavLink, Link } from "react-router-dom";

    export default function AppNavbar() {
      return (
        <Navbar bg="dark" variant="dark" expand="md">
          <Container>
            <Navbar.Brand as={Link} to="/">Exercise 27 · Nâng cao</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/" end>Axios Demo</Nav.Link>
                <Nav.Link as={NavLink} to="/http">HTTP Requests</Nav.Link>
                <Nav.Link as={NavLink} to="/posts" end>Bài viết</Nav.Link>
                <Nav.Link as={NavLink} to="/posts/new">+ Tạo bài viết</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }
    ```

    `src/pages/NotFoundPage.jsx`:

    ```jsx
    import { Link, useLocation } from "react-router-dom";
    import { Alert, Button } from "react-bootstrap";

    export default function NotFoundPage() {
      const { pathname } = useLocation();
      return (
        <Alert variant="warning" className="text-center py-5">
          <h1>404</h1>
          <p>Không có trang <code>{pathname}</code></p>
          <Button as={Link} to="/">Về trang chủ</Button>
        </Alert>
      );
    }
    ```

5. Hook đọc thông báo `src/hooks/useFlash.js`:

    ```js
    import { useEffect } from "react";
    import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

    // Đọc thông báo truyền qua navigate(..., { state: { flash } }) rồi xóa state
    export default function useFlash() {
      const location = useLocation();
      const navigate = useNavigate();
      const { notify } = useOutletContext();

      useEffect(() => {
        const flash = location.state?.flash;
        if (!flash) return;
        notify(flash.bg, flash.message);
        navigate(location.pathname + location.search, { replace: true, state: null });
      }, [location, navigate, notify]);
    }
    ```

6. Chuyển 2 phần cũ thành trang:

    `src/pages/AxiosDemoPage.jsx` (bản TODO 5 + link sang trang chi tiết):

    ```jsx
    // NC1 (async/await) · NC4 (chọn id + AbortController) · NC5 (react-bootstrap) – nâng cấp AxiosDemo của Phần 1
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Card, Spinner, Alert, Form, Row, Col, Badge, Button } from "react-bootstrap";
    import { Link } from "react-router-dom";
    import postApi from "../api/postApi";

    export default function AxiosDemoPage() {
      const [postId, setPostId] = useState(1);
      const [data, setData] = useState(null);
      const [meta, setMeta] = useState(null);        // { status, duration, contentType }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      // async/await + try/catch/finally + AbortController, deps [postId]
      useEffect(() => {
        const controller = new AbortController();

        const fetchPost = async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await postApi.getById(postId, controller.signal);
            setData(res.data);
            setMeta({ status: res.status, duration: res.duration, contentType: res.headers["content-type"] });
          } catch (err) {
            if (axios.isCancel(err)) return;
            setData(null);
            setError(err.userMessage ?? err.message);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };

        fetchPost();
        return () => controller.abort();
      }, [postId]);

      return (
        <>
          <h1 className="mb-3">Axios Demo <Badge bg="primary">react-bootstrap</Badge></h1>

          <Row className="mb-3 g-2 align-items-end">
            <Col xs="auto">
              <Form.Label htmlFor="postId">Post ID (1–100, thử 999 để xem lỗi 404)</Form.Label>
              <Form.Control id="postId" type="number" min={1} value={postId}
                onChange={(e) => setPostId(Number(e.target.value) || 1)} style={{ width: 160 }} />
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" onClick={() => setPostId((id) => Math.max(1, id - 1))}>‹ Trước</Button>{" "}
              <Button variant="outline-secondary" onClick={() => setPostId((id) => id + 1)}>Sau ›</Button>
            </Col>
          </Row>

          {loading && (
            <div className="text-center py-5"><Spinner animation="border" /><p className="mt-2">Loading...</p></div>
          )}

          {!loading && error && <Alert variant="danger">❌ Error: {error}</Alert>}

          {!loading && data && (
            <Card className="shadow-sm">
              <Card.Header>Post #{data.id} · userId {data.userId}</Card.Header>
              <Card.Body>
                <Card.Title as="h2" className="fs-4 text-capitalize">{data.title}</Card.Title>
                <Card.Text style={{ whiteSpace: "pre-line" }}>{data.body}</Card.Text>
                <Link to={`/posts/${data.id}`}>Xem chi tiết & bình luận →</Link>
              </Card.Body>
              {meta && (
                <Card.Footer className="small text-muted">
                  Status <Badge bg="success">{meta.status}</Badge> · {meta.duration} ms · {meta.contentType}
                </Card.Footer>
              )}
            </Card>
          )}
        </>
      );
    }
    ```

    `src/pages/HttpRequestsPage.jsx`:

    ```jsx
    // Các bài 2.1 – 2.6 viết lại theo yêu cầu nâng cao:
    // NC1 async/await · NC2 axiosClient + postApi · NC5 react-bootstrap · NC8 useAxios cho request GET
    import { Row, Col } from "react-bootstrap";
    import PostListCard from "../components/http/PostListCard";
    import CreatePostCard from "../components/http/CreatePostCard";
    import UpdatePostCard from "../components/http/UpdatePostCard";
    import PatchPostCard from "../components/http/PatchPostCard";
    import DeletePostCard from "../components/http/DeletePostCard";
    import RequestConfigCard from "../components/http/RequestConfigCard";

    export default function HttpRequestsPage() {
      return (
        <>
          <h2 className="mb-3">HTTP Requests với axios</h2>
          <Row xs={1} lg={2} className="g-4">
            <Col><PostListCard /></Col>
            <Col><CreatePostCard /></Col>
            <Col><UpdatePostCard /></Col>
            <Col><PatchPostCard /></Col>
            <Col><DeletePostCard /></Col>
            <Col><RequestConfigCard /></Col>
          </Row>
        </>
      );
    }
    ```

    Sửa `DeletePostCard.jsx`: bỏ Toast riêng, dùng `notify` chung của Layout:

    ```jsx
    // 2.5 – DELETE · NC5 Modal · NC6: Toast dùng chung qua useOutletContext()
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { useOutletContext } from "react-router-dom";
    import { Card, ListGroup, Button } from "react-bootstrap";
    import postApi from "../../api/postApi";
    import ConfirmModal from "../ConfirmModal";
    import LoadingSpinner from "../common/LoadingSpinner";
    import ErrorAlert from "../common/ErrorAlert";
    import EmptyState from "../common/EmptyState";

    export default function DeletePostCard() {
      const { notify } = useOutletContext(); // hàm hiện Toast do Layout cung cấp
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [toDelete, setToDelete] = useState(null);   // bài đang chờ xác nhận xóa
      const [deleting, setDeleting] = useState(false);

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await postApi.getAll({ _limit: 5 }, controller.signal);
            setPosts(res.data);
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      const handleDelete = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(toDelete.id);
          setPosts((prev) => prev.filter((p) => p.id !== toDelete.id));
          notify("success", `DELETE /posts/${toDelete.id} → ${res.status}`);
          setToDelete(null);
        } catch (err) {
          notify("danger", "Xóa thất bại: " + err.userMessage);
        } finally {
          setDeleting(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.5 · DELETE</strong> /posts/:id</Card.Header>
          <Card.Body>
            {loading && <LoadingSpinner />}
            {!loading && error && <ErrorAlert message={error} />}
            {!loading && !error && posts.length === 0 && <EmptyState text="Đã xóa hết" />}
            <ListGroup variant="flush">
              {posts.map((p) => (
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                  <span>#{p.id} – {p.title}</span>
                  <Button size="sm" variant="outline-danger" onClick={() => setToDelete(p)}>Xóa</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>

          <ConfirmModal show={!!toDelete} title="Xóa bài viết" message={`Xóa bài viết #${toDelete?.id}?`}
            confirmText="Xóa" loading={deleting} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />
        </Card>
      );
    }
    ```

    Xóa `src/AxiosDemo.jsx`, `src/PostDetail.jsx` (đã chuyển thành trang).

7. Form dùng chung cho tạo (POST) và sửa (PUT) – `src/components/PostForm.jsx`:

    ```jsx
    import { useState } from "react";
    import { Form, Button, Spinner } from "react-bootstrap";

    const validate = ({ title, body, userId }) => {
      const errors = {};
      if (title.trim().length < 5) errors.title = "Tiêu đề tối thiểu 5 ký tự";
      if (body.trim().length < 10) errors.body = "Nội dung tối thiểu 10 ký tự";
      if (!userId) errors.userId = "Chọn tác giả";
      return errors;
    };

    /**
     * Form dùng chung cho Tạo (POST) và Sửa (PUT)
     * - initialValues: { title, body, userId }
     * - onSubmit(values): async – trang cha gọi API
     */
    export default function PostForm({ initialValues, users, submitting, submitLabel, onSubmit, onCancel }) {
      const [values, setValues] = useState(initialValues);
      const [errors, setErrors] = useState({});

      const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

      const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate(values);
        setErrors(errs);
        if (Object.keys(errs).length) return;
        onSubmit({ ...values, title: values.title.trim(), body: values.body.trim(), userId: Number(values.userId) });
      };

      return (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control name="title" value={values.title} onChange={handleChange} isInvalid={!!errors.title} />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="body">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control as="textarea" rows={5} name="body" value={values.body} onChange={handleChange} isInvalid={!!errors.body} />
            <Form.Control.Feedback type="invalid">{errors.body}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="userId">
            <Form.Label>Tác giả</Form.Label>
            <Form.Select name="userId" value={values.userId} onChange={handleChange} isInvalid={!!errors.userId}>
              <option value="">-- Chọn tác giả --</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" disabled={submitting} className="me-2">
            {submitting ? <><Spinner size="sm" /> Đang gửi...</> : submitLabel}
          </Button>
          <Button variant="outline-secondary" onClick={onCancel} disabled={submitting}>Hủy</Button>
        </Form>
      );
    }
    ```

8. Trang danh sách `src/pages/PostListPage.jsx` (phiên bản 1 – TODO 8, 9, 10 sẽ nâng cấp):

    ```jsx
    // NC6 – Danh sách: phân trang + lọc tác giả lưu trên URL (useSearchParams), tổng trang từ x-total-count
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { Link, useSearchParams, useOutletContext } from "react-router-dom";
    import { Table, Form, Pagination, Spinner, Button, Row, Col, Badge } from "react-bootstrap";
    import useFlash from "../hooks/useFlash";
    import postApi, { userApi } from "../api/postApi";
    import ConfirmModal from "../components/ConfirmModal";
    import ErrorAlert from "../components/common/ErrorAlert";

    const LIMIT = 5;

    export default function PostListPage() {
      useFlash(); // hiện thông báo khi được navigate tới kèm state.flash
      const { notify } = useOutletContext();

      // ----- Trạng thái lọc lưu trên URL: /posts?page=2&userId=1 -----
      const [searchParams, setSearchParams] = useSearchParams();
      const page = Number(searchParams.get("page") ?? 1);
      const userId = searchParams.get("userId") ?? "";

      const changeQuery = (next) => {
        const merged = { page: String(page), userId, ...next };
        Object.keys(merged).forEach((k) => (merged[k] === "" || merged[k] == null) && delete merged[k]);
        setSearchParams(merged);
      };

      // ----- Danh sách tác giả (cho ô lọc) -----
      const [users, setUsers] = useState([]);
      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await userApi.getAll(controller.signal);
            setUsers(res.data);
          } catch (err) {
            if (!axios.isCancel(err)) console.warn(err.userMessage);
          }
        };
        load();
        return () => controller.abort();
      }, []);

      // ----- Danh sách bài viết: chạy lại mỗi khi page / userId đổi -----
      const [posts, setPosts] = useState([]);
      const [total, setTotal] = useState(0);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [reloadKey, setReloadKey] = useState(0); // tăng lên để tải lại (nút Thử lại)

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          setLoading(true);
          setError(null);
          try {
            const params = { _page: page, _limit: LIMIT };
            if (userId) params.userId = userId;
            const res = await postApi.getAll(params, controller.signal);
            setPosts(res.data);
            setTotal(Number(res.headers["x-total-count"] ?? res.data.length)); // header luôn chữ thường
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, [page, userId, reloadKey]);

      const totalPages = Math.max(1, Math.ceil(total / LIMIT));
      const authorName = (id) => users.find((u) => u.id === id)?.name ?? `User ${id}`;

      // ----- Xóa 1 bài: hỏi xác nhận bằng Modal → DELETE → cập nhật state -----
      const [toDelete, setToDelete] = useState(null);
      const [deleting, setDeleting] = useState(false);
      const handleDeleteOne = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(toDelete.id);
          setPosts((prev) => prev.filter((p) => p.id !== toDelete.id));
          setTotal((t) => t - 1);
          notify("success", `DELETE /posts/${toDelete.id} → ${res.status}`);
        } catch (err) {
          notify("danger", "Xóa thất bại: " + err.userMessage);
        } finally {
          setDeleting(false);
          setToDelete(null);
        }
      };

      return (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="m-0">Bài viết <Badge bg="secondary">{total}</Badge></h2>
            <Button as={Link} to="/posts/new">+ Tạo bài viết</Button>
          </div>

          <Row className="mb-3 g-2">
            <Col md={4}>
              <Form.Select value={userId} onChange={(e) => changeQuery({ userId: e.target.value, page: "1" })}>
                <option value="">Tất cả tác giả</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex align-items-center">{loading && <Spinner size="sm" />}</Col>
          </Row>

          {error && <ErrorAlert message={error} onRetry={() => setReloadKey((k) => k + 1)} />}

          <Table striped bordered hover responsive className={loading ? "opacity-50" : ""}>
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th><th>Tiêu đề</th><th style={{ width: 170 }}>Tác giả</th><th style={{ width: 190 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><Link to={`/posts/${p.id}`}>{p.title}</Link></td>
                  <td>{authorName(p.userId)}</td>
                  <td>
                    <Button as={Link} to={`/posts/${p.id}`} size="sm" variant="outline-info" className="me-1">Xem</Button>
                    <Button as={Link} to={`/posts/${p.id}/edit`} size="sm" variant="outline-primary" className="me-1">Sửa</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setToDelete(p)}>Xóa</Button>
                  </td>
                </tr>
              ))}
              {!loading && posts.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted">Không có bài viết phù hợp</td></tr>
              )}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.Prev disabled={page <= 1} onClick={() => changeQuery({ page: String(page - 1) })} />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Pagination.Item key={n} active={n === page} onClick={() => changeQuery({ page: String(n) })}>{n}</Pagination.Item>
            ))}
            <Pagination.Next disabled={page >= totalPages} onClick={() => changeQuery({ page: String(page + 1) })} />
          </Pagination>

          <ConfirmModal show={!!toDelete} title="Xóa bài viết"
            message={<>Xóa <strong>#{toDelete?.id} {toDelete?.title}</strong>?</>}
            confirmText="Xóa" loading={deleting} onConfirm={handleDeleteOne} onCancel={() => setToDelete(null)} />
        </>
      );
    }
    ```

9. Trang tạo `src/pages/PostCreatePage.jsx`:

    ```jsx
    // NC6 – POST: tạo xong → navigate về /posts kèm thông báo qua state
    import { useState, useEffect } from "react";
    import { useNavigate, useOutletContext } from "react-router-dom";
    import { Card } from "react-bootstrap";
    import postApi, { userApi } from "../api/postApi";
    import PostForm from "../components/PostForm";

    export default function PostCreatePage() {
      const navigate = useNavigate();
      const { notify } = useOutletContext();
      const [users, setUsers] = useState([]);
      const [submitting, setSubmitting] = useState(false);

      // Danh sách tác giả cho Form.Select
      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          try {
            const res = await userApi.getAll(controller.signal);
            setUsers(res.data);
          } catch {
            // lỗi hủy hoặc lỗi mạng: form vẫn dùng được, chỉ thiếu danh sách tác giả
          }
        };
        load();
        return () => controller.abort();
      }, []);

      const handleCreate = async (values) => {
        setSubmitting(true);
        try {
          const res = await postApi.create(values);
          navigate("/posts", {
            state: { flash: { bg: "success", message: `POST /posts → ${res.status}. Đã tạo bài viết #${res.data.id}: "${res.data.title}"` } },
          });
        } catch (err) {
          notify("danger", "Tạo thất bại: " + err.userMessage);
          setSubmitting(false);
        }
      };

      return (
        <Card className="shadow-sm">
          <Card.Header as="h4">Tạo bài viết (POST)</Card.Header>
          <Card.Body>
            <PostForm initialValues={{ title: "", body: "", userId: "" }} users={users} submitting={submitting}
              submitLabel="Tạo bài viết" onSubmit={handleCreate} onCancel={() => navigate("/posts")} />
          </Card.Body>
        </Card>
      );
    }
    ```

10. Trang chi tiết `src/pages/PostDetailPage.jsx` – gom logic TODO 3 (allSettled, đo thời gian) + TODO 4 (hủy request khi `id` đổi) + PATCH sửa nhanh + DELETE:

    ```jsx
    // NC6 – Chi tiết: NC3 (allSettled + đo thời gian) · NC4 (hủy request) · PATCH · DELETE
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
    import { Card, Spinner, Alert, Button, ListGroup, Form, InputGroup, Badge, Table } from "react-bootstrap";
    import useFlash from "../hooks/useFlash";
    import postApi, { userApi } from "../api/postApi";
    import ConfirmModal from "../components/ConfirmModal";
    import LoadingSpinner from "../components/common/LoadingSpinner";

    // Bước 1 tuần tự (cần userId) → bước 2 song song, chấp nhận lỗi một phần
    const loadDetail = async (id, signal) => {
      const { data: post } = await postApi.getById(id, signal);
      const [userResult, commentsResult] = await Promise.allSettled([
        userApi.getById(post.userId, signal),
        postApi.getComments(id, signal),
      ]);
      if (signal.aborted) throw new axios.CanceledError(); // allSettled không ném lỗi hủy → tự ném để bên gọi bỏ qua
      return {
        data: {
          post,
          author: userResult.status === "fulfilled" ? userResult.value.data : null,
          comments: commentsResult.status === "fulfilled" ? commentsResult.value.data : [],
          warning: [userResult, commentsResult].some((r) => r.status === "rejected")
            ? "Một số thông tin phụ (tác giả / bình luận) không tải được."
            : null,
        },
      };
    };

    // NC3.2 – So sánh thời gian tuần tự và song song
    const measure = async (id) => {
      let t0 = performance.now();
      const { data: p1 } = await postApi.getById(id);
      await userApi.getById(p1.userId);
      await postApi.getComments(id);
      const sequential = Math.round(performance.now() - t0);

      t0 = performance.now();
      const { data: p2 } = await postApi.getById(id);
      await Promise.all([userApi.getById(p2.userId), postApi.getComments(id)]);
      const parallel = Math.round(performance.now() - t0);
      return { sequential, parallel };
    };

    export default function PostDetailPage() {
      useFlash();
      const { id } = useParams();
      const navigate = useNavigate();
      const { notify } = useOutletContext();

      const [data, setData] = useState(null); // { post, author, comments, warning }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [reloadKey, setReloadKey] = useState(0);
      const refetch = () => setReloadKey((k) => k + 1);

      // id đổi (bấm sang bài khác) → hủy toàn bộ request của bài cũ (dùng CHUNG 1 signal)
      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await loadDetail(id, controller.signal);
            setData(res.data);
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage ?? err.message);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, [id, reloadKey]);

      const [quickTitle, setQuickTitle] = useState("");
      const [patching, setPatching] = useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const [deleting, setDeleting] = useState(false);
      const [timing, setTiming] = useState(null);
      const [measuring, setMeasuring] = useState(false);

      useEffect(() => { if (data) setQuickTitle(data.post.title); }, [data]);

      // PATCH – chỉ gửi title
      const handlePatch = async (e) => {
        e.preventDefault();
        if (quickTitle.trim().length < 5) return notify("warning", "Tiêu đề tối thiểu 5 ký tự");
        setPatching(true);
        try {
          const res = await postApi.patch(id, { title: quickTitle.trim() });
          setData((prev) => ({ ...prev, post: { ...prev.post, ...res.data } }));
          notify("success", `PATCH /posts/${id} → ${res.status}`);
        } catch (err) {
          notify("danger", "Cập nhật thất bại: " + err.userMessage);
        } finally {
          setPatching(false);
        }
      };

      // DELETE – xong thì về danh sách kèm thông báo
      const handleDelete = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(id);
          navigate("/posts", { state: { flash: { bg: "success", message: `DELETE /posts/${id} → ${res.status}. Đã xóa bài viết.` } } });
        } catch (err) {
          notify("danger", "Xóa thất bại: " + err.userMessage);
          setDeleting(false);
          setShowDelete(false);
        }
      };

      const handleMeasure = async () => {
        setMeasuring(true);
        try { setTiming(await measure(id)); }
        catch (err) { notify("danger", err.userMessage ?? err.message); }
        finally { setMeasuring(false); }
      };

      if (loading) return <LoadingSpinner />;
      if (error) {
        return (
          <Alert variant="warning">
            {error} – bài viết #{id}. <Alert.Link as={Link} to="/posts">Quay lại danh sách</Alert.Link>{" "}
            <Button size="sm" variant="outline-secondary" className="ms-2" onClick={refetch}>Thử lại</Button>
          </Alert>
        );
      }

      const { post, author, comments, warning } = data;

      return (
        <>
          <Button variant="link" className="px-0 mb-2" onClick={() => navigate(-1)}>← Quay lại</Button>
          {warning && <Alert variant="warning">{warning}</Alert>}

          <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span>Post #{post.id} · <strong>{author?.name ?? `User ${post.userId}`}</strong>{author && ` (${author.email})`}</span>
              <span>
                <Button as={Link} to={`/posts/${post.id}/edit`} size="sm" variant="outline-primary" className="me-2">Sửa (PUT)</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setShowDelete(true)}>Xóa</Button>
              </span>
            </Card.Header>
            <Card.Body>
              <Card.Title as="h2" className="fs-3">{post.title}</Card.Title>
              <Card.Text style={{ whiteSpace: "pre-line" }}>{post.body}</Card.Text>

              <Form onSubmit={handlePatch} className="mt-4">
                <Form.Label className="small text-muted">Sửa nhanh tiêu đề (PATCH)</Form.Label>
                <InputGroup>
                  <Form.Control value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} />
                  <Button type="submit" variant="warning" disabled={patching || quickTitle === post.title}>
                    {patching ? <Spinner size="sm" /> : "PATCH"}
                  </Button>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>NC3 · So sánh tuần tự và song song</Card.Header>
            <Card.Body>
              <Button size="sm" onClick={handleMeasure} disabled={measuring}>
                {measuring ? <><Spinner size="sm" /> Đang đo...</> : "Đo thời gian"}
              </Button>
              {timing && (
                <Table size="sm" bordered className="mt-3 mb-0" style={{ maxWidth: 360 }}>
                  <tbody>
                    <tr><th>Tuần tự (3 request nối tiếp)</th><td>{timing.sequential} ms</td></tr>
                    <tr><th>Song song (1 + Promise.all)</th><td>{timing.parallel} ms</td></tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          <h4>Bình luận <Badge bg="secondary">{comments.length}</Badge></h4>
          <ListGroup>
            {comments.map((c) => (
              <ListGroup.Item key={c.id}>
                <div className="fw-semibold">{c.name}</div>
                <small className="text-muted">{c.email}</small>
                <div>{c.body}</div>
              </ListGroup.Item>
            ))}
            {comments.length === 0 && <ListGroup.Item className="text-muted">Chưa có bình luận</ListGroup.Item>}
          </ListGroup>

          <ConfirmModal show={showDelete} title="Xóa bài viết" message={`Xóa bài viết #${post.id}?`}
            confirmText="Xóa" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
        </>
      );
    }
    ```

    > `loadDetail` tự ném `CanceledError` khi `signal.aborted`, vì `Promise.allSettled` **không ném** lỗi hủy → nếu không kiểm tra, dữ liệu của bài cũ vẫn bị ghi vào state.

11. Trang sửa `src/pages/PostEditPage.jsx` – `Promise.all` lấy bài viết + danh sách tác giả, rồi PUT:

    ```jsx
    // NC6 – Sửa toàn bộ: GET (bài viết + tác giả song song) rồi PUT
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { useParams, useNavigate, useOutletContext, Link } from "react-router-dom";
    import { Card, Alert } from "react-bootstrap";
    import postApi, { userApi } from "../api/postApi";
    import PostForm from "../components/PostForm";
    import LoadingSpinner from "../components/common/LoadingSpinner";

    export default function PostEditPage() {
      const { id } = useParams(); // "/posts/3/edit" → id = "3" (chuỗi)
      const navigate = useNavigate();
      const { notify } = useOutletContext();
      const [data, setData] = useState(null); // { post, users }
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [submitting, setSubmitting] = useState(false);

      useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
          setLoading(true);
          setError(null);
          try {
            const [pRes, uRes] = await Promise.all([postApi.getById(id, controller.signal), userApi.getAll(controller.signal)]);
            setData({ post: pRes.data, users: uRes.data });
          } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.userMessage);
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        };
        load();
        return () => controller.abort();
      }, [id]);

      const handleUpdate = async (values) => {
        setSubmitting(true);
        try {
          const res = await postApi.update(id, { id: Number(id), ...values }); // PUT gửi đầy đủ
          navigate(`/posts/${id}`, {
            state: { flash: { bg: "success", message: `PUT /posts/${id} → ${res.status}. Đã cập nhật bài viết.` } },
          });
        } catch (err) {
          notify("danger", "Cập nhật thất bại: " + err.userMessage);
          setSubmitting(false);
        }
      };

      if (loading) return <LoadingSpinner />;
      if (error) return <Alert variant="danger">{error} <Alert.Link as={Link} to="/posts">Về danh sách</Alert.Link></Alert>;

      const { post, users } = data;
      return (
        <Card className="shadow-sm">
          <Card.Header as="h4">Sửa bài viết #{id} (PUT)</Card.Header>
          <Card.Body>
            <PostForm initialValues={{ title: post.title, body: post.body, userId: String(post.userId) }} users={users}
              submitting={submitting} submitLabel="Lưu thay đổi" onSubmit={handleUpdate} onCancel={() => navigate(`/posts/${id}`)} />
          </Card.Body>
        </Card>
      );
    }
    ```

**Checklist TODO 6**
- [ ] Bấm các mục menu: URL đổi, trang không tải lại (Network không có request `document` mới), mục đang chọn sáng.
- [ ] `/posts`: 5 dòng/trang, có thanh phân trang; số trang = `x-total-count / 5` (JSONPlaceholder: 100 bài → 20 trang).
- [ ] Chọn tác giả → URL `?page=1&userId=2`; sang trang 2 → `?page=2&userId=2`; **F5 vẫn giữ**; nút Back trình duyệt về đúng trạng thái trước.
- [ ] `/posts/new`: submit trống → 3 ô đỏ; hợp lệ → về `/posts` + Toast "POST /posts → 201...".
- [ ] `/posts/1`: hiện bài + tác giả + bình luận; sửa nhanh tiêu đề → Network **PATCH** chỉ có `{ title }`; Xóa → Modal → về `/posts` + Toast.
- [ ] `/posts/1/edit`: form có sẵn dữ liệu; Lưu → Network **PUT** gửi đủ `id, title, body, userId` → về `/posts/1` + Toast.
- [ ] Toast sau `navigate` **không** hiện lại khi F5.
- [ ] `/abc` → trang 404 có Navbar; `/posts/999` → Alert "Không tìm thấy dữ liệu (404)".
- [ ] (JSONPlaceholder) Tạo/sửa/xóa xong, F5 thấy dữ liệu **cũ** – bình thường, TODO 7 sẽ giải quyết.

---

## TODO 7 – NC7: Lưu dữ liệu thật với json-server

**Yêu cầu**
1. Cài `npm install -D json-server@0.17.4`, tạo `db.json` gồm `posts`, `users`, `comments`.
2. Thêm script `"server": "json-server --watch db.json --port 3001"`.
3. Đổi `baseURL` sang biến môi trường: tạo `.env` có `VITE_API_URL=http://localhost:3001`, đọc bằng `import.meta.env.VITE_API_URL`.
4. Kiểm tra: sau POST/PUT/PATCH/DELETE, file `db.json` **thay đổi thật** và F5 vẫn còn dữ liệu.

**Lý thuyết cần nắm**
- json-server tạo REST API đầy đủ từ một file JSON: mỗi khóa cấp 1 (`posts`, `users`, `comments`) là một tài nguyên.

    | Request | Ý nghĩa |
    |---|---|
    | `GET /posts?_page=2&_limit=5` | Phân trang, header `X-Total-Count` |
    | `GET /posts?userId=1` | Lọc theo trường |
    | `GET /posts?q=react` | Tìm toàn văn (TODO 9) |
    | `GET /posts/1/comments` | Tài nguyên lồng nhau (dựa vào `postId` trong `comments`) |
    | `POST /posts` | Thêm, **tự sinh `id`** |
    | `PUT /posts/1` · `PATCH /posts/1` · `DELETE /posts/1` | Sửa toàn bộ · sửa một phần · xóa |

- Dùng **json-server 0.17.4**: bản 1.x (beta) đổi cú pháp phân trang và **không** hỗ trợ `q`.
- Biến môi trường của Vite **phải** bắt đầu bằng `VITE_` mới được đưa vào code client. Sửa `.env` xong phải **chạy lại** `npm run dev`.
- `.env` thường không đưa lên git → tạo thêm `.env.example` để người khác biết cần những biến nào.

**Làm từng bước**

1. Cài json-server (đúng phiên bản):

    ```bash
    npm install -D json-server@0.17.4
    ```

2. Tạo `db.json` ở thư mục gốc (cùng cấp `package.json`). Bộ dữ liệu mẫu dưới đây có 20 bài viết, 3 tác giả, 32 bình luận. Chép thêm một bản thành `db.backup.json` để khôi phục sau khi thử:

    <details>
    <summary>Bấm để mở <code>db.json</code> đầy đủ</summary>

    ```json
    {
      "posts": [
        {
          "userId": 1,
          "id": 1,
          "title": "sunt aut facere repellat provident",
          "body": "Nội dung bài viết số 1. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 1,
          "id": 2,
          "title": "qui est esse",
          "body": "Nội dung bài viết số 2. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 1,
          "id": 3,
          "title": "ea molestias quasi exercitationem",
          "body": "Nội dung bài viết số 3. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 1,
          "id": 4,
          "title": "eum et est occaecati",
          "body": "Nội dung bài viết số 4. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 2,
          "id": 5,
          "title": "nesciunt quas odio",
          "body": "Nội dung bài viết số 5. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 2,
          "id": 6,
          "title": "dolorem eum magni eos aperiam",
          "body": "Nội dung bài viết số 6. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 2,
          "id": 7,
          "title": "magnam facilis autem",
          "body": "Nội dung bài viết số 7. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 2,
          "id": 8,
          "title": "dolorem dolore est ipsam",
          "body": "Nội dung bài viết số 8. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 3,
          "id": 9,
          "title": "nesciunt iure omnis dolorem tempora",
          "body": "Nội dung bài viết số 9. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 3,
          "id": 10,
          "title": "optio molestias id quia eum",
          "body": "Nội dung bài viết số 10. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 3,
          "id": 11,
          "title": "et ea vero quia laudantium",
          "body": "Nội dung bài viết số 11. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 3,
          "id": 12,
          "title": "in quibusdam tempore odit est",
          "body": "Nội dung bài viết số 12. quia et suscipit suscipit recusandae consequuntur expedita et cum."
        },
        {
          "userId": 1,
          "id": 13,
          "title": "qui est esse react",
          "body": "Nội dung bài viết số 13 về qui est esse react."
        },
        {
          "userId": 2,
          "id": 14,
          "title": "axios interceptors demo",
          "body": "Nội dung bài viết số 14 về axios interceptors demo."
        },
        {
          "userId": 3,
          "id": 15,
          "title": "react router nested routes",
          "body": "Nội dung bài viết số 15 về react router nested routes."
        },
        {
          "userId": 1,
          "id": 16,
          "title": "json server la gi",
          "body": "Nội dung bài viết số 16 về json server la gi."
        },
        {
          "userId": 2,
          "id": 17,
          "title": "bootstrap card layout",
          "body": "Nội dung bài viết số 17 về bootstrap card layout."
        },
        {
          "userId": 3,
          "id": 18,
          "title": "promise all va allsettled",
          "body": "Nội dung bài viết số 18 về promise all va allsettled."
        },
        {
          "userId": 1,
          "id": 19,
          "title": "abort controller trong react",
          "body": "Nội dung bài viết số 19 về abort controller trong react."
        },
        {
          "userId": 2,
          "id": 20,
          "title": "custom hook useAxios",
          "body": "Nội dung bài viết số 20 về custom hook useAxios."
        }
      ],
      "comments": [
        {
          "postId": 1,
          "id": 1,
          "name": "Bình luận 1",
          "email": "user1@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 1,
          "id": 2,
          "name": "Bình luận 2",
          "email": "user2@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 2,
          "id": 3,
          "name": "Bình luận 3",
          "email": "user3@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 2,
          "id": 4,
          "name": "Bình luận 4",
          "email": "user4@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 3,
          "id": 5,
          "name": "Bình luận 5",
          "email": "user5@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 3,
          "id": 6,
          "name": "Bình luận 6",
          "email": "user6@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 4,
          "id": 7,
          "name": "Bình luận 7",
          "email": "user7@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 4,
          "id": 8,
          "name": "Bình luận 8",
          "email": "user8@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 5,
          "id": 9,
          "name": "Bình luận 9",
          "email": "user9@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 5,
          "id": 10,
          "name": "Bình luận 10",
          "email": "user10@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 6,
          "id": 11,
          "name": "Bình luận 11",
          "email": "user11@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 6,
          "id": 12,
          "name": "Bình luận 12",
          "email": "user12@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 7,
          "id": 13,
          "name": "Bình luận 13",
          "email": "user13@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 7,
          "id": 14,
          "name": "Bình luận 14",
          "email": "user14@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 8,
          "id": 15,
          "name": "Bình luận 15",
          "email": "user15@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 8,
          "id": 16,
          "name": "Bình luận 16",
          "email": "user16@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 9,
          "id": 17,
          "name": "Bình luận 17",
          "email": "user17@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 9,
          "id": 18,
          "name": "Bình luận 18",
          "email": "user18@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 10,
          "id": 19,
          "name": "Bình luận 19",
          "email": "user19@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 10,
          "id": 20,
          "name": "Bình luận 20",
          "email": "user20@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 11,
          "id": 21,
          "name": "Bình luận 21",
          "email": "user21@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 11,
          "id": 22,
          "name": "Bình luận 22",
          "email": "user22@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 12,
          "id": 23,
          "name": "Bình luận 23",
          "email": "user23@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 12,
          "id": 24,
          "name": "Bình luận 24",
          "email": "user24@mail.com",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        },
        {
          "postId": 13,
          "id": 25,
          "name": "Bình luận cho bài 13",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 14,
          "id": 26,
          "name": "Bình luận cho bài 14",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 15,
          "id": 27,
          "name": "Bình luận cho bài 15",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 16,
          "id": 28,
          "name": "Bình luận cho bài 16",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 17,
          "id": 29,
          "name": "Bình luận cho bài 17",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 18,
          "id": 30,
          "name": "Bình luận cho bài 18",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 19,
          "id": 31,
          "name": "Bình luận cho bài 19",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        },
        {
          "postId": 20,
          "id": 32,
          "name": "Bình luận cho bài 20",
          "email": "sv@fpt.edu.vn",
          "body": "Bài viết rất hữu ích!"
        }
      ],
      "users": [
        {
          "id": 1,
          "name": "Leanne Graham",
          "username": "Bret",
          "email": "Sincere@april.biz"
        },
        {
          "id": 2,
          "name": "Ervin Howell",
          "username": "Antonette",
          "email": "Shanna@melissa.tv"
        },
        {
          "id": 3,
          "name": "Clementine Bauch",
          "username": "Samantha",
          "email": "Nathan@yesenia.net"
        }
      ]
    }
    ```

    </details>

3. Thêm script vào `package.json`:

    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "server": "json-server --watch db.json --port 3001 --delay 500"
    }
    ```

    - `--delay 500`: mọi response chậm 500ms → thấy rõ Spinner và dễ thử hủy request.

    > ⚠️ **Lưu ý `--watch`:** với `--watch`, json-server 0.17 theo dõi `db.json` và tự nạp lại khi file đổi. Khi gửi **nhiều request ghi cùng lúc** (xóa hàng loạt ở TODO 10), json-server có thể nạp lại giữa chừng → một số request báo lỗi kết nối (đã chạy thử: xóa 3 bài báo "Xóa thành công 1/3"). Nếu gặp, chạy không có `--watch`: `json-server db.json --port 3001 --delay 500` – dữ liệu **vẫn được ghi thật** vào `db.json`. Chỉ cần `--watch` khi muốn sửa tay `db.json` lúc server đang chạy.

4. Tạo `.env` và `.env.example` ở thư mục gốc:

    ```bash
    # .env
    VITE_API_URL=http://localhost:3001
    ```

    ```bash
    # .env.example – mẫu cho người khác; muốn dùng JSONPlaceholder thì đổi giá trị
    VITE_API_URL=http://localhost:3001
    # VITE_API_URL=https://jsonplaceholder.typicode.com
    ```

    Thêm `.env` vào `.gitignore`.

5. Sửa `src/api/axiosClient.js` – chỉ đổi dòng `baseURL` (có giá trị dự phòng khi thiếu `.env`):

    ```js
    import axios from "axios";

    // NC2 – axios instance dùng chung
    const axiosClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    // Thông báo lỗi thân thiện
    export function getErrorMessage(err) {
      if (err.code === "ECONNABORTED") return "Kết nối quá chậm (timeout)";
      if (err.response) {
        const { status } = err.response;
        if (status === 404) return "Không tìm thấy dữ liệu (404)";
        if (status >= 500) return `Máy chủ lỗi (${status})`;
        return `Yêu cầu không hợp lệ (${status})`;
      }
      if (err.request) return "Không kết nối được server";
      return err.message;
    }

    // Interceptor REQUEST: log + đo thời gian + gắn header
    axiosClient.interceptors.request.use((config) => {
      config.metadata = { start: performance.now() };
      // Ví dụ header xác thực (JSONPlaceholder bỏ qua, nhưng thấy được trong tab Network)
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`, config.params ?? "", config.data ?? "");
      return config;
    });

    // Interceptor RESPONSE: thời gian xử lý + chuẩn hóa lỗi
    axiosClient.interceptors.response.use(
      (response) => {
        response.duration = Math.round(performance.now() - response.config.metadata.start);
        console.log(`✅ ${response.status} ${response.config.url} (${response.duration}ms)`);
        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.log("🚫 Canceled", error.config?.url);
        } else {
          error.userMessage = getErrorMessage(error);
          console.warn("❌", error.config?.url, error.userMessage);
        }
        return Promise.reject(error);
      }
    );

    export default axiosClient;
    ```

6. Hiện API đang dùng trên Navbar – thêm vào `AppNavbar.jsx`, ngay sau `</Nav>`:

    ```jsx
    import { Navbar, Nav, Container } from "react-bootstrap";
    import { NavLink, Link } from "react-router-dom";

    export default function AppNavbar() {
      return (
        <Navbar bg="dark" variant="dark" expand="md">
          <Container>
            <Navbar.Brand as={Link} to="/">Exercise 27 · Nâng cao</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/" end>Axios Demo</Nav.Link>
                <Nav.Link as={NavLink} to="/http">HTTP Requests</Nav.Link>
                <Nav.Link as={NavLink} to="/posts" end>Bài viết</Nav.Link>
                <Nav.Link as={NavLink} to="/posts/new">+ Tạo bài viết</Nav.Link>
              </Nav>
              <Navbar.Text className="small">
                API: {import.meta.env.VITE_API_URL || "http://localhost:3001"}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }
    ```

7. Chạy 2 terminal:

    ```bash
    # Terminal 1
    npm run server      # http://localhost:3001
    # Terminal 2
    npm run dev         # http://localhost:5173 (chạy lại để đọc .env)
    ```

**Checklist TODO 7**
- [ ] http://localhost:3001/posts trả JSON 20 bài; http://localhost:3001/posts/1/comments trả bình luận của bài 1.
- [ ] Navbar hiện `API: http://localhost:3001`.
- [ ] Network: request gửi tới `localhost:3001`, **không** còn `jsonplaceholder`.
- [ ] Tạo bài mới → `db.json` có bài mới với `id` tự sinh (21); F5 `/posts` vẫn thấy bài đó.
- [ ] Sửa (PUT), sửa nhanh (PATCH), xóa (DELETE) → `db.json` thay đổi tương ứng; F5 vẫn đúng.
- [ ] Danh sách có 4 trang (20 bài / 5).
- [ ] Tắt json-server → F5 `/posts` → Alert "Không kết nối được server".
- [ ] Đổi `.env` sang JSONPlaceholder, chạy lại `npm run dev` → app vẫn chạy (không sửa code). Đổi lại.
- [ ] Sau khi thử: tắt server, chép `db.backup.json` đè `db.json`, chạy lại.

---

## TODO 8 – NC8: Custom hook `useAxios`

**Yêu cầu**
1. Gom logic lặp lại (`loading`, `error`, `data`, `AbortController`) thành hook:

    ```js
    const { data, loading, error, refetch } = useAxios(
      (signal) => postApi.getAll({ _limit: 10 }, signal), // hàm gọi API
      []                                                  // deps
    );
    ```
2. Áp dụng hook cho **mọi component chỉ có GET** (và phần GET của các trang).
3. Thêm nút **Thử lại** gọi `refetch()` khi có lỗi.

**Lý thuyết cần nắm**
- Đến TODO 7, mỗi component GET lặp lại ~20 dòng giống hệt nhau: 3 `useState` + `useEffect` + `AbortController` + `isCancel` + `finally`. Custom hook = hàm tên bắt đầu bằng `use`, bên trong gọi hook khác → **chia sẻ logic**, mỗi component vẫn có state riêng.
- Thiết kế `useAxios` trong lời giải:

    | Thành phần | Vai trò |
    |---|---|
    | `requestFn(signal)` | Hàm gọi API, trả về axios response (hoặc object có `data`, `headers`) |
    | `deps` | Giá trị mà `requestFn` dùng (như deps của `useEffect`) – nên là số/chuỗi |
    | `key = JSON.stringify([...deps, reloadKey])` | Đại diện cho bộ tham số hiện tại |
    | `doneKey` | Bộ tham số đã tải xong → `loading = enabled && doneKey !== key`, tính ngay khi render, không "nháy" |
    | `refetch()` | Tăng `reloadKey` → `key` đổi → effect chạy lại |
    | `setData` | Cho trang sửa dữ liệu cục bộ (xóa dòng, cập nhật sau PATCH) |
    | `headers` | Đọc `x-total-count` để phân trang |
    | `options.enabled`, `options.initialData` | Gọi có điều kiện; giá trị ban đầu (`[]` cho danh sách) |

- `requestFn` tạo mới mỗi lần render → **không** đưa vào deps của `useEffect` (sẽ gọi API vô hạn). Người dùng hook phải liệt kê đủ giá trị trong `deps`.
- `AsyncContent`: component hiển thị theo thứ tự **LOADING → ERROR → EMPTY → SUCCESS**, nhận `children` dạng hàm `(data) => JSX`.

**Làm từng bước**

1. `src/hooks/useAxios.js`:

    ```js
    import { useState, useEffect, useCallback } from "react";
    import axios from "axios";

    /**
     * useAxios – gọi API bằng axios trong useEffect
     *
     * @param {(signal: AbortSignal) => Promise<{data, headers?}>} requestFn
     *        Hàm nhận `signal`, trả về axios response (hoặc object có `data`)
     * @param {Array} deps   Các giá trị mà requestFn phụ thuộc (giống deps của useEffect)
     * @param {Object} options
     *        - enabled:     false → không gọi API (fetch có điều kiện)
     *        - initialData: giá trị data ban đầu (vd [] cho danh sách)
     *
     * @returns { data, setData, headers, loading, error, refetch }
     */
    export default function useAxios(requestFn, deps = [], { enabled = true, initialData = null } = {}) {
      const [data, setData] = useState(initialData);
      const [headers, setHeaders] = useState({});
      const [error, setError] = useState(null);
      const [reloadKey, setReloadKey] = useState(0);
      const [doneKey, setDoneKey] = useState(null);   // "khóa" của lần tải đã hoàn tất

      // Khóa đại diện cho bộ tham số hiện tại (deps là giá trị nguyên thủy: số, chuỗi...)
      const key = JSON.stringify([...deps, reloadKey]);

      useEffect(() => {
        if (!enabled) return;                         // ⑤ fetch có điều kiện

        const controller = new AbortController();    // 6.4 chống race condition

        const run = async () => {
          setError(null);
          try {
            const res = await requestFn(controller.signal);
            setData(res.data);
            setHeaders(res.headers ?? {});
          } catch (err) {
            if (axios.isCancel(err)) return;         // bị hủy → không phải lỗi
            setError(err.userMessage ?? err.message);
          } finally {
            if (!controller.signal.aborted) setDoneKey(key); // đánh dấu: tải xong cho bộ tham số này
          }
        };

        run();
        return () => controller.abort();             // cleanup: deps đổi / unmount
        // requestFn được tạo mới mỗi render → không đưa vào deps;
        // người dùng hook phải liệt kê đủ các giá trị requestFn sử dụng trong `deps`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [key, enabled]);

      // Đang tải = được phép gọi VÀ bộ tham số hiện tại chưa tải xong.
      // Tính trực tiếp khi render → ngay khi deps đổi, loading = true (không bị "nháy" 1 frame).
      const loading = enabled && doneKey !== key;

      const refetch = useCallback(() => setReloadKey((k) => k + 1), []); // ② refetch thủ công

      return { data, setData, headers, loading, error, refetch };
    }
    ```

2. `src/components/common/AsyncContent.jsx`:

    ```jsx
    import LoadingSpinner from "./LoadingSpinner";
    import ErrorAlert from "./ErrorAlert";
    import EmptyState from "./EmptyState";

    const defaultIsEmpty = (data) => data == null || (Array.isArray(data) && data.length === 0);

    /**
     * Hiển thị theo thứ tự: LOADING → ERROR → EMPTY → SUCCESS
     * - keepPrevious: đang tải lại nhưng đã có dữ liệu → giữ dữ liệu cũ + làm mờ
     * - children: render prop (data) => JSX
     */
    export default function AsyncContent({
      loading, error, data, onRetry,
      emptyText, isEmpty = defaultIsEmpty, keepPrevious = false,
      children,
    }) {
      const empty = isEmpty(data);

      if (loading && (!keepPrevious || empty)) return <LoadingSpinner />;
      if (error) return <ErrorAlert message={error} onRetry={onRetry} />;
      if (empty) return <EmptyState text={emptyText} />;

      return <div className={loading ? "opacity-50" : ""}>{children(data)}</div>;
    }
    ```

3. Viết lại 4 card có GET – so sánh độ dài với TODO 5:

    `PostListCard.jsx`:

    ```jsx
    // 2.1 – GET có params  ·  NC8: dùng useAxios
    import { Card, ListGroup } from "react-bootstrap";
    import useAxios from "../../hooks/useAxios";
    import AsyncContent from "../common/AsyncContent";
    import postApi from "../../api/postApi";

    export default function PostListCard() {
      const { data, loading, error, refetch } = useAxios(
        (signal) => postApi.getAll({ userId: 1, _limit: 5 }, signal),
        [],
        { initialData: [] }
      );

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.1 · GET</strong> /posts?userId=1&amp;_limit=5</Card.Header>
          <Card.Body>
            <AsyncContent loading={loading} error={error} data={data} onRetry={refetch} emptyText="Không có bài viết">
              {(posts) => (
                <ListGroup variant="flush">
                  {posts.map((p) => <ListGroup.Item key={p.id}>#{p.id} – {p.title}</ListGroup.Item>)}
                </ListGroup>
              )}
            </AsyncContent>
          </Card.Body>
        </Card>
      );
    }
    ```

    `UpdatePostCard.jsx`:

    ```jsx
    // 2.3 – GET + PUT  ·  NC1 · NC8 (useAxios cho phần GET)
    import { useState, useEffect } from "react";
    import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
    import useAxios from "../../hooks/useAxios";
    import AsyncContent from "../common/AsyncContent";
    import postApi from "../../api/postApi";
    import ResultBox from "./ResultBox";

    const POST_ID = 1;

    export default function UpdatePostCard() {
      const { data, loading, error, refetch } = useAxios((signal) => postApi.getById(POST_ID, signal), []);
      const [form, setForm] = useState(null);
      const [saving, setSaving] = useState(false);
      const [result, setResult] = useState(null);
      const [saveError, setSaveError] = useState(null);

      useEffect(() => { if (data) setForm(data); }, [data]); // đổ dữ liệu cũ vào form

      const handleUpdate = async () => {
        setSaving(true);
        setSaveError(null);
        try {
          // PUT gửi ĐẦY ĐỦ các trường
          const res = await postApi.update(POST_ID, { id: form.id, userId: form.userId, title: form.title, body: form.body });
          setResult({ status: res.status, duration: res.duration, data: res.data });
        } catch (err) {
          setSaveError(err.userMessage);
        } finally {
          setSaving(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.3 · PUT</strong> /posts/{POST_ID}</Card.Header>
          <Card.Body>
            <AsyncContent loading={loading || (!!data && !form)} error={error} data={data} onRetry={refetch}>
              {() => form && (
                <>
                  <Form.Control className="mb-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Form.Control as="textarea" rows={3} className="mb-2" value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })} />
                  <Button variant="primary" onClick={handleUpdate} disabled={saving}>
                    {saving ? <Spinner size="sm" /> : "Cập nhật (PUT)"}
                  </Button>
                </>
              )}
            </AsyncContent>
            {saveError && <Alert variant="danger" className="mt-3 mb-0">{saveError}</Alert>}
            <ResultBox result={result} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `DeletePostCard.jsx` – dùng `setData` của hook để xóa dòng khỏi danh sách:

    ```jsx
    // 2.5 – DELETE  ·  NC1 · NC5 (Modal xác nhận + Toast) · NC8
    import { useState } from "react";
    import { useOutletContext } from "react-router-dom";
    import { Card, ListGroup, Button } from "react-bootstrap";
    import useAxios from "../../hooks/useAxios";
    import AsyncContent from "../common/AsyncContent";
    import ConfirmModal from "../ConfirmModal";
    import postApi from "../../api/postApi";

    export default function DeletePostCard() {
      const { notify } = useOutletContext();
      const { data, setData, loading, error, refetch } = useAxios(
        (signal) => postApi.getAll({ _limit: 5 }, signal),
        [],
        { initialData: [] }
      );
      const [toDelete, setToDelete] = useState(null);
      const [deleting, setDeleting] = useState(false);

      const handleDelete = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(toDelete.id);
          setData((prev) => prev.filter((p) => p.id !== toDelete.id));
          notify("success", `DELETE /posts/${toDelete.id} → ${res.status}`);
          setToDelete(null);
        } catch (err) {
          notify("danger", "Xóa thất bại: " + err.userMessage);
        } finally {
          setDeleting(false);
        }
      };

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.5 · DELETE</strong> /posts/:id</Card.Header>
          <Card.Body>
            <AsyncContent loading={loading} error={error} data={data} onRetry={refetch} emptyText="Đã xóa hết">
              {(posts) => (
                <ListGroup variant="flush">
                  {posts.map((p) => (
                    <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                      <span>#{p.id} – {p.title}</span>
                      <Button size="sm" variant="outline-danger" onClick={() => setToDelete(p)}>Xóa</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </AsyncContent>
          </Card.Body>
          <ConfirmModal show={!!toDelete} title="Xóa bài viết" message={`Xóa bài viết #${toDelete?.id}?`}
            confirmText="Xóa" loading={deleting} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />
        </Card>
      );
    }
    ```

    `RequestConfigCard.jsx` – hàm gọi API trả `{ data: {...} }` theo đúng "hình dạng" mà hook đọc:

    ```jsx
    // 2.6 – axios(config): headers, params, timeout  ·  NC2 (dùng axiosClient) · NC8
    import { Card, ListGroup, Table } from "react-bootstrap";
    import useAxios from "../../hooks/useAxios";
    import AsyncContent from "../common/AsyncContent";
    import axiosClient from "../../api/axiosClient";

    const loadWithConfig = async (signal) => {
      const res = await axiosClient({
        method: "get",
        url: "/posts",
        params: { _page: 1, _limit: 3 },
        headers: { Accept: "application/json", "X-Client": "FER202" },
        timeout: 5000,
        signal,
      });
      return {
        data: {
          status: res.status,
          duration: res.duration,
          contentType: res.headers["content-type"],
          total: res.headers["x-total-count"],
          items: res.data,
        },
      };
    };

    export default function RequestConfigCard() {
      const { data, loading, error, refetch } = useAxios(loadWithConfig, []);

      return (
        <Card className="h-100 shadow-sm">
          <Card.Header><strong>2.6 · axios(config)</strong> headers · params · timeout</Card.Header>
          <Card.Body>
            <AsyncContent loading={loading} error={error} data={data} onRetry={refetch}>
              {(info) => (
                <>
                  <Table size="sm" bordered className="small">
                    <tbody>
                      <tr><th>Status</th><td>{info.status}</td></tr>
                      <tr><th>Thời gian</th><td>{info.duration} ms</td></tr>
                      <tr><th>Content-Type</th><td>{info.contentType}</td></tr>
                      <tr><th>x-total-count</th><td>{info.total}</td></tr>
                    </tbody>
                  </Table>
                  <ListGroup variant="flush">
                    {info.items.map((p) => <ListGroup.Item key={p.id}>{p.title}</ListGroup.Item>)}
                  </ListGroup>
                </>
              )}
            </AsyncContent>
          </Card.Body>
        </Card>
      );
    }
    ```

4. Viết lại các trang:

    `src/pages/PostCreatePage.jsx`:

    ```jsx
    // POST · NC1 · NC5 · NC6 (navigate + state) · NC8 (useAxios cho danh sách tác giả)
    import { useState } from "react";
    import { useNavigate, useOutletContext } from "react-router-dom";
    import { Card } from "react-bootstrap";
    import useAxios from "../hooks/useAxios";
    import postApi, { userApi } from "../api/postApi";
    import PostForm from "../components/PostForm";

    export default function PostCreatePage() {
      const navigate = useNavigate();
      const { notify } = useOutletContext();
      const { data: users } = useAxios((signal) => userApi.getAll(signal), [], { initialData: [] });
      const [submitting, setSubmitting] = useState(false);

      const handleCreate = async (values) => {
        setSubmitting(true);
        try {
          const res = await postApi.create(values);
          navigate("/posts", {
            state: { flash: { bg: "success", message: `POST /posts → ${res.status}. Đã tạo bài viết #${res.data.id}: "${res.data.title}"` } },
          });
        } catch (err) {
          notify("danger", "Tạo thất bại: " + err.userMessage);
          setSubmitting(false);
        }
      };

      return (
        <Card className="shadow-sm">
          <Card.Header as="h4">Tạo bài viết (POST)</Card.Header>
          <Card.Body>
            <PostForm initialValues={{ title: "", body: "", userId: "" }} users={users} submitting={submitting}
              submitLabel="Tạo bài viết" onSubmit={handleCreate} onCancel={() => navigate("/posts")} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `src/pages/PostEditPage.jsx`:

    ```jsx
    // PUT · NC1 · NC3 (Promise.all) · NC8
    import { useState } from "react";
    import { useParams, useNavigate, useOutletContext, Link } from "react-router-dom";
    import { Card, Alert } from "react-bootstrap";
    import useAxios from "../hooks/useAxios";
    import postApi, { userApi } from "../api/postApi";
    import PostForm from "../components/PostForm";
    import LoadingSpinner from "../components/common/LoadingSpinner";

    const loadEditData = async (id, signal) => {
      const [pRes, uRes] = await Promise.all([postApi.getById(id, signal), userApi.getAll(signal)]);
      return { data: { post: pRes.data, users: uRes.data } };
    };

    export default function PostEditPage() {
      const { id } = useParams();
      const navigate = useNavigate();
      const { notify } = useOutletContext();
      const { data, loading, error } = useAxios((signal) => loadEditData(id, signal), [id]);
      const [submitting, setSubmitting] = useState(false);

      const handleUpdate = async (values) => {
        setSubmitting(true);
        try {
          const res = await postApi.update(id, { id: Number(id), ...values }); // PUT gửi đầy đủ
          navigate(`/posts/${id}`, {
            state: { flash: { bg: "success", message: `PUT /posts/${id} → ${res.status}. Đã cập nhật bài viết.` } },
          });
        } catch (err) {
          notify("danger", "Cập nhật thất bại: " + err.userMessage);
          setSubmitting(false);
        }
      };

      if (loading) return <LoadingSpinner />;
      if (error) return <Alert variant="danger">{error} <Alert.Link as={Link} to="/posts">Về danh sách</Alert.Link></Alert>;

      const { post, users } = data;
      return (
        <Card className="shadow-sm">
          <Card.Header as="h4">Sửa bài viết #{id} (PUT)</Card.Header>
          <Card.Body>
            <PostForm initialValues={{ title: post.title, body: post.body, userId: String(post.userId) }} users={users}
              submitting={submitting} submitLabel="Lưu thay đổi" onSubmit={handleUpdate} onCancel={() => navigate(`/posts/${id}`)} />
          </Card.Body>
        </Card>
      );
    }
    ```

    `src/pages/PostDetailPage.jsx` (thay khối `useState` + `useEffect` bằng 1 dòng `useAxios`):

    ```jsx
    // NC3 (tuần tự rồi song song, allSettled, đo thời gian) · PATCH · DELETE · NC8
    import { useState, useEffect } from "react";
    import axios from "axios";
    import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
    import { Card, Spinner, Alert, Button, ListGroup, Form, InputGroup, Badge, Table } from "react-bootstrap";
    import useAxios from "../hooks/useAxios";
    import useFlash from "../hooks/useFlash";
    import postApi, { userApi } from "../api/postApi";
    import ConfirmModal from "../components/ConfirmModal";
    import LoadingSpinner from "../components/common/LoadingSpinner";

    // Bước 1 tuần tự (cần userId) → bước 2 song song, chấp nhận lỗi một phần
    const loadDetail = async (id, signal) => {
      const { data: post } = await postApi.getById(id, signal);
      const [userResult, commentsResult] = await Promise.allSettled([
        userApi.getById(post.userId, signal),
        postApi.getComments(id, signal),
      ]);
      if (signal.aborted) throw new axios.CanceledError(); // bị hủy giữa chừng → useAxios bỏ qua
      return {
        data: {
          post,
          author: userResult.status === "fulfilled" ? userResult.value.data : null,
          comments: commentsResult.status === "fulfilled" ? commentsResult.value.data : [],
          warning: [userResult, commentsResult].some((r) => r.status === "rejected")
            ? "Một số thông tin phụ (tác giả / bình luận) không tải được."
            : null,
        },
      };
    };

    // NC3.2 – So sánh thời gian tuần tự và song song
    const measure = async (id) => {
      let t0 = performance.now();
      const { data: p1 } = await postApi.getById(id);
      await userApi.getById(p1.userId);
      await postApi.getComments(id);
      const sequential = Math.round(performance.now() - t0);

      t0 = performance.now();
      const { data: p2 } = await postApi.getById(id);
      await Promise.all([userApi.getById(p2.userId), postApi.getComments(id)]);
      const parallel = Math.round(performance.now() - t0);
      return { sequential, parallel };
    };

    export default function PostDetailPage() {
      useFlash();
      const { id } = useParams();
      const navigate = useNavigate();
      const { notify } = useOutletContext();

      const { data, setData, loading, error, refetch } = useAxios((signal) => loadDetail(id, signal), [id]);

      const [quickTitle, setQuickTitle] = useState("");
      const [patching, setPatching] = useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const [deleting, setDeleting] = useState(false);
      const [timing, setTiming] = useState(null);
      const [measuring, setMeasuring] = useState(false);

      useEffect(() => { if (data) setQuickTitle(data.post.title); }, [data]);

      // PATCH – chỉ gửi title
      const handlePatch = async (e) => {
        e.preventDefault();
        if (quickTitle.trim().length < 5) return notify("warning", "Tiêu đề tối thiểu 5 ký tự");
        setPatching(true);
        try {
          const res = await postApi.patch(id, { title: quickTitle.trim() });
          setData((prev) => ({ ...prev, post: { ...prev.post, ...res.data } }));
          notify("success", `PATCH /posts/${id} → ${res.status}`);
        } catch (err) {
          notify("danger", "Cập nhật thất bại: " + err.userMessage);
        } finally {
          setPatching(false);
        }
      };

      // DELETE – xong thì về danh sách kèm thông báo
      const handleDelete = async () => {
        setDeleting(true);
        try {
          const res = await postApi.remove(id);
          navigate("/posts", { state: { flash: { bg: "success", message: `DELETE /posts/${id} → ${res.status}. Đã xóa bài viết.` } } });
        } catch (err) {
          notify("danger", "Xóa thất bại: " + err.userMessage);
          setDeleting(false);
          setShowDelete(false);
        }
      };

      const handleMeasure = async () => {
        setMeasuring(true);
        try { setTiming(await measure(id)); }
        catch (err) { notify("danger", err.userMessage ?? err.message); }
        finally { setMeasuring(false); }
      };

      if (loading) return <LoadingSpinner />;
      if (error) {
        return (
          <Alert variant="warning">
            {error} – bài viết #{id}. <Alert.Link as={Link} to="/posts">Quay lại danh sách</Alert.Link>{" "}
            <Button size="sm" variant="outline-secondary" className="ms-2" onClick={refetch}>Thử lại</Button>
          </Alert>
        );
      }

      const { post, author, comments, warning } = data;

      return (
        <>
          <Button variant="link" className="px-0 mb-2" onClick={() => navigate(-1)}>← Quay lại</Button>
          {warning && <Alert variant="warning">{warning}</Alert>}

          <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span>Post #{post.id} · <strong>{author?.name ?? `User ${post.userId}`}</strong>{author && ` (${author.email})`}</span>
              <span>
                <Button as={Link} to={`/posts/${post.id}/edit`} size="sm" variant="outline-primary" className="me-2">Sửa (PUT)</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setShowDelete(true)}>Xóa</Button>
              </span>
            </Card.Header>
            <Card.Body>
              <Card.Title as="h2" className="fs-3">{post.title}</Card.Title>
              <Card.Text style={{ whiteSpace: "pre-line" }}>{post.body}</Card.Text>

              <Form onSubmit={handlePatch} className="mt-4">
                <Form.Label className="small text-muted">Sửa nhanh tiêu đề (PATCH)</Form.Label>
                <InputGroup>
                  <Form.Control value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} />
                  <Button type="submit" variant="warning" disabled={patching || quickTitle === post.title}>
                    {patching ? <Spinner size="sm" /> : "PATCH"}
                  </Button>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>NC3 · So sánh tuần tự và song song</Card.Header>
            <Card.Body>
              <Button size="sm" onClick={handleMeasure} disabled={measuring}>
                {measuring ? <><Spinner size="sm" /> Đang đo...</> : "Đo thời gian"}
              </Button>
              {timing && (
                <Table size="sm" bordered className="mt-3 mb-0" style={{ maxWidth: 360 }}>
                  <tbody>
                    <tr><th>Tuần tự (3 request nối tiếp)</th><td>{timing.sequential} ms</td></tr>
                    <tr><th>Song song (1 + Promise.all)</th><td>{timing.parallel} ms</td></tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          <h4>Bình luận <Badge bg="secondary">{comments.length}</Badge></h4>
          <ListGroup>
            {comments.map((c) => (
              <ListGroup.Item key={c.id}>
                <div className="fw-semibold">{c.name}</div>
                <small className="text-muted">{c.email}</small>
                <div>{c.body}</div>
              </ListGroup.Item>
            ))}
            {comments.length === 0 && <ListGroup.Item className="text-muted">Chưa có bình luận</ListGroup.Item>}
          </ListGroup>

          <ConfirmModal show={showDelete} title="Xóa bài viết" message={`Xóa bài viết #${post.id}?`}
            confirmText="Xóa" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
        </>
      );
    }
    ```

5. `src/pages/PostListPage.jsx` – thay **2 khối** `useEffect` (tác giả, bài viết) bằng `useAxios`:

    ```jsx
    // Xóa: import axios, các state users/posts/total/loading/error/reloadKey và 2 useEffect
    // (useEffect tạm chưa dùng tới – TODO 9 sẽ dùng lại)
    import useAxios from "../hooks/useAxios";

    // ----- NC8: đọc dữ liệu bằng useAxios -----
    const { data: users } = useAxios((signal) => userApi.getAll(signal), [], { initialData: [] });

    const params = { _page: page, _limit: LIMIT };
    if (userId) params.userId = userId;

    const { data: posts, setData: setPosts, headers, loading, error, refetch } = useAxios(
      (signal) => postApi.getAll(params, signal),
      [page, userId],
      { initialData: [] }
    );

    const total = Number(headers["x-total-count"] ?? posts.length);
    ```

    Trong `handleDeleteOne`, thay `setTotal((t) => t - 1)` bằng `refetch()` (tải lại trang hiện tại để lấp chỗ trống và cập nhật tổng). Nút Thử lại: `<ErrorAlert message={error} onRetry={refetch} />`.

    `AxiosDemoPage` **giữ nguyên** bản viết tay (để so sánh với hook).

**Checklist TODO 8**
- [ ] Không còn component nào (trừ `AxiosDemoPage`) tự viết `new AbortController()` cho GET.
- [ ] Mọi chỗ `useAxios` đều liệt kê đủ deps (`[id]`, `[page, userId]`...).
- [ ] Tắt json-server → F5 `/http` và `/posts` → Alert đỏ có nút **Thử lại**; bật server, bấm Thử lại → có dữ liệu, không F5.
- [ ] `/posts/1` → `/posts/2` (sửa URL hoặc từ AxiosDemo) → dữ liệu đổi đúng; Network có request cũ *(canceled)* nếu bấm nhanh.
- [ ] Không có request lặp vô hạn trong Network.

---

## TODO 9 – NC9: Tìm kiếm có debounce

**Yêu cầu**
1. Thêm ô tìm kiếm ở danh sách bài viết, gọi API với `params: { q: keyword }` (json-server).
2. Chỉ gọi API **sau khi người dùng ngừng gõ 500ms**: dùng `setTimeout` trong `useEffect`, `clearTimeout` trong cleanup.
3. Lưu `q` trên URL.

**Lý thuyết cần nắm**

```
Gõ:      m   a   c   b   o   o   k            (mỗi phím cách nhau 100ms)
Timer:   ✗   ✗   ✗   ✗   ✗   ✗   ✓ ── 500ms ──► debounced = "macbook" → 1 request
```

- Mỗi lần `value` đổi, cleanup `clearTimeout` hủy bộ đếm cũ, đặt bộ đếm mới → chỉ khi **ngừng gõ** đủ `delay` ms giá trị mới được "chốt".
- Debounce giảm số request **gửi đi**; AbortController hủy request **đã gửi** nhưng chưa về. Hai kỹ thuật bổ sung nhau.
- Hai state khác nhau: `keyword` (ô nhập, đổi theo từng phím) và `q` trên URL (đổi sau debounce). Đổi `q` thì `page` về 1.
- `q` là tính năng của json-server (tìm trong mọi trường chuỗi); JSONPlaceholder bỏ qua `q`.

**Làm từng bước**

1. `src/hooks/useDebounce.js`:

    ```js
    import { useState, useEffect } from "react";

    export default function useDebounce(value, delay = 500) {
      const [debounced, setDebounced] = useState(value);
      useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer); // giá trị đổi trước khi hết delay → hủy timer cũ
      }, [value, delay]);
      return debounced;
    }
    ```

2. Sửa `src/pages/PostListPage.jsx`:

    a. Đọc `q` từ URL và đưa vào `changeQuery`:

    ```jsx
    const q = searchParams.get("q") ?? "";

    const changeQuery = (next) => {
      const merged = { page: String(page), userId, q, ...next };
      Object.keys(merged).forEach((k) => (merged[k] === "" || merged[k] == null) && delete merged[k]);
      setSearchParams(merged);
    };
    ```

    b. State ô nhập + debounce → ghi `q` lên URL, về trang 1:

    ```jsx
    import useDebounce from "../hooks/useDebounce";

    // ----- NC9: ô tìm kiếm + debounce 500ms → ghi q lên URL -----
    const [keyword, setKeyword] = useState(q);
    const debounced = useDebounce(keyword.trim(), 500);
    useEffect(() => {
      if (debounced !== q) changeQuery({ q: debounced, page: "1" });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    ```

    c. Thêm `q` vào params và deps của `useAxios`:

    ```jsx
    const params = { _page: page, _limit: LIMIT };
    if (userId) params.userId = userId;
    if (q) params.q = q;

    const { data: posts, setData: setPosts, headers, loading, error, refetch } = useAxios(
      (signal) => postApi.getAll(params, signal),
      [page, userId, q],
      { initialData: [] }
    );
    ```

    d. Ô tìm kiếm (đặt trong `<Row>` trước ô chọn tác giả; import thêm `InputGroup`):

    ```jsx
    <Col md={6}>
      <InputGroup>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control placeholder="Tìm bài viết..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        {keyword && <Button variant="outline-secondary" onClick={() => setKeyword("")}>✕</Button>}
      </InputGroup>
    </Col>
    ```

    Code đầy đủ của trang ở TODO 10.

**Checklist TODO 9**
- [ ] Gõ "qui" thật nhanh → Network chỉ **1** request `/posts?_page=1&_limit=5&q=qui` (sau ~500ms ngừng gõ).
- [ ] URL thành `/posts?page=1&q=qui`; F5 → ô tìm kiếm vẫn có "qui", kết quả giữ nguyên.
- [ ] Đang ở trang 3, gõ từ khóa → về trang 1.
- [ ] Kết hợp tác giả + từ khóa → URL có cả `userId` và `q`.
- [ ] Bấm ✕ → xóa từ khóa, `q` biến khỏi URL.
- [ ] Từ khóa không khớp → "Không có bài viết phù hợp".

---

## TODO 10 – NC10: Thao tác hàng loạt và optimistic update

**Yêu cầu**
1. Danh sách có **checkbox** mỗi dòng (và ô "chọn tất cả" ở header cho trang hiện tại). Nút **Xóa đã chọn** gửi nhiều DELETE **song song** bằng `Promise.allSettled`, rồi báo **"Xóa thành công X/Y"**.
2. Xóa **một** bài theo kiểu **optimistic**: xóa khỏi giao diện **ngay**, sau đó gọi API; lỗi thì **khôi phục** lại.

**Lý thuyết cần nắm**
- **Xóa hàng loạt:** `allSettled` vì các DELETE độc lập – 1 bài xóa lỗi không được làm hỏng kết quả các bài khác. `results[i]` cùng thứ tự với `selectedIds[i]` → lọc ra `okIds`. Bỏ khỏi danh sách và bỏ chọn **chỉ** các bài xóa thành công.
- **Optimistic update** (cập nhật lạc quan):

    ```
    Bình thường : bấm Xóa → chờ server 500ms → dòng biến mất         (chậm)
    Optimistic  : bấm Xóa → dòng biến mất NGAY → gọi server
                                                 ├─ OK  → giữ nguyên
                                                 └─ Lỗi → khôi phục bản sao + Toast lỗi
    ```

    Các bước: (1) lưu bản sao `backup = posts` → (2) `setPosts(bỏ dòng)` → (3) `await remove` → (4) lỗi thì `setPosts(backup)`.
- `removed`: số bài đã xóa ở trang hiện tại, trừ vào `x-total-count` để Badge tổng và số trang cập nhật ngay mà không cần gọi lại API.
- Chọn nhiều: lưu mảng `selectedIds`; đổi trang/bộ lọc thì xóa lựa chọn.

**Làm từng bước**

`src/pages/PostListPage.jsx` – phiên bản đầy đủ (gồm TODO 6 + 8 + 9 + 10):

```jsx
// NC6 (useSearchParams) · NC8 (useAxios) · NC9 (tìm kiếm debounce, q trên URL) · NC10 (xóa hàng loạt + optimistic)
import { useState, useEffect } from "react";
import { Link, useSearchParams, useOutletContext } from "react-router-dom";
import { Table, Form, Pagination, Spinner, Button, Row, Col, Badge, InputGroup } from "react-bootstrap";
import useAxios from "../hooks/useAxios";
import useDebounce from "../hooks/useDebounce";
import useFlash from "../hooks/useFlash";
import postApi, { userApi } from "../api/postApi";
import ConfirmModal from "../components/ConfirmModal";
import ErrorAlert from "../components/common/ErrorAlert";

const LIMIT = 5;

export default function PostListPage() {
  useFlash();
  const { notify } = useOutletContext();

  // ----- Trạng thái lọc lưu trên URL: /posts?page=2&userId=1&q=react -----
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const userId = searchParams.get("userId") ?? "";
  const q = searchParams.get("q") ?? "";

  const changeQuery = (next) => {
    const merged = { page: String(page), userId, q, ...next };
    Object.keys(merged).forEach((k) => (merged[k] === "" || merged[k] == null) && delete merged[k]);
    setSearchParams(merged);
  };

  // ----- NC9: ô tìm kiếm + debounce 500ms → ghi q lên URL -----
  const [keyword, setKeyword] = useState(q);
  const debounced = useDebounce(keyword.trim(), 500);
  useEffect(() => {
    if (debounced !== q) changeQuery({ q: debounced, page: "1" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // ----- NC8: đọc dữ liệu bằng useAxios -----
  const { data: users } = useAxios((signal) => userApi.getAll(signal), [], { initialData: [] });

  const params = { _page: page, _limit: LIMIT };
  if (userId) params.userId = userId;
  if (q) params.q = q;

  const { data: posts, setData: setPosts, headers, loading, error, refetch } = useAxios(
    (signal) => postApi.getAll(params, signal),
    [page, userId, q],
    { initialData: [] }
  );

  const [removed, setRemoved] = useState(0); // số bài đã xóa ở trang hiện tại (để cập nhật tổng)
  useEffect(() => setRemoved(0), [page, userId, q]);
  const total = Math.max(0, Number(headers["x-total-count"] ?? posts.length) - removed);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const authorName = (id) => users.find((u) => u.id === id)?.name ?? `User ${id}`;

  // ----- NC10.2: xóa 1 bài – optimistic update + rollback -----
  const [toDelete, setToDelete] = useState(null);
  const handleDeleteOne = async () => {
    const post = toDelete;
    setToDelete(null);
    const backup = posts;
    setPosts((prev) => prev.filter((p) => p.id !== post.id)); // 1. cập nhật giao diện ngay
    setRemoved((n) => n + 1);
    try {
      const res = await postApi.remove(post.id);              // 2. gọi API
      notify("success", `DELETE /posts/${post.id} → ${res.status}`);
    } catch (err) {
      setPosts(backup);                                       // 3. lỗi → khôi phục
      setRemoved((n) => n - 1);
      notify("danger", `Xóa thất bại (${err.userMessage}) – đã khôi phục`);
    }
  };

  // ----- NC10.1: xóa hàng loạt – Promise.allSettled -----
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  useEffect(() => setSelectedIds([]), [page, userId, q]);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const allChecked = posts.length > 0 && posts.every((p) => selectedIds.includes(p.id));
  const toggleAll = () => setSelectedIds(allChecked ? [] : posts.map((p) => p.id));

  const handleDeleteMany = async () => {
    setBulkDeleting(true);
    const results = await Promise.allSettled(selectedIds.map((id) => postApi.remove(id)));
    const okIds = selectedIds.filter((_, i) => results[i].status === "fulfilled");
    setPosts((prev) => prev.filter((p) => !okIds.includes(p.id)));
    setRemoved((n) => n + okIds.length);
    setSelectedIds((prev) => prev.filter((id) => !okIds.includes(id)));
    notify(okIds.length === selectedIds.length ? "success" : "warning",
      `Xóa thành công ${okIds.length}/${selectedIds.length} bài viết`);
    setBulkDeleting(false);
    setConfirmBulk(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="m-0">Bài viết <Badge bg="secondary">{total}</Badge></h2>
        <div>
          <Button variant="danger" className="me-2" disabled={!selectedIds.length} onClick={() => setConfirmBulk(true)}>
            Xóa đã chọn ({selectedIds.length})
          </Button>
          <Button as={Link} to="/posts/new">+ Tạo bài viết</Button>
        </div>
      </div>

      <Row className="mb-3 g-2">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control placeholder="Tìm bài viết..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            {keyword && <Button variant="outline-secondary" onClick={() => setKeyword("")}>✕</Button>}
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={userId} onChange={(e) => changeQuery({ userId: e.target.value, page: "1" })}>
            <option value="">Tất cả tác giả</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex align-items-center">{loading && <Spinner size="sm" />}</Col>
      </Row>

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      <Table striped bordered hover responsive className={loading ? "opacity-50" : ""}>
        <thead>
          <tr>
            <th style={{ width: 40 }}><Form.Check checked={allChecked} onChange={toggleAll} aria-label="Chọn tất cả" /></th>
            <th style={{ width: 60 }}>#</th><th>Tiêu đề</th><th style={{ width: 170 }}>Tác giả</th><th style={{ width: 190 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td><Form.Check checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} aria-label={`Chọn ${p.id}`} /></td>
              <td>{p.id}</td>
              <td><Link to={`/posts/${p.id}`}>{p.title}</Link></td>
              <td>{authorName(p.userId)}</td>
              <td>
                <Button as={Link} to={`/posts/${p.id}`} size="sm" variant="outline-info" className="me-1">Xem</Button>
                <Button as={Link} to={`/posts/${p.id}/edit`} size="sm" variant="outline-primary" className="me-1">Sửa</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setToDelete(p)}>Xóa</Button>
              </td>
            </tr>
          ))}
          {!loading && posts.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted">Không có bài viết phù hợp</td></tr>
          )}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev disabled={page <= 1} onClick={() => changeQuery({ page: String(page - 1) })} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <Pagination.Item key={n} active={n === page} onClick={() => changeQuery({ page: String(n) })}>{n}</Pagination.Item>
        ))}
        <Pagination.Next disabled={page >= totalPages} onClick={() => changeQuery({ page: String(page + 1) })} />
      </Pagination>

      <ConfirmModal show={!!toDelete} title="Xóa bài viết"
        message={<>Xóa <strong>#{toDelete?.id} {toDelete?.title}</strong>?</>}
        confirmText="Xóa" onConfirm={handleDeleteOne} onCancel={() => setToDelete(null)} />

      <ConfirmModal show={confirmBulk} title="Xóa nhiều bài viết"
        message={`Xóa ${selectedIds.length} bài viết đã chọn (#${selectedIds.join(", #")})?`}
        confirmText="Xóa tất cả" loading={bulkDeleting} onConfirm={handleDeleteMany} onCancel={() => setConfirmBulk(false)} />
    </>
  );
}
```

**Checklist TODO 10**
- [ ] Tích 3 bài → nút "Xóa đã chọn (3)" → Modal liệt kê `#id` → xác nhận → Network có 3 DELETE **cùng lúc** → Toast "Xóa thành công 3/3 bài viết".
- [ ] `db.json` mất đúng 3 bài; Badge tổng giảm 3.
- [ ] Ô "chọn tất cả" chọn/bỏ chọn cả trang; đổi trang → bỏ hết lựa chọn.
- [ ] **Thử lỗi một phần:** tích 2 bài, mở tab khác xóa trước 1 bài (qua `/posts/:id`), quay lại xóa hàng loạt → "Xóa thành công 1/2", bài lỗi vẫn được chọn.
- [ ] Xóa 1 bài: dòng biến mất **ngay** khi xác nhận (trước khi request xong – thấy rõ với `--delay 500`).
- [ ] **Thử optimistic:** tắt json-server → xóa 1 bài → dòng biến mất rồi **xuất hiện lại** + Toast đỏ "Xóa thất bại (...) – đã khôi phục".
- [ ] Nếu xóa hàng loạt báo thiếu (vd 1/3) dù server đang chạy → xem lưu ý `--watch` ở TODO 7.

---

## Phần III. Kiểm thử tổng

Chuẩn bị: khôi phục `db.json` từ `db.backup.json`, chạy `npm run server` và `npm run dev`, mở DevTools (Console + Network).

| # | Thao tác | Kết quả mong đợi | TODO | Đạt |
|---|---|---|---|---|
| 1 | Vào `/`, đổi Post ID 1 → 5 | Hiện bài #5, footer có status 200 + thời gian | 4, 5 | [ ] |
| 2 | Slow 3G, bấm "Sau ›" 4 lần nhanh | 3 request *(canceled)*, hiện đúng bài cuối, không lỗi | 4 | [ ] |
| 3 | Post ID = 999 | Alert "Không tìm thấy dữ liệu (404)" | 2, 4 | [ ] |
| 4 | Vào `/http` | 6 card, mỗi card có Spinner → dữ liệu | 5, 8 | [ ] |
| 5 | Card POST: title 3 ký tự | Ô đỏ, không gửi request | 5 | [ ] |
| 6 | Card DELETE: Xóa 1 bài | Modal → Toast "DELETE /posts/x → 200" | 5, 6 | [ ] |
| 7 | `/posts`, chọn tác giả, sang trang 2, F5 | URL `?page=2&userId=…`, F5 giữ nguyên | 6 | [ ] |
| 8 | Gõ "qui" nhanh vào ô tìm kiếm | 1 request `q=qui`, URL có `q` | 9 | [ ] |
| 9 | `/posts/new` tạo bài hợp lệ | Về `/posts` + Toast "201 … #21"; `db.json` có bài mới | 6, 7 | [ ] |
| 10 | `/posts/1` sửa nhanh tiêu đề | PATCH chỉ `{ title }`, Toast 200 | 6 | [ ] |
| 11 | `/posts/1` → Đo thời gian | Song song < Tuần tự | 3 | [ ] |
| 12 | Sửa tạm URL bình luận sai, mở `/posts/1` | Bài + tác giả vẫn hiện, có cảnh báo vàng | 3 | [ ] |
| 13 | `/posts/1/edit` → Lưu | PUT đủ trường → về `/posts/1` + Toast | 6 | [ ] |
| 14 | Xóa hàng loạt 3 bài | 3 DELETE song song, "Xóa thành công 3/3" | 10 | [ ] |
| 15 | Tắt server, xóa 1 bài | Dòng biến mất rồi khôi phục + Toast lỗi | 10 | [ ] |
| 16 | Tắt server, F5 `/posts` → bật lại → Thử lại | Alert "Không kết nối được server" → có dữ liệu | 2, 8 | [ ] |
| 17 | `/abc` | Trang 404 có Navbar | 6 | [ ] |
| 18 | F5 sau mọi thao tác ở 9, 10, 13, 14 | Dữ liệu vẫn đúng (lưu trong `db.json`) | 7 | [ ] |

**Kiểm tra tĩnh** (Ctrl+Shift+F trong `src/`):

| Tìm | Kết quả phải là |
|---|---|
| `.then(` | 0 kết quả |
| `useEffect(async` | 0 kết quả |
| `jsonplaceholder` / `localhost:3001` | chỉ trong `axiosClient.js` / `AppNavbar.jsx` (giá trị dự phòng) |
| `window.confirm` / `alert(` | 0 kết quả |
| `Promise.all(` | `PostDetailPage` (đo thời gian), `PostEditPage` |
| `Promise.allSettled(` | `PostDetailPage`, `PostListPage` |

Chạy thêm `npm run build` → phải thành công, Console không có lỗi đỏ hay cảnh báo thiếu `key`.

---

## Phần IV. Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Cảnh báo `useEffect must not return anything besides a function` | Viết `useEffect(async () => ...)` | Khai báo hàm async bên trong rồi gọi |
| Loading không bao giờ tắt khi lỗi | `setLoading(false)` đặt trong `try` | Đặt trong `finally` |
| `err.userMessage` là `undefined` | Lỗi không đi qua `axiosClient` (còn dùng `axios` trực tiếp) hoặc lỗi do code JS | Gọi API qua `postApi`; fallback `err.userMessage ?? err.message` |
| Đổi id nhanh, đôi khi hiện bài cũ | Thiếu `abort()` trong cleanup | `return () => controller.abort()` |
| Đổi bộ lọc hiện lỗi "canceled" một thoáng | Không bỏ qua lỗi hủy | `if (axios.isCancel(err)) return;` |
| Trang chi tiết hiện bài cũ dù đã hủy | `Promise.allSettled` không ném lỗi hủy | Sau `await` kiểm tra `signal.aborted` rồi ném `CanceledError` |
| Mới vào trang thấy 2 request, 1 cái *(canceled)* | StrictMode chạy effect 2 lần ở dev | Bình thường – chứng tỏ cleanup đúng |
| Gọi API vô hạn | Đưa hàm/object tạo mới mỗi render vào deps | deps là giá trị nguyên thủy (`id`, `page`); `useAxios` không đưa `requestFn` vào deps |
| Không có phân trang / `NaN` trang | Không truyền `_page`, hoặc đọc `headers['X-Total-Count']` | Có `_page` + `_limit`; tên header **chữ thường** `x-total-count` |
| `useParams` trả `"5"`, so sánh `=== 5` sai | Tham số URL luôn là chuỗi | `Number(id)` |
| `useOutletContext()` trả `undefined` | Component không nằm trong route con của `Layout` | Đặt route bên trong `<Route element={<Layout />}>` |
| Toast "Đã tạo..." hiện lại khi F5 | `location.state` vẫn còn | `useFlash` xóa state bằng `navigate(..., { replace: true, state: null })` |
| Mục "Bài viết" sáng cả ở `/posts/new` | `NavLink` thiếu `end` | `<Nav.Link as={NavLink} to="/posts" end>` |
| Sửa `.env` không có tác dụng | Vite chỉ đọc `.env` khi khởi động / thiếu tiền tố `VITE_` | Chạy lại `npm run dev`; đặt tên `VITE_API_URL` |
| `GET /posts?q=…` không lọc | Đang dùng JSONPlaceholder hoặc json-server 1.x | Dùng json-server **0.17.4** |
| Xóa hàng loạt báo "1/3" dù server chạy | json-server `--watch` nạp lại `db.json` giữa lúc ghi song song | Chạy `json-server db.json` không `--watch` |
| PUT xong mất trường `userId` | PUT chỉ gửi `title`, `body` | PUT gửi **đủ** `{ id, title, body, userId }` |
| Cảnh báo `Each child in a list should have a unique "key"` | Thiếu `key` khi `map` | `key={p.id}` |

---

---

## Phần V. Checklist tổng

**Phần 1–2 (giữ nguyên yêu cầu cũ)**
- [ ] GET `/posts/1` hiển thị đúng title/body; có Loading và Error.
- [ ] GET dùng `params`, không tự ghép chuỗi query.
- [ ] POST trả `201`; nút bị disable khi đang gửi.
- [ ] PUT gửi đủ các trường; PATCH chỉ gửi trường thay đổi. Giải thích được sự khác nhau.
- [ ] DELETE trả `200`, giao diện cập nhật bằng `filter`.
- [ ] Dùng được `axios(config)` với `headers`, `params`, `timeout`; đọc được response headers.
- [ ] POST/PUT/PATCH/DELETE nằm trong **event handler**, không nằm trong `useEffect`.

**Phần 3**
- [ ] NC1 – async/await + try/catch/finally, không còn `.then()`.
- [ ] NC2 – axios instance + 2 interceptor (log, token, thời gian, lỗi tiếng Việt) + tầng service.
- [ ] NC3 – `Promise.all` / `allSettled`; đo được tuần tự vs song song.
- [ ] NC4 – AbortController + `axios.isCancel`; request cũ *(canceled)*.
- [ ] NC5 – react-bootstrap (Spinner, Alert, Card, Form + validate, Modal, Toast).
- [ ] NC6 – React Router: routes lồng nhau, `useParams`, `useNavigate`, `useSearchParams`, thông báo qua `state`, trang 404.
- [ ] NC7 – json-server 0.17.4 + `.env`; `db.json` thay đổi thật.
- [ ] NC8 – custom hook `useAxios` + nút Thử lại.
- [ ] NC9 – tìm kiếm debounce 500ms, `q` trên URL.
- [ ] NC10 – xóa hàng loạt `allSettled` "X/Y" + optimistic update có khôi phục.

