import { useState } from 'react';
import postApi from '../api/postApi';

const PatchPost = () => {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePatch = async () => {
    setSaving(true);
    setError(null);
    try {
      // PATCH chỉ gửi trường thay đổi
      const response = await postApi.patch(1, { title });
      setResult({ status: response.status, data: response.data });
    } catch (err) {
      setError(err.userMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>PATCH – Sửa tiêu đề bài viết #1</h2>
      <input placeholder="Tiêu đề mới" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handlePatch} disabled={!title.trim() || saving}>
        {saving ? 'Đang lưu...' : 'Cập nhật (PATCH)'}
      </button>

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

export default PatchPost;