import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://jsonplaceholder.typicode.com/posts';

const DeletePost = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(API, { params: { _limit: 5 } })
      .then(response => setPosts(response.data))
      .catch(error => setError(error.message));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm(`Xóa bài viết #${id}?`)) return;

    axios
      .delete(`${API}/${id}`)
      .then(response => {
        setPosts(posts.filter(p => p.id !== id)); // Cập nhật lại UI
        setMessage(`Đã xóa bài #${id} – Status: ${response.status}`);
      })
      .catch(error => setError(error.message));
  };

  if (error) return <div className="container mt-3 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>DELETE – Xóa bài viết</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <ul className="list-group">
        {posts.map(post => (
          <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>#{post.id} – {post.title}</span>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeletePost;