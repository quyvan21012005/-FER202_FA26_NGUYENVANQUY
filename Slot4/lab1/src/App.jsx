import 'bootstrap/dist/css/bootstrap.min.css';
import ProductInfo from './ProductInfo';

function App() {
  return (
    <div className="container mt-4 d-flex justify-content-center">
      <ProductInfo
        name="Pizza Hải Sản"
        price={15}
        tag="Hot"
        avatar="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
      />
    </div>
  );
}

export default App;