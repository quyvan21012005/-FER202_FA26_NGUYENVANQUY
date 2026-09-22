import Container from 'react-bootstrap/Container';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title = 'Trang chủ' }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1">
        <h2 className="my-4">{title}</h2>
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;