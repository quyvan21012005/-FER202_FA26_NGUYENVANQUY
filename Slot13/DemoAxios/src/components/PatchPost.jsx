import React, { useState } from 'react';
import axios from 'axios';

const PatchPost = () => {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePatch = () => {
    axios
      .patch('https://jsonplaceholder.typicode.com/posts/1', { title }) // Chỉ gửi 1 trường
      .then(response => setResult({ status: response.status, data: response.data }))
      .catch(error => setError(error.message));
  };

  return (
    <div className="container mt-4">
      <h2>PATCH – Sửa tiêu đề bài viết #1</h2>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Tiêu đề mới"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          className="btn btn-info"
          onClick={handlePatch}
          disabled={!title.trim()}
        >
          Cập nhật (PATCH)
        </button>
      </div>

      {error && <div className="alert alert-danger">Error: {error}</div>}
      {result && (
        <div className="alert alert-secondary">
          <p>Status: {result.status}</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PatchPost;