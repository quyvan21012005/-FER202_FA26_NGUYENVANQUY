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
