import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AxiosDemo = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy danh sách toàn bộ bài post
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Axios Demo - Danh sách Post</h1>
      {data.length > 0 ? (
        <div className="row">
          {data.slice(0, 10).map((post) => ( // Lấy mẫu 10 bài đầu hiển thị
            <div key={post.id} className="col-md-6 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{post.title}</h5>
                  <p className="card-text">{post.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AxiosDemo;