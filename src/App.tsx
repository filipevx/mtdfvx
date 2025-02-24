import React, { useEffect, useState } from 'react';
import { fetchProducts } from './api/products';
import { ReactComponent as CartIcon } from './assets/icon-add-to-cart.svg';
import { ReactComponent as DecrementIcon } from './assets/icon-decrement-quantity.svg';
import { ReactComponent as IncrementIcon } from './assets/icon-increment-quantity.svg';
import { ReactComponent as EmptyCartIcon } from './assets/illustration-empty-cart.svg';
import { ReactComponent as RemoveIcon } from './assets/icon-remove-item.svg';
import { ReactComponent as CarbonIcon } from './assets/icon-carbon-neutral.svg';
import { ReactComponent as OrderConfirmedIcon } from './assets/icon-order-confirmed.svg';

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
  image: string;
};

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalOpen, setOpenModal] = useState<boolean>(false)

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

  const resetCart = () => {
    setCart([])
    setOpenModal(false)
    localStorage.setItem('cart', `[]`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const scrollToCart = () => {
    const cartSection = document.getElementById("cart");

    if (cartSection) {
      cartSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
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
          <h1 className='products__title'>Desserts</h1>
          <ul className='products__list'>
            {products.map((product) => (
              <li key={product.id} className='product'>
                <div className={`product__imgContainer ${cart.some((item) => item.id === product.id) ? 'product__imgContainer--selected' : ''}`}>
                  <img src={product.image} alt={product.title} width={100} />
                  {!cart.some((item) => item.id === product.id) ? (
                    <button className='product-addToCart' onClick={() => addToCart(product)}><CartIcon className='cart-icon' /> Add to Cart</button>
                  ) : (
                    <div className='product__controls'>
                      <button onClick={() => decreaseQuantity(product.id)}><DecrementIcon className='decrement-icon' /></button>
                      <span>{cart.find((item) => item.id === product.id)?.quantity || 0}</span>
                      <button onClick={() => increaseQuantity(product.id)}><IncrementIcon className='increment-icon' /></button>
                    </div>
                  )}
                </div>
                <p className='product__category'>{product.category}</p>
                <h2 className='product__title'>{product.title}</h2>
                <span className='product__price'>${product.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='cart' id='cart'>
          <div className='cart__container'>
            <h2 className='cart__title'>Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h2>
            {cart.length === 0 ? (
              <>
                <EmptyCartIcon className='emptycart-icon' />
                <p className='cart__text'>Your added items will appear here</p>
              </>
            ) : (
              <div>
                <ul className='cart__list'>
                  {cart.map((item) => (
                    <li key={item.id} className='cartItem'>
                      <h4 className='cartItem__title'>{item.title}</h4>
                      <div className='cartItem__resume'>
                        <div>
                          <span className='cartItem__quantity'>{item.quantity}x</span>
                          <span className='cartItem__price'>@ ${item.price} <b>${(item.price * item.quantity).toFixed(2)}</b></span>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className='button-remove'><RemoveIcon className='remove-icon' /> </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className='cart__total'>
                  <p>Order Total</p>
                  <span>
                    $ {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <div className='cart__carbon'>
                  <CarbonIcon className='carbon-icon' />
                  <p>
                    This is a <b>carbon-neutral</b> delivery
                  </p>
                </div>  
                <button className='confirmOrder-button' onClick={() => setOpenModal(true)}>Confirm Order</button>
                             
              </div>
            )}
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal__content">
            <OrderConfirmedIcon className="modal__icon" />
            <h2 className="modal__title">Order Confirmed</h2>
            <p className="modal__text">We hope you enjoy your food!</p>
            <div className='modal__block'>
              <ul className="modal__list">
                {cart.map((item) => (
                  <li key={item.id} className="modal__item">
                    <div className="modal__details">
                      <img src={item.image} alt={item.title} className="modal__image" />
                      <div>
                        <h4 className="modal__name">{item.title}</h4>
                        <span className="modal__quantity">
                          {item.quantity}x <span className='modal__price'>@ ${item.price}</span>
                        </span>
                      </div>
                    </div>
                    <span className="modal__priceTotal">
                      <b>${(item.price * item.quantity).toFixed(2)}</b>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="modal__total">
                <p>Order Total</p>
                <span>$ {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>
            <button className='finishOrder-button' onClick={() => resetCart()}>Start New Order</button>
          </div>
        </div>
      )}
      <button 
        className="scroll-to-cart-btn" 
        onClick={scrollToCart}
      >
        <CartIcon className='cartgo-icon' /> {cart.reduce((total, item) => total + item.quantity, 0)}
      </button>
    </div>
  );
};

export default App;
