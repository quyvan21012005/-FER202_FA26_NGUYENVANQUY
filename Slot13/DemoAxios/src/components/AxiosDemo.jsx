import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AxiosDemo = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="card shadow-sm p-4">
      <h1 className="text-primary mb-3">Axios Demo</h1>
      {data ? (
        <div className="card-body bg-light rounded p-3">
          <h2 className="card-title h4 text-capitalize text-dark mb-2">{data.title}</h2>
          <p className="card-text text-secondary mb-0">{data.body}</p>
        </div>
      ) : (
        <div className="d-flex align-items-center gap-2 text-primary">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default AxiosDemo;
