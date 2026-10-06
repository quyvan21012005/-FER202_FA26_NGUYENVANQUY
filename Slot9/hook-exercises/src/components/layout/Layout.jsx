import Container from 'react-bootstrap/Container';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children, title = 'Trang chủ', currentPage, onNavigate }) => {
  const { theme } = useTheme();

  return (
    <div data-bs-theme={theme} className="bg-body text-body min-vh-100 pb-5">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <Container>
        <h2 className="my-4">{title}</h2>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
