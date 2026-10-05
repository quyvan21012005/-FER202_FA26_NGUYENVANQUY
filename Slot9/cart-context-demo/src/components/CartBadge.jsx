import { useCart } from "../contexts/CartContext";

export default function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return <div className="cart-badge">🛒 Giỏ hàng ({count})</div>;
}
