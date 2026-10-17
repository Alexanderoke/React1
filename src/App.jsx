import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import { userCart } from "./CartContext";
import "./App.css";

function App() {
  const {count} = userCart();
  return (
    <div className="app">
      <header className = "header">
        <h1><Link to="/">My Shop</Link></h1>
        <Link to="/cart">cart ({count})</Link>
      </header>
  
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/products/:id" element={<ProductDetail />} />
         <Route path="/cart" element={<Cart/>}/>
       </Routes>
     </div>
   );
}

export default App;