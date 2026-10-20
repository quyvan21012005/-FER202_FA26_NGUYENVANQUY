import React from 'react';
import useAxios from '../hooks/useAxios';
import postApi from '../api/postApi';
import { Button, Spinner, Alert } from 'react-bootstrap';

const NC8_CustomHookDemo = () => {
  const { data, loading, error, refetch } = useAxios(
    (signal) => postApi.getAll({ _limit: 3 }, signal),
    []
  );

  return (
    <div className="card p-3 mb-3">
      <h4>NC8 – Tái sử dụng logic với useAxios</h4>
      {loading && <Spinner animation="border" />}
      {error && (
        <Alert variant="danger">
          {error} <Button variant="outline-danger" size="sm" onClick={refetch}>Thử lại</Button>
        </Alert>
      )}
      {data && (
        <ul>
          {data.map(p => <li key={p.id}>{p.title}</li>)}
        </ul>
      )}
      <Button variant="secondary" size="sm" onClick={refetch} className="w-auto">
        Làm mới dữ liệu (Refetch)
      </Button>
    </div>
  );
};

export default NC8_CustomHookDemo;