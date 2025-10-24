import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; 

export default function Header() {
    // State to hold the logged-in user data
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    // Access 'cart' from CartContext (which exports the state as 'cart')
    const { cart } = useContext(CartContext); 

    // Calculate total number of items for the badge (Robust Calculation)
    // This will recalculate every time the cart state changes, which is what we want.
    const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    useEffect(() => {
        // Initialize user state once on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // Ensure data integrity by parsing only if it exists
            setUser(JSON.parse(storedUser));
        }
        // Dependency array is empty ([]), so this runs only once.
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // Force a full refresh to clear all application state reliably
        window.location.href = '/login';
    };

    return (
        <header className="header">
            {/* Brand/Logo */}
            <NavLink to="/" className="brand">FoodDash</NavLink>
            
            <nav>
                {/* --- Primary Navigation Links --- */}
                <NavLink to="/">Home</NavLink>
                <NavLink to="/menu">Menu</NavLink>
                <NavLink to="/diet-planner">AI Diet Planner</NavLink>
                <NavLink to="/about">About</NavLink>

                {/* --- Cart Link with Badge --- */}
                <NavLink to="/cart" className="cart-link">
                    Cart
                    {/* Badge shows the total number of items in the cart */}
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </NavLink>

                {/* --- Conditional Login/Profile Links --- */}
                {user ? (
                    <>
                        {/* Display user's name as profile link */}
                        <NavLink to="/profile">{user.name}</NavLink>
                        <button onClick={handleLogout} className="btn secondary">Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signup" className="btn primary">Sign Up</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}