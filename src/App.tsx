import React, { useEffect, useState } from 'react';
import { fetchProducts } from './api/products';
import './css/App.css';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        var quantity = item.quantity - 1
        if (item.id === productId && quantity === 0) {
          removeFromCart(productId);
        } else if (item.id === productId && item.quantity > 0) {
          return { ...item, quantity: quantity };
        }
        return item;
      });
  
      return updatedCart;
    });
  };

  return (
    <div className='main'>
      <div className='container'>
        <div className='products'>
          <h1>Desserts</h1>
          <ul className='products_list'>
            {products.map((product) => (
              <li key={product.id}>
                <div className='product__list-imgContainer'>
                  <img src={product.image} alt={product.title} width={100} />
                  {!cart.some((item) => item.id === product.id) ? (
                    <button className='product__addToCart' onClick={() => addToCart(product)}>Add to Cart</button>
                  ) : (
                    <div className='product__list-controls'>
                      <button onClick={() => decreaseQuantity(product.id)}>-</button>
                      <button onClick={() => increaseQuantity(product.id)}>+</button>
                    </div>
                  )}
                </div>
                <p>{product.category}</p>
                <h2>{product.title}</h2>
                <p>${product.price}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className='cart'>
          <h2>Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    <h4>{item.title}</h4>
                    <span>{item.quantity}x</span>
                    <span>$ {item.price} </span>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </li>
                ))}
              </ul>
              <div>
                <p>Order Total</p>
                <span>
                  $ {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
