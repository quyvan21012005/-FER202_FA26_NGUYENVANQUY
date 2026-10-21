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