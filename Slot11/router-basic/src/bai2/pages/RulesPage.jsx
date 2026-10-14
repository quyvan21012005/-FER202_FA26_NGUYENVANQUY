import { ListGroup, Alert } from 'react-bootstrap';

const RULES = [
  {
    title: '1. Thẻ thư viện và trang phục',
    content:
      'Sinh viên và cán bộ giảng viên phải mang theo Thẻ sinh viên / Thẻ cán bộ hợp lệ và đeo thẻ khi vào thư viện. Trang phục lịch sự, đúng tác phong sinh viên FPT.',
  },
  {
    title: '2. Giữ gìn trật tự và vệ sinh chung',
    content:
      'Tuyệt đối giữ yên lặng tại các khu vực đọc chung. Chuyển điện thoại sang chế độ rung/im lặng. Không mang đồ ăn, thức uống có mùi vào phòng đọc (chỉ chấp nhận nước lọc đóng chai có nắp kín).',
  },
  {
    title: '3. Bảo quản tài liệu và tài sản',
    content:
      'Không viết, vẽ, gạch chân hoặc làm rách sách báo, tài liệu. Không tự ý di chuyển máy tính, bàn ghế hoặc trang thiết bị ra khỏi vị trí quy định.',
  },
  {
    title: '4. Quy định mượn - trả và đền bù',
    content:
      'Đúng hạn phải hoàn trả hoặc gia hạn tài liệu. Trường hợp làm mất hoặc hư hỏng sách, bạn đọc phải đền cuốn sách mới cùng loại hoặc đền bù kinh phí theo quy chế hiện hành của nhà trường.',
  },
  {
    title: '5. Sử dụng khu tự học và phòng họp nhóm',
    content:
      'Phòng tự học nhóm cần được đăng ký trước. Sau khi sử dụng, vui lòng dọn dẹp bàn ghế, tắt thiết bị điện và thông báo cho nhân viên thư viện bàn giao phòng.',
  },
];

const RulesPage = () => {
  return (
    <div>
      <h4 className="fw-bold mb-3 text-danger">Nội Quy Thư Viện FPT University</h4>
      <Alert variant="warning" className="mb-4">
        ⚠️ Tất cả bạn đọc vào thư viện có nghĩa vụ tuân thủ nghiêm túc các quy định dưới đây để duy trì môi trường học tập văn minh, chuyên nghiệp.
      </Alert>

      <ListGroup variant="flush" className="border rounded">
        {RULES.map((rule, idx) => (
          <ListGroup.Item key={idx} className="p-3">
            <h6 className="fw-bold text-dark mb-1">{rule.title}</h6>
            <p className="text-muted mb-0">{rule.content}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default RulesPage;
