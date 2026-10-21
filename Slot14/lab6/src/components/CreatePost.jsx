import { useState } from 'react';
import postApi from '../api/postApi';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Event handler cũng có thể là hàm async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await postApi.create({
        title,
        body,
        userId: 1,
      });
      setResult({ status: response.status, data: response.data });
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>POST – Tạo bài viết</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} required />
        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Tạo bài viết'}
        </button>
      </form>

      {error && <div>Error: {error}</div>}
      {result && (
        <div>
          <p>Status: {result.status}</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreatePost;