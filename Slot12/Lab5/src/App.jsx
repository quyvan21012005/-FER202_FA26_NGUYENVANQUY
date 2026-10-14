import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import New from './pages/New';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <NavigationBar />

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/new" element={<New />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;