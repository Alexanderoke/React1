import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const FALLBACK = "https://picsum.photos/seed/placeholder/600/400";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return (
    <div>
      <p>Product not found.</p>
      <Link to="/">Back to shop</Link>
    </div>
  );

  return (
    <div className="detail">
      <Link to="/">← Back to shop</Link>
      <img
        src={product.image || FALLBACK}
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK;
        }}
      />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>${product.price.toFixed(2)}</strong>
    </div>
  );
}

export default ProductDetail;