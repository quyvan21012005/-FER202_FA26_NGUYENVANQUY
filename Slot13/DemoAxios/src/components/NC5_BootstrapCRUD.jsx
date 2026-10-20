import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Modal, Button, Form, Card } from 'react-bootstrap';
import postApi from '../api/postApi';

const NC5_BootstrapCRUD = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    postApi.getAll({ _limit: 3 })
      .then(res => setPosts(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await postApi.remove(selectedId);
      setPosts(posts.filter(p => p.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      alert('Không thể xóa bài viết!');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (title.length < 5 || body.length < 10) {
      setValidated(true);
      return;
    }
    try {
      const res = await postApi.create({ title, body, userId: 1 });
      setPosts([res, ...posts]);
      setTitle('');
      setBody('');
      setValidated(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="p-3 mb-3">
      <h4>NC5 – Giao diện chuẩn React-Bootstrap</h4>

      {/* Form kiểm tra hợp lệ[cite: 4] */}
      <Form noValidate validated={validated} onSubmit={handleCreate} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Tiêu đề (tối thiểu 5 ký tự):</Form.Label>
          <Form.Control
            required
            minLength={5}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={validated && title.length < 5}
          />
          <Form.Control.Feedback type="invalid">Tiêu đề phải từ 5 ký tự trở lên.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Nội dung (tối thiểu 10 ký tự):</Form.Label>
          <Form.Control
            as="textarea"
            required
            minLength={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            isInvalid={validated && body.length < 10}
          />
          <Form.Control.Feedback type="invalid">Nội dung phải từ 10 ký tự trở lên.</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">Thêm bài viết</Button>
      </Form>

      {/* Loading Spinner & Alert Lỗi[cite: 4] */}
      {loading && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Danh sách */}
      {!loading && posts.map(post => (
        <div key={post.id} className="d-flex justify-content-between border p-2 mb-2 rounded">
          <div>
            <strong>#{post.id}</strong> {post.title}
          </div>
          <Button variant="danger" size="sm" onClick={() => handleOpenDelete(post.id)}>
            Xóa
          </Button>
        </div>
      ))}

      {/* Modal xác nhận xóa thay cho window.confirm[cite: 4] */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết #{selectedId} không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Xác nhận xóa</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default NC5_BootstrapCRUD;