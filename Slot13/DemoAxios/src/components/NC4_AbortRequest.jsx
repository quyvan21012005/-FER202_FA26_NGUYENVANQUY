import React, { useState, useEffect } from 'react';
import axios from 'axios';
import postApi from '../api/postApi';

const NC4_AbortRequest = () => {
  const [postId, setPostId] = useState(1);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await postApi.getById(postId, controller.signal);
        setPost(res);
      } catch (err) {
        // Bỏ qua nếu lỗi phát sinh do người dùng chủ động hủy (Abort)[cite: 4]
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          console.log(`Đã hủy request bài viết #${postId}`);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    // Cleanup: hủy request khi postId thay đổi trước khi hoàn thành[cite: 4]
    return () => {
      controller.abort();
    };
  }, [postId]);

  return (
    <div className="card p-3 mb-3">
      <h4>NC4 – Hủy request với AbortController</h4>
      <div className="mb-2">
        <label className="form-label me-2">Chọn Post ID (1-100):</label>
        <input
          type="number"
          min="1"
          max="100"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          className="form-control d-inline-block w-auto"
        />
      </div>

      {loading && <div>Đang tải nội dung...</div>}
      {error && <div className="text-danger">Lỗi: {error}</div>}
      {post && !loading && (
        <div className="alert alert-light border">
          <h6>#{post.id} – {post.title}</h6>
          <p>{post.body}</p>
        </div>
      )}
    </div>
  );
};

export default NC4_AbortRequest;