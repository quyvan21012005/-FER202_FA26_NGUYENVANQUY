import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import MenuSection from './components/MenuSection';
import ReservationForm from './components/ReservationForm';

function App() {
  return (
    <div style={{ backgroundColor: '#333333', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. Header Navbar */}
      <Navbar />

      {/* 2. Banner Slider */}
      <BannerCarousel />

      <div className="container">
        {/* 3. Thực đơn Menu */}
        <MenuSection />

        {/* 4. Form đặt bàn */}
        <ReservationForm />
      </div>
    </div>
  );
}

export default App;