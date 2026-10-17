
import {useState} from "react";
import { Link } from "react-router-dom";
import { userCart } from "./CartContext";
const ORDERS_API = "http://localhost:3001/api/orders";

function Checkout() {
  const { items, total, clearCart } = userCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  async function handleSubmit(e) {
  e.preventDefault();
  setSubmitting(true);
  setError("");
  try {
    const res = await fetch(ORDERS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        email,
        items: items.map((i) => ({ product_id: i.product.id, qty: i.qty })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Server error ${res.status}`);
    }
    clearCart();
    setOrderId(data.id);
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
}
  if (orderId) {
    return(
      <div>
        <h2>Thank you!</h2>
        <p>Your order #{orderId} has been placed.</p>
        <Link to="/">Back to shop</Link>
      </div>
       );    
  }
  if (items.length ===0){
    return(
      <div>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p>{items.length}item(s), total <strong>${total.toFixed(2)}</strong></p>
      <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required/>
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      {error && <p style={{color: "crimson"}}>{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}

export default Checkout;