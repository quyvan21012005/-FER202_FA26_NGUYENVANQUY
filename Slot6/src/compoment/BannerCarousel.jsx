import React from 'react';
import pizzaBanner1 from '../assets/images/pizza1.jpg';
import pizzaBanner2 from '../assets/images/pizza2.jpg';

function BannerCarousel() {
  return (
    <div id="pizzaCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={pizzaBanner1}
            className="d-block w-100"
            alt="Neapolitan Pizza"
            style={{ maxHeight: '460px', objectFit: 'cover' }}
          />
          <div className="carousel-caption d-none d-md-block">
            <div className="carousel-caption-box">
              <h2 className="display-6 fw-bold">Neapolitan Pizza</h2>
              <p className="mb-0">
                If you are looking for a traditional Italian pizza, the Neapolitan is the best option!
              </p>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src={pizzaBanner2}
            className="d-block w-100"
            alt="Pizza House Banner"
            style={{ maxHeight: '460px', objectFit: 'cover' }}
          />
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#pizzaCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#pizzaCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default BannerCarousel;