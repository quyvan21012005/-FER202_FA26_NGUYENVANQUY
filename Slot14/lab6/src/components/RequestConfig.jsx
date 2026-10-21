import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

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