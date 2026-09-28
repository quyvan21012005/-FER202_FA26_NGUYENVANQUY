import React, { useState } from 'react';
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  ButtonGroup,
  Button,
  Alert,
  Table,
} from 'react-bootstrap';

// Hàm phân loại chỉ số BMI theo chuẩn Châu Á (khai báo ngoài component)
const classify = (bmi) => {
  if (bmi < 18.5) return { label: 'Thiếu cân', variant: 'info' };
  if (bmi < 23) return { label: 'Bình thường', variant: 'success' };
  if (bmi < 25) return { label: 'Thừa cân', variant: 'warning' };
  return { label: 'Béo phì', variant: 'danger' };
};

export default function BmiCalculator() {
  // Đúng 3 state theo yêu cầu bài học (lưu chuỗi để ô có thể để trống hoặc đang gõ dở)
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('cm'); // 'cm' hoặc 'm'

  // Chuyển đổi sang số và quy đổi chiều cao về mét để tính BMI
  const h = Number(height);
  const w = Number(weight);
  const heightInMeters = unit === 'cm' ? h / 100 : h;

  // Giới hạn hợp lệ theo đơn vị
  const minH = unit === 'cm' ? 50 : 0.5;
  const maxH = unit === 'cm' ? 250 : 2.5;
  const minW = 10;
  const maxW = 300;

  // Kiểm tra lỗi hợp lệ (chỉ báo lỗi khi ô không trống)
  const errors = {};
  if (height !== '') {
    if (!(h >= minH && h <= maxH)) {
      errors.height = `Chiều cao từ ${minH} đến ${maxH} ${unit}`;
    }
  }
  if (weight !== '') {
    if (!(w >= minW && w <= maxW)) {
      errors.weight = `Cân nặng từ ${minW} đến ${maxW} kg`;
    }
  }

  // Biến dẫn xuất (Derived): Không lưu bmi và result vào state
  const isReady =
    height !== '' && weight !== '' && !errors.height && !errors.weight;

  let bmi = null;
  let result = null;
  if (isReady && heightInMeters > 0) {
    bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
    result = classify(Number(bmi));
  }

  // Đổi đơn vị và tự động quy đổi giá trị chiều cao đang nhập
  const changeUnit = (nextUnit) => {
    if (nextUnit === unit) return;

    if (height !== '') {
      const num = Number(height);
      if (!isNaN(num) && num > 0) {
        if (nextUnit === 'm') {
          // cm -> m: ví dụ 170cm -> 1.7m
          const converted = parseFloat((num / 100).toFixed(4));
          setHeight(String(converted));
        } else {
          // m -> cm: ví dụ 1.7m -> 170cm
          const converted = parseFloat((num * 100).toFixed(2));
          setHeight(String(converted));
        }
      }
    }
    setUnit(nextUnit);
  };

  return (
    <Container className="py-4" style={{ maxWidth: '680px' }}>
      {/* Tiêu đề */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Bài 3: Máy tính BMI</h2>
        <p className="text-muted">
          Thực hành Input số lưu chuỗi, Validation & Kết quả dẫn xuất
        </p>
      </div>

      <Card className="p-4 mb-4 bg-white shadow-sm border">
        {/* Lựa chọn đơn vị chiều cao */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold text-dark">Đơn vị chiều cao:</span>
          <ButtonGroup size="sm">
            <Button
              variant={unit === 'cm' ? 'primary' : 'outline-primary'}
              onClick={() => changeUnit('cm')}
            >
              Centimet (cm)
            </Button>
            <Button
              variant={unit === 'm' ? 'primary' : 'outline-primary'}
              onClick={() => changeUnit('m')}
            >
              Mét (m)
            </Button>
          </ButtonGroup>
        </div>

        <Row className="g-3">
          {/* Ô nhập Chiều cao */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                Chiều cao ({unit}):
              </Form.Label>
              <Form.Control
                type="number"
                step={unit === 'cm' ? '1' : '0.01'}
                placeholder={`Ví dụ: ${unit === 'cm' ? '170' : '1.7'}`}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                isInvalid={Boolean(errors.height)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.height}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Ô nhập Cân nặng */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                Cân nặng (kg):
              </Form.Label>
              <Form.Control
                type="number"
                step="0.5"
                placeholder="Ví dụ: 65"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                isInvalid={Boolean(errors.weight)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.weight}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Hiển thị kết quả bằng toán tử 3 ngôi */}
        <div className="mt-4">
          {result ? (
            <Alert
              variant={result.variant}
              className="text-center py-3 mb-0 shadow-sm border"
            >
              <h4 className="fw-bold mb-1">
                BMI = {bmi} → {result.label}
              </h4>
              <small>Chỉ số đánh giá thể trạng theo tiêu chuẩn Châu Á</small>
            </Alert>
          ) : (
            <Alert variant="secondary" className="text-center py-3 mb-0 text-muted">
              ℹ️ Vui lòng nhập đầy đủ chiều cao và cân nặng hợp lệ để xem kết quả.
            </Alert>
          )}
        </div>
      </Card>

      {/* Bảng phân loại tham khảo */}
      <Card className="p-3 bg-white shadow-sm border">
        <h6 className="fw-bold text-dark mb-2">Bảng phân loại BMI (Chuẩn Châu Á):</h6>
        <Table responsive bordered hover size="sm" className="mb-0 text-center">
          <thead className="table-light">
            <tr>
              <th>BMI</th>
              <th>Phân loại</th>
              <th>Mức độ</th>
            </tr>
          </thead>
          <tbody>
            <tr className={result?.label === 'Thiếu cân' ? 'table-info fw-bold' : ''}>
              <td>&lt; 18.5</td>
              <td>Thiếu cân</td>
              <td>Gầy</td>
            </tr>
            <tr className={result?.label === 'Bình thường' ? 'table-success fw-bold' : ''}>
              <td>18.5 – &lt; 23</td>
              <td>Bình thường</td>
              <td>Lý tưởng</td>
            </tr>
            <tr className={result?.label === 'Thừa cân' ? 'table-warning fw-bold' : ''}>
              <td>23 – &lt; 25</td>
              <td>Thừa cân</td>
              <td>Tiền béo phì</td>
            </tr>
            <tr className={result?.label === 'Béo phì' ? 'table-danger fw-bold' : ''}>
              <td>≥ 25</td>
              <td>Béo phì</td>
              <td>Nguy cơ cao</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
