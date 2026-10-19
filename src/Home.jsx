import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const API = "http://localhost:3001/api/products";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";
  const sort = params.get("sort") || "newest";
  const maxPrice = params.get("max") || "";

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setParams(next, { replace: true });
  }

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // Derived data: recalculated only when its inputs change
  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!term ||
          p.name.toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)) &&
        (!maxPrice || p.price <= Number(maxPrice))
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => b.id - a.id);
    return list;
  }, [products, q, sort, maxPrice]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />
        <select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A to Z</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setParam("max", e.target.value)}
        />
        {(q || maxPrice || sort !== "newest") && (
          <button onClick={() => setParams({})}>Clear</button>
        )}
      </div>

      <p>
        {visible.length} of {products.length} product(s)
      </p>

      {visible.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;