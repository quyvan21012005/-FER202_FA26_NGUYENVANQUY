import Button from 'react-bootstrap/Button';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';

const CartPage = ({ onNavigate }) => {
  const { cart, dispatch, totalQuantity } = useCart();

  return (
    <>
      <CartSummary cart={cart} dispatch={dispatch} />
      {totalQuantity > 0 && (
        <div className="text-end mt-3">
          <Button variant="success" onClick={() => onNavigate?.('checkout')}>
            Tiến hành thanh toán
          </Button>
        </div>
      )}
    </>
  );
};

export default CartPage;
