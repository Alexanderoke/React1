import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import { useAuth } from "./AuthContext";
import { API_URL } from "./config";

const API = "${ API_URL}/api/products";

function AdminProducts() {
  const { authFetch } = useAuth();
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
    const res = await authFetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!res.ok) {
      alert("Could not add the product. Are you still logged in?");
      return;
    }
    const created = await res.json();
    setProducts([...products, created]);
  }

  async function deleteProduct(id) {
    const res = await authFetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete the product. Are you still logged in?");
      return;
    }
    setProducts(products.filter((p) => p.id !== id));
  }

  async function updateProduct(id, updated) {
    const res = await authFetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      alert("Could not save the product. Are you still logged in?");
      return;
    }
    const saved = await res.json();
    setProducts(products.map((p) => (p.id === id ? saved : p)));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <ProductForm onAdd={addProduct} />
      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            admin
            onDelete={deleteProduct}
            onUpdate={updateProduct}
          />
        ))}
      </div>
    </>
  );
}

export default AdminProducts;