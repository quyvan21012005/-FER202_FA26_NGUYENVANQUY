import './App.css'

function ProductInfo({ name, price, tag, avatar }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={avatar} alt={name} />
        <span className="product-badge">{tag}</span>
      </div>
      <div className="product-body">
        <h2>{name}</h2>
        <p>Price: ${price}</p>
        <button type="button">Buy Now</button>
      </div>
    </article>
  )
}

function App() {
  return (
    <main className="storefront">
      <h1>Featured Products</h1>
      <section className="product-grid" aria-label="Featured products">
        <ProductInfo
          name="Wireless Headphones"
          price="79.99"
          tag="New"
          avatar="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80"
        />
        <ProductInfo
          name="Classic Watch"
          price="129.00"
          tag="Popular"
          avatar="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=640&q=80"
        />
        <ProductInfo
          name="Minimal Backpack"
          price="54.50"
          tag="Sale"
          avatar="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=640&q=80"
        />
      </section>
    </main>
  )
}

export default App
