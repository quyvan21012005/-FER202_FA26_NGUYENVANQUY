import { Routes, Route } from 'react-router-dom';
import HomePage from './bai1/pages/HomePage';

function App() {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
