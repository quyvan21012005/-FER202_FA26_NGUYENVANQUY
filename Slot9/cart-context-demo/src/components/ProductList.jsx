import { products } from "../data/products";
import { useCartDispatch } from "../contexts/CartContext";

export default function ProductList() {
  const dispatch = useCartDispatch(); // Component này KHÔNG re-render khi giỏ hàng thay đổi

  return (
    <div className="product-list">
      <h3>Danh sách sản phẩm</h3>
      {products.map((p) => (
        <div key={p.id} className="product-item">
          <span>{p.name} — <b>{p.price.toLocaleString("vi-VN")}đ</b></span>
          <button onClick={() => dispatch({ type: "ADD", payload: p })}>
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
