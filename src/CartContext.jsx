import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function Cartprovider({ children}){
  const [items, setItems] = useState([]);


function addToCart(product){
  setItems((current) => {
    const existing = current.find((i) => i.product.id === product.id);
    if (existing){
      return current.map((i) =>
        i.product.id === product.id ? { ...i, qty: i.qty +1} : i);
  }
  return [...current, {product, qty: 1}];
});
}
function changeQty(id, delta) {
  setItems((current) => current.map((i) => (i.product.id === id ? {...i, qty: i.qty + delta}: i))
  .filter((i) => i.qty > 0));
}

function removeFromCart(id) {
  setItems((current) =>current.filter((i) => i.product.id !==id));
}

const count= items.reduce((sum, i) => sum + i.qty, 0);
const total = items.reduce((sum, i) => sum +i.qty * i.product.price, 0);

return (
  <CartContext.Provider value ={{ items, addToCart, changeQty, removeFromCart, count, total}}> 
  {children}
  </CartContext.Provider>
);
}
export function userCart(){
  return useContext(CartContext);
}