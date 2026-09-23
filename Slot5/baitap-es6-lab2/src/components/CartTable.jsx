import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { cartItems } from '../data/cart';
import { products } from '../data/products';

const formatVND = (n) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const CartTable = () => {
  // Sắp xếp không biến đổi mảng gốc
  const sortedItems = [...cartItems].sort((a, b) => b.price * b.quantity - a.price * a.quantity);
  const totalPrice = cartItems.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
  const totalQuantity = cartItems.reduce((sum, { quantity }) => sum + quantity, 0);
  const maxPrice = Math.max(...cartItems.map((item) => item.price));

  const onSale = products.filter(({ inStock, discount }) => inStock && discount > 0);

  return (
    <div className="my-4">
      <h4 className="mb-3">Giỏ hàng của bạn</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(({ id, name, price, quantity }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{formatVND(price)}</td>
              <td>{quantity}</td>
              <td>{formatVND(price * quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="fw-bold text-end">Tổng cộng:</td>
            <td className="fw-bold">{totalQuantity}</td>
            <td className="fw-bold text-danger">{formatVND(totalPrice)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="text-end">Đơn giá cao nhất:</td>
            <td className="fw-bold">{formatVND(maxPrice)}</td>
          </tr>
        </tfoot>
      </Table>

      <h5 className="mt-4 mb-2">Sản phẩm đang giảm giá và còn hàng:</h5>
      <ListGroup>
        {onSale.map(({ id, name, discount }) => (
          <ListGroup.Item key={id} className="d-flex justify-content-between align-items-center">
            {name}
            <Badge bg="danger">-{discount}%</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CartTable ;