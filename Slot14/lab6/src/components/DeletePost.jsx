import { useState, useEffect } from 'react';
import postApi from '../api/postApi';

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