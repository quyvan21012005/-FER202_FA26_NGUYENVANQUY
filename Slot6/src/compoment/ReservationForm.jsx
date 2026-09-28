import React from 'react';

function ReservationForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="mt-5 pt-4">
      <h2 className="text-white text-center mb-4 fw-normal">Book Your Table</h2>
      <form className="form-custom mx-auto" style={{ maxWidth: '850px' }} onSubmit={handleSubmit}>
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
  );
}

export default ReservationForm;