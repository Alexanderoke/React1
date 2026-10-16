import { useState } from "react";

function ProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({ name, price: Number(price), description, image });
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add product</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

export default ProductForm;