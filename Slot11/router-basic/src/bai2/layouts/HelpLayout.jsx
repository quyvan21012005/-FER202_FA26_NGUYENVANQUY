import { Nav, Card } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';

const HelpLayout = () => {
  return (
    <div>
      {/* Header phần Hướng dẫn */}
      <div className="mb-4">
        <h2 className="fw-bold">Trung Tâm Trợ Giúp & Hướng Dẫn</h2>
        <p className="text-muted">
          Thông tin giải đáp thắc mắc và nội quy chi tiết khi sử dụng dịch vụ Thư viện FPT University.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
          <Nav variant="tabs" className="card-header-tabs">
            <Nav.Item>
              {/* Link tương đối 'faq' tương ứng với /help/faq */}
              <Nav.Link as={NavLink} to="faq">
                ❓ Câu hỏi thường gặp
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              {/* Link tương đối 'rules' tương ứng với /help/rules */}
              <Nav.Link as={NavLink} to="rules">
                📋 Nội quy thư viện
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Outlet là nơi render các route con: /help/faq hoặc /help/rules */}
          <Outlet />
        </Card.Body>
      </Card>
    </div>
  );
};

export default HelpLayout;
