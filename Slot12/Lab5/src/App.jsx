import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import New from './pages/New';
import Contact from './pages/Contact';
import ProductList from './pages/ProductList';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar nằm ngoài Routes nên sẽ luôn hiển thị ở mọi trang */}
      <NavigationBar />

      {/* Chỉ có phần nội dung bên trong Container này thay đổi theo URL */}
      <Container className="mt-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/about" element={<About />} />
          <Route path="/new" element={<New />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>

      {/* Footer ở chân trang */}
      <Footer />
    </div>
  );
}

export default App;