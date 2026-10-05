import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-card">
      <h2>Bảng Điều Khiển (Dashboard)</h2>
      <div className="user-info">
        <p>Xin chào, <b>{user?.username}</b>!</p>
        <p>Vai trò: <span className="badge">{user?.role}</span></p>
        <p className="success-text">🎉 Bạn đã truy cập thành công vào trang được bảo vệ bởi ProtectedRoute!</p>
      </div>
      <button onClick={logout} className="btn-logout">
        Đăng xuất
      </button>
    </div>
  );
}
