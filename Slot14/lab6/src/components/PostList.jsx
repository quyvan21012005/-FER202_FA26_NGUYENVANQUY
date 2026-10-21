import { useState, useEffect } from 'react';
import postApi from '../api/postApi';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postApi.getAll({ userId: 1, _limit: 5 });
        setPosts(res.data);
      } catch (err) {
        setError(err.userMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>GET – Danh sách bài viết của user 1</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>#{post.id} – {post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
