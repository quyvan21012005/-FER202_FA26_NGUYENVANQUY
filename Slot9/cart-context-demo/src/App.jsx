import { CartProvider } from "./contexts/CartContext";
import CartBadge from "./components/CartBadge";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import "./App.css";

export default function App() {
  return (
    <CartProvider>
      <div className="cart-app">
        <header className="cart-header">
          <h2>Cửa Hàng Công Nghệ</h2>
          <CartBadge />
        </header>
        <main className="cart-main">
          <ProductList />
          <hr className="divider" />
          <Cart />
        </main>
      </div>
    </CartProvider>
  );
}
