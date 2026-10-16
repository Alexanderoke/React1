function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>
        ${product.price.toFixed(2)}
      </strong>
      
    </div>
  );
}

export default ProductCard;