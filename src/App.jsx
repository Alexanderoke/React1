import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1><Link to="/">My Shop</Link></h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;