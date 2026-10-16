import { useState } from "react";

const FALLBACK = "https://picsum.photos/seed/placeholder/300/200";

function ProductCard({ product, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(product);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    await onUpdate(product.id, { ...form, price: Number(form.price) });
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(product);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="card">
        <input name="name" value={form.name} onChange={handleChange} />
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
        <input name="description" value={form.description} onChange={handleChange} />
        <input name="image" value={form.image} onChange={handleChange} />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    );
  }

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
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
}

export default ProductCard;