import React, { useEffect, useState } from 'react';
import { fetchProducts } from './api/products';
import './css/App.css'

const App = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  return (
    <div className='main'>
      <h1>Desserts</h1>
      <ul className='productList'>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} width={100} />
            <p>{product.category}</p>
            <h2>{product.title}</h2>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
