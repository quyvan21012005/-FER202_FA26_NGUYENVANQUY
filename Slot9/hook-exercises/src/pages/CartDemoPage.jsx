import { useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ProductList from '../components/ProductList';
import CartSummary from '../components/CartSummary';
import { products } from '../data/products';
import { cartReducer, initialCart, CART_ACTIONS, getCartTotals } from '../reducers/cartReducer';

const CartDemoPage = () => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const { totalQuantity } = getCartTotals(cart);

  const handleAddToCart = (product) => dispatch({ type: CART_ACTIONS.ADD, payload: product });

  return (
    <Row className="g-4">
      <Col lg={7}>
        <h4 className="mb-3">Sản phẩm</h4>
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </Col>
      <Col lg={5}>
        <h4 className="mb-3">
          Giỏ hàng <Badge bg="primary">{totalQuantity}</Badge>
        </h4>
        <CartSummary cart={cart} dispatch={dispatch} />
      </Col>
    </Row>
  );
};

export default CartDemoPage;
