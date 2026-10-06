import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { cartItems } from '../data/cart';
import { formatVND } from '../utils/format';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

const MiniCart = () => {
  // State là một MẢNG object: mỗi phần tử là một dòng giỏ hàng
  const [items, setItems] = useState(cartItems);

  // delta = +1 (tăng) hoặc -1 (giảm); kẹp số lượng trong khoảng 1..10
  const changeQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, item.quantity + delta)),
            }
          : item,
      ),
    );
  };

  // Dữ liệu dẫn xuất: tính lại mỗi lần render, không lưu vào state
  const totalQuantity = items.reduce((sum, { quantity }) => sum + quantity, 0);
  const totalPrice = items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);

  return (
    <Table bordered hover responsive className="align-middle">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Đơn giá</th>
          <th className="text-center">Số lượng</th>
          <th className="text-end">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ id, name, price, quantity }) => (
          <tr key={id}>
            <td>{name}</td>
            <td>{formatVND(price)}</td>
            <td className="text-center">
              <ButtonGroup size="sm">
                <Button
                  variant="outline-secondary"
                  aria-label={`Giảm ${name}`}
                  disabled={quantity <= MIN_QUANTITY}
                  onClick={() => changeQuantity(id, -1)}
                >
                  −
                </Button>
                <Button variant="light" disabled style={{ minWidth: 44 }}>
                  {quantity}
                </Button>
                <Button
                  variant="outline-secondary"
                  aria-label={`Tăng ${name}`}
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => changeQuantity(id, 1)}
                >
                  +
                </Button>
              </ButtonGroup>
            </td>
            <td className="text-end">{formatVND(price * quantity)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td colSpan={2}>Tổng cộng</td>
          <td className="text-center">{totalQuantity}</td>
          <td className="text-end">{formatVND(totalPrice)}</td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default MiniCart;
