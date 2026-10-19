import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Truyền query params qua thuộc tính params (không ghép chuỗi URL thủ công)
    axios
      .get('https://jsonplaceholder.typicode.com/posts', {
        params: { 
          userId: 1, 
          _limit: 5 
        },
      })
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-3">Loading...</div>;
  if (error) return <div className="container mt-3 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-primary">GET – Danh sách bài viết của user 1</h2>
      <ul className="list-group">
        {posts.map(post => (
          <li key={post.id} className="list-group-item">
            <strong>#{post.id}</strong> – {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;