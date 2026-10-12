import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm p-4">
            <Card.Body>
              <h2 className="fw-bold mb-3">Giới thiệu bản thân (About Me)</h2>
              <p className="lead text-muted">
                Xin chào! Mình là <strong>Văn Quý</strong>, sinh viên chuyên ngành Kỹ thuật Phần mềm tại Đại học FPT.
              </p>
              <hr className="my-4" />
              <h5 className="fw-bold text-primary mb-3">Mục tiêu & Định hướng</h5>
              <p>
                Mình đam mê xây dựng các ứng dụng web tối ưu trải nghiệm người dùng, 
                đặc biệt là các công nghệ Frontend hiện đại như ReactJS, Vite, Bootstrap và hệ sinh thái JavaScript.
              </p>
              <h5 className="fw-bold text-primary mb-3 mt-4">Sở thích & Điểm mạnh</h5>
              <ul>
                <li>Tìm hiểu các thư viện và framework web mới nhất.</li>
                <li>Thiết kế giao diện người dùng thân thiện, chuẩn responsive.</li>
                <li>Làm việc nhóm, chủ động giải quyết vấn đề và học hỏi liên tục.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
