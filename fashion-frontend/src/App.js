import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fashionbbsr.shop/api/product") // 🔗 will change to ECS URL later
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>🧥 Fashion BBSR Products Cateogery & 50% Disscount</h1>
      <h2>Choose Your Cateogery and Explore all Products</h2>
      <ul>
        {products.map((item, i) => <li key={i}>{item.name}</li>)}
      </ul>
    </div>
  );
}

export default App;
