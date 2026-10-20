import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://jsonplaceholder.typicode.com/posts/1';

const UpdatePost = () => {
  const [post, setPost] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 1. Lấy dữ liệu cũ
  useEffect(() => {
    axios
      .get(URL)
      .then(response => setPost(response.data))
      .catch(error => setError(error.message));
  }, []);

  // 2. Gửi PUT với đầy đủ các trường
  const handleUpdate = () => {
    axios
      .put(URL, {
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
      })
      .then(response => setResult({ status: response.status, data: response.data }))
      .catch(error => setError(error.message));
  };

  if (error) return <div className="container mt-3 text-danger">Error: {error}</div>;
  if (!post) return <div className="container mt-3">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>PUT – Cập nhật bài viết #{post.id}</h2>
      <div className="mb-2">
        <input
          className="form-control"
          value={post.title}
          onChange={e => setPost({ ...post, title: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <textarea
          className="form-control"
          value={post.body}
          onChange={e => setPost({ ...post, body: e.target.value })}
        />
      </div>
      <button className="btn btn-warning mb-3" onClick={handleUpdate}>
        Cập nhật (PUT)
      </button>

      {result && (
        <div className="alert alert-info">
          <p>Status: {result.status}</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UpdatePost;