import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const NC3_PostDetail = () => {
  const [data, setData] = useState({ post: null, author: null, comments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParallel = async () => {
      try {
        setLoading(true);
        // Bước 1: Lấy thông tin bài viết
        const post = await axiosClient.get('/posts/1');

        // Bước 2: Gọi song song tác giả và danh sách bình luận bằng Promise.allSettled
        const [userRes, commentsRes] = await Promise.allSettled([
          axiosClient.get(`/users/${post.userId}`),
          axiosClient.get(`/posts/${post.id}/comments`),
        ]);

        setData({
          post,
          author: userRes.status === 'fulfilled' ? userRes.value : null,
          comments: commentsRes.status === 'fulfilled' ? commentsRes.value : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParallel();
  }, []);

  if (loading) return <div>Đang tải dữ liệu song song (NC3)...</div>;
  if (error) return <div className="text-danger">Lỗi: {error}</div>;

  return (
    <div className="card p-3 mb-3">
      <h4>NC3 – Gọi request song song (Promise.allSettled)</h4>
      <h5>{data.post?.title}</h5>
      <p><strong>Tác giả:</strong> {data.author ? `${data.author.name} (${data.author.email})` : 'Không tải được tác giả'}</p>
      <p>{data.post?.body}</p>
      <h6>Bình luận ({data.comments.length}):</h6>
      <ul>
        {data.comments.slice(0, 3).map(c => (
          <li key={c.id}><strong>{c.email}:</strong> {c.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default NC3_PostDetail;