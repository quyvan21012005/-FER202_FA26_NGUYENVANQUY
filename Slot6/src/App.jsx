import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// Import ảnh từ src/assets/images
import pizzaBanner1 from './assets/images/pizza1.jpg';
import pizzaBanner2 from './assets/images/pizza2.jpg';
import menu1 from './assets/images/menu1.jpg';
import menu2 from './assets/images/menu2.jpg';
import menu3 from './assets/images/menu3.jpg';
import menu4 from './assets/images/menu4.jpg';

const menuList = [
  {
    id: 1,
    title: 'Margherita Pizza',
    badge: 'SALE',
    image: menu1,
    delPrice: '$40.00',
    price: '$24.00',
  },
  {
    id: 2,
    title: 'Mushroom Pizza',
    badge: null,
    image: menu2,
    delPrice: null,
    price: '$25.00',
  },
  {
    id: 3,
    title: 'Hawaiian Pizza',
    badge: 'NEW',
    image: menu3,
    delPrice: null,
    price: '$30.00',
  },
  {
    id: 4,
    title: 'Pesto Pizza',
    badge: 'SALE',
    image: menu4,
    delPrice: '$50.00',
    price: '$30.00',
  },
];

function App() {
  return (
    <div style={{ backgroundColor: '#333333', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. Header / Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 border-bottom border-secondary">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-4 me-4" href="#home">
            Pizza House
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#pizzaNavbar"
            aria-controls="pizzaNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="pizzaNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>

            {/* Ô tìm kiếm */}
            <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-danger" type="submit">
                  🔍
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* 2. Banner / Carousel */}
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

      <div className="container">
        {/* 3. Section: Our Menu */}
        <section className="mb-5">
          <h2 className="text-white mb-4 fw-normal">Our Menu</h2>
          <div className="row g-4">
            {menuList.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                <div className="card custom-card h-100 position-relative text-dark bg-white">
                  {/* Badge SALE / NEW */}
                  {item.badge && <span className="card-badge">{item.badge}</span>}

                  <img
                    src={item.image}
                    className="card-img-top rounded-0"
                    alt={item.title}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />

                  <div className="card-body d-flex flex-column text-start p-3">
                    <h5 className="card-title fs-6 fw-bold mb-2">{item.title}</h5>
                    <p className="card-text mb-3">
                      {item.delPrice && <span className="price-del">{item.delPrice}</span>}
                      <span className={item.delPrice ? 'price-current' : 'fw-bold text-dark'}>
                        {item.price}
                      </span>
                    </p>
                    <button className="btn btn-buy w-100 mt-auto rounded-1 py-1">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Section: Book Your Table */}
        <section className="mt-5 pt-4">
          <h2 className="text-white text-center mb-4 fw-normal">Book Your Table</h2>
          <form className="form-custom mx-auto" style={{ maxWidth: '850px' }}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name *"
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email *"
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <select className="form-select text-secondary" defaultValue="">
                  <option value="" disabled>
                    Select a Service
                  </option>
                  <option value="dine-in">Dine-in</option>
                  <option value="take-away">Take Away</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                rows="6"
                placeholder="Please write your comment"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-send px-4 py-2 rounded-1">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;