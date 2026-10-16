const FALLBACK = "https://picsum.photos/seed/placeholder/300/200";

function ProductCard({ product, onDelete }) {
  return (
    <div className="card">
      <img
        src={product.image || FALLBACK}
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK;
        }}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>${product.price.toFixed(2)}</strong>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
}

export default ProductCard;