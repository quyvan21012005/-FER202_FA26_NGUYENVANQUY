import { useCart, useCartDispatch } from "../contexts/CartContext";

export default function Cart() {
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) return <p className="empty-cart">Giỏ hàng đang trống.</p>;

  return (
    <div className="cart-container">
      <h3>Giỏ hàng của bạn</h3>
      <div className="cart-items">
        {items.map((i) => (
          <div key={i.id} className="cart-item">
            <span className="cart-item-name">{i.name}</span>
            <span className="cart-item-price">
              {(i.price * i.qty).toLocaleString("vi-VN")}đ <small>({i.price.toLocaleString("vi-VN")}đ/cái)</small>
            </span>
            <div className="cart-item-actions">
              <button onClick={() => dispatch({ type: "DECREASE", payload: i.id })}>-</button>
              <span className="qty">{i.qty}</span>
              <button onClick={() => dispatch({ type: "ADD", payload: i })}>+</button>
              <button className="btn-remove" onClick={() => dispatch({ type: "REMOVE", payload: i.id })}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p><b>Tổng thanh toán: {total.toLocaleString("vi-VN")}đ</b></p>
        <button className="btn-clear" onClick={() => dispatch({ type: "CLEAR" })}>
          Xóa toàn bộ giỏ hàng
        </button>
      </div>
    </div>
  );
}
