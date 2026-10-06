import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ShopPage from './ShopPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import LoginForm from '../components/LoginForm';

const TITLES = {
  shop: 'Cửa hàng FPT Shop Mini',
  cart: 'Giỏ hàng của bạn',
  checkout: 'Thanh toán đơn hàng',
  login: 'Đăng nhập hệ thống',
};

const MiniShopApp = () => {
  const [page, setPage] = useState('shop');
  const { login } = useAuth();

  const handleLoginSuccess = (email) => {
    login(email);
    setPage('shop');
  };

  return (
    <Layout title={TITLES[page]} currentPage={page} onNavigate={setPage}>
      {page === 'shop' && <ShopPage />}
      {page === 'cart' && <CartPage onNavigate={setPage} />}
      {page === 'checkout' && <CheckoutPage onNavigate={setPage} />}
      {page === 'login' && <LoginForm onLoginSuccess={handleLoginSuccess} />}
    </Layout>
  );
};

export default MiniShopApp;
