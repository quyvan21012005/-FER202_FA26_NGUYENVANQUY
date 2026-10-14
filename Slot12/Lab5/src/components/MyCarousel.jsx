import { Carousel } from 'react-bootstrap';
import { banners } from '../data/banners';

function MyCarousel() {
  return (
    <Carousel interval={3000} pause="hover" className="mb-4 shadow-sm rounded overflow-hidden">
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            className="d-block w-100"
            src={banner.image}
            alt={banner.title || `Banner ${banner.id}`}
            style={{ maxHeight: '420px', objectFit: 'cover' }}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3 mb-3 d-none d-md-block">
            <h3>{banner.title}</h3>
            <p>{banner.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MyCarousel;
