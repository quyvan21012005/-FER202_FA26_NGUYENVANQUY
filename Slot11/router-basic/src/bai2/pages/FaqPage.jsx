import { Accordion } from 'react-bootstrap';

const FAQ_LIST = [
  {
    id: '0',
    question: 'Làm thế nào để mượn sách tại thư viện FPT?',
    answer:
      'Sinh viên chỉ cần xuất trình Thẻ sinh viên FPT hoặc quét mã barcode trên ứng dụng FPT Edu tại quầy thủ thư hoặc cây mượn sách tự động (Self-check Station).',
  },
  {
    id: '1',
    question: 'Mỗi sinh viên được mượn tối đa bao nhiêu cuốn và thời hạn là bao lâu?',
    answer:
      'Mỗi sinh viên được mượn tối đa 5 cuốn giáo trình/sách tham khảo trong thời gian 14 ngày. Với tài liệu quý hiếm hoặc đồ án tốt nghiệp, sinh viên chỉ được đọc tại chỗ.',
  },
  {
    id: '2',
    question: 'Làm sao để gia hạn sách đã mượn?',
    answer:
      'Sinh viên có thể truy cập cổng thông tin Thư viện trực tuyến (FPT Library Portal) trước ngày hết hạn 2 ngày để gia hạn thêm 7 ngày (tối đa gia hạn 1 lần nếu sách không có người đặt trước).',
  },
  {
    id: '3',
    question: 'Thời gian mở cửa hoạt động của thư viện như thế nào?',
    answer:
      'Thư viện mở cửa từ Thứ 2 đến Thứ 7 hàng tuần: Sáng từ 07:30 - 11:30, Chiều và Tối từ 13:00 - 21:00. Riêng Chủ Nhật mở cửa phòng tự học từ 08:00 - 17:00.',
  },
  {
    id: '4',
    question: 'Làm thế nào để đặt phòng tự học nhóm (Discussion Room)?',
    answer:
      'Nhóm sinh viên từ 3 đến 8 bạn có thể đăng ký mượn phòng tự học nhóm trước 24h qua hệ thống FAP hoặc liên hệ trực tiếp quầy hỗ trợ tại tầng 1.',
  },
];

const FaqPage = () => {
  return (
    <div>
      <h4 className="fw-bold mb-3 text-primary">Các Câu Hỏi Thường Gặp (FAQ)</h4>
      <p className="text-muted mb-4">
        Tổng hợp các thắc mắc phổ biến nhất của sinh viên về quy trình mượn trả sách và tài nguyên học tập.
      </p>

      <Accordion defaultActiveKey="0" flush className="border rounded">
        {FAQ_LIST.map((item) => (
          <Accordion.Item key={item.id} eventKey={item.id}>
            <Accordion.Header>
              <span className="fw-semibold">{item.question}</span>
            </Accordion.Header>
            <Accordion.Body className="text-secondary lh-lg">
              {item.answer}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqPage;
