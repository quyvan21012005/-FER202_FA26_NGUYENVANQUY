import React from 'react';

function Navbar() {
  return (
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
  );
}

export default Navbar;