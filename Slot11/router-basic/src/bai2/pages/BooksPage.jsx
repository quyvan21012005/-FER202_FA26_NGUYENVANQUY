import { Table, Card, Badge } from 'react-bootstrap';
import { BOOKS } from '../data/books';

const BooksPage = () => {
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Danh Mục Sách Thư Viện FPT</h2>
        <p className="text-muted">
          Danh sách 3 cuốn sách tiêu biểu đang có tại thư viện (Route: <code>/books</code>).
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '10%' }}>Mã sách</th>
                <th style={{ width: '35%' }}>Tên sách</th>
                <th style={{ width: '20%' }}>Tác giả</th>
                <th style={{ width: '15%' }}>Thể loại</th>
                <th style={{ width: '10%' }} className="text-center">Năm XB</th>
                <th style={{ width: '10%' }} className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {BOOKS.map((book) => (
                <tr key={book.id}>
                  <td className="fw-bold text-primary">{book.id}</td>
                  <td>
                    <div className="fw-semibold">{book.title}</div>
                    <small className="text-muted d-block mt-1">
                      📍 {book.shelf}
                    </small>
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {book.category}
                    </span>
                  </td>
                  <td className="text-center">{book.year}</td>
                  <td className="text-center">
                    <Badge
                      bg={book.status === 'Có sẵn' ? 'success' : 'warning'}
                      className="px-2 py-1"
                    >
                      {book.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BooksPage;
