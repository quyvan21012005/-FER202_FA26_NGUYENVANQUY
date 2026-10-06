import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const QuantityPicker = ({ min = 1, max = 10 }) => {
  const [quantity, setQuantity] = useState(min);

  const decrease = () => setQuantity((q) => Math.max(q - 1, min));
  const increase = () => setQuantity((q) => Math.min(q + 1, max));

  // Sai: 3 lần đều đọc cùng một giá trị quantity cũ → chỉ tăng 1
  const addThreeWrong = () => {
    setQuantity(Math.min(quantity + 1, max));
    setQuantity(Math.min(quantity + 1, max));
    setQuantity(Math.min(quantity + 1, max));
  };

  // Đúng: functional update, mỗi lần nhận giá trị mới nhất
  const addThree = () => {
    increase();
    increase();
    increase();
  };

  return (
    <div className="d-flex align-items-center gap-3 flex-wrap">
      <ButtonGroup>
        <Button variant="outline-secondary" onClick={decrease} disabled={quantity <= min}>
          −
        </Button>
        <Button variant="light" disabled style={{ minWidth: 56 }}>
          {quantity}
        </Button>
        <Button variant="outline-secondary" onClick={increase} disabled={quantity >= max}>
          +
        </Button>
      </ButtonGroup>
      <Button size="sm" variant="outline-danger" onClick={addThreeWrong}>
        +3 (sai)
      </Button>
      <Button size="sm" variant="outline-success" onClick={addThree}>
        +3 (đúng)
      </Button>
      <Button size="sm" variant="link" onClick={() => setQuantity(min)}>
        Đặt lại
      </Button>
      {quantity === max && <small className="text-danger">Tối đa {max} sản phẩm</small>}
    </div>
  );
};

export default QuantityPicker;
