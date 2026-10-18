import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";


const API = "http://localhost:3001/api/products";

function Home() {
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

  if (loading) return <p>Loading...</p>;
  return(
    <div className="grid">
      {products.map((p) => (
      <ProductCard key={p.id} product={p}/>))}
    </div>
  );
}

  

export default Home;