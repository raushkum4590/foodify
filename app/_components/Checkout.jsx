import React, { useState } from 'react';
import Header from './_components/Header';

const HomePage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item to the cart
  const addItemToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div>
      <Header cartItems={cartItems} setCart={setCartItems} />
      
      <div className="product-list">
        {/* Example buttons to add items */}        <button
          onClick={() => addItemToCart({ id: 1, name: 'Item 1', price: 10 })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add Item 1 to Cart (₹800)
        </button>
        <button
          onClick={() => addItemToCart({ id: 2, name: 'Item 2', price: 20 })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add Item 2 to Cart (₹1600)
        </button>
      </div>
    </div>
  );
};

export default HomePage;
