import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Need useNavigate for redirect
import { CartContext } from "../context/CartContext"; 

export default function MenuItem({ item }){
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check login status on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(user !== null);
  }, []);

  const handleAddToCart = () => {
    if (isLoggedIn) {
      // 1. Add item to cart
      addToCart(item);
      console.log(`Added ${item.name} to cart. Redirecting to /cart...`);
      // 2. Redirect to the Cart Page after successful addition
      navigate('/cart'); 
    } else {
      // User is NOT logged in: Prompt and redirect
      alert("Please log in to add items to your cart!");
      navigate('/login'); 
    }
  };

  return (
    <article className="card menu-item fade-in">
      {/* Dynamic Image Placeholder */}
      <img 
        src={item.image || `https://placehold.co/300x150/ff9933/fff?text=${item.name.split(' ')[0]}`} 
        alt={item.name} 
        className="menu-item-image"
        style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '10px'}}
      />
      
      <div style={{padding: '10px 15px'}}>
        <h3>{item.name}</h3>
        {item.description && <p className="muted">{item.description}</p>}
      </div>
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding: '10px 15px'}}>
        <strong>₹{item.price.toFixed(2)}</strong>
        <button className={`btn ${isLoggedIn ? 'primary' : 'secondary'}`} onClick={handleAddToCart}>
          {isLoggedIn ? 'Add to Cart' : 'Login to Order'}
        </button>
      </div>
    </article>
  );
}