import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://13.202.201.32/8000/api/products") // 🔗 will change to ECS URL later
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>🧥 Fashion SSR Products Cateogery</h1>
      <ul>
        {products.map((item, i) => <li key={i}>{item.name}</li>)}
      </ul>
    </div>
  );
}

export default App;
