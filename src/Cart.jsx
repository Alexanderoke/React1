import { Link } from "react-router-dom";
import { userCart } from "./CartContext";

function Cart(){
  const { items, changeQty, removeFromCart, total} =userCart();
  if (items.length === 0){
    return (
      <div>
        <p>Your cart is empty</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your cart</h2>
      {items.map(({ product, qty }) => (
        <div key={product.id} className="cart-row">
          <span>{product.name}</span>
          <span>
            <button onClick={() => changeQty(product.id, -1)}>-</button>
            {" "}{qty}{" "}
            <button onClick={() => changeQty(product.id, 1)}>+</button>
          </span>
          <span>${(product.price * qty).toFixed(2)}</span>
          <button onClick={() => removeFromCart(product.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

export default Cart;