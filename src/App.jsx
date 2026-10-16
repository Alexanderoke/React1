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
  async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  setProducts(products.filter((p) => p.id !== id));
}

async function updateProduct(id, updated) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  const saved = await res.json();
  setProducts(products.map((p) => (p.id === id ? saved : p)));
}

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app">
      <h1>My Shop</h1>
      <ProductForm onAdd={addProduct} />
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onDelete={deleteProduct} onUpdate={updateProduct} />
        ))}
      </div>
    </div>
  );
}

export default App;