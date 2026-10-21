import { useState, useEffect } from 'react';
import postApi from '../api/postApi';

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