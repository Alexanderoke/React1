import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import "./App.css";

const API = "http://localhost:3001/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  async function addProduct(newProduct) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const created = await res.json();
    setProducts([...products, created]);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app">
      <h1>My Shop</h1>
      <ProductForm onAdd={addProduct} />
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default App;