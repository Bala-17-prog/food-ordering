import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import Marquee from "react-fast-marquee";
// FIX: Correct CSS import path based on file structure
import './Home.css'; 

// MOCK DATA (Retained for functionality)
const restaurants = [
  { id: 1, name: 'Pizza Hut', rating: 4.3, time: '35-45 mins', cuisine: 'Pizzas, Beverages', location: 'Chhindwara City', offer: 'ITEMS AT ₹99', price: 350, image: 'https://i.ibb.co/rQ0Y0k2/pizza-hut-mock.jpg' },
  { id: 2, name: 'Hotel Sai Nath & Sai Restaurant', rating: 4.2, time: '40-45 mins', cuisine: 'North Indian, South Indian, Chinese', location: 'Chhindwara Locality', offer: '₹175 OFF ABOVE ₹699', price: 650, image: 'https://i.ibb.co/v4d2g23/north-indian-mock.jpg' },
  { id: 3, name: 'Adil Hotel', rating: 4.4, time: '40-45 mins', cuisine: 'Biryani, Tandoor', location: 'Chhindwara Locality', offer: 'FREE DELIVERY', price: 320, image: 'https://i.ibb.co/tZ5G7wG/adil-hotel.png' },
  { id: 4, name: 'Dev International', rating: 4.2, time: '55-65 mins', cuisine: 'Chinese, Fast Food, Beverages', location: 'Mohan Nagar', offer: '₹100 OFF ABOVE ₹299', price: 400, image: 'https://i.ibb.co/3s4KfnT/dev-international.png' },
  { id: 5, name: 'Shree Naivedyam', rating: 4.2, time: '45-50 mins', cuisine: 'Chinese, South Indian, Pizzas', location: 'Chhindwara City', offer: '₹40 OFF ABOVE ₹399', price: 180, image: 'https://i.ibb.co/rQj5p4V/juice-mock.jpg' },
  { id: 6, name: 'Bakery World', rating: 4.3, time: '45-50 mins', cuisine: 'Bakery, Ice Cream, Snacks, Beverages', location: 'Parasia Road', offer: 'ITEMS AT ₹99', price: 500, image: 'https://i.ibb.co/Y090r2z/bakery.png' },
  { id: 7, name: 'Jai Ganesh Bhojnalaya', rating: 4.1, time: '50-60 mins', cuisine: 'South Indian, Indian, Chinese', location: 'Bus stand', offer: '20% OFF ALL ITEMS', price: 280, image: 'https://i.ibb.co/q7X0b3X/south-indian-curry-mock.jpg' },
  { id: 8, name: 'food of indians', rating: 3.9, time: '50-60 mins', cuisine: 'Chinese, Beverages', location: 'Shanichara Bazaar', offer: 'FREE FRIES ON ₹199', price: 210, image: 'https://i.ibb.co/v3nB1gR/noodles-mock.jpg' },
];

const moreRestaurants = Array.from({ length: 16 }, (_, i) => ({
    id: i + 9, name: `Restaurant ${i + 9}`, rating: (Math.random() * (4.9 - 3.8) + 3.8).toFixed(1), time: `${(i % 3) * 10 + 30}-${(i % 3) * 10 + 40} mins`, cuisine: i % 2 === 0 ? 'Indian, Fast Food' : 'Continental, Desserts', location: `Area ${i + 1}`, offer: i % 4 === 0 ? `FLAT ₹${i * 10 + 50} OFF` : 'LIMITED TIME OFFER', price: (i * 50) + 100, image: 'https://i.ibb.co/3s4KfnT/dev-international.png'
}));

const allRestaurants = [...restaurants, ...moreRestaurants];

const Navbar = () => {
    // This Navbar component needs to be simplified as its logic conflicts with the Header.jsx component you have.
    // In your file structure, 'Header.jsx' is the main navigation. We use the original version of Header.
    return null; // The main Header component handles this now.
};


export default function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext); 

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    
    const isLoggedIn = user !== null;

    // Framer Motion Variants
    const heroVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
    const textVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.2 } } };
    const cardContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.5 } } };
    const cardItemVariants = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

    // --- CONDITIONAL ADD TO CART HANDLER WITH REDIRECT ---
    const handleAddToCart = (e, item) => {
        e.stopPropagation(); 
        
        if (isLoggedIn) {
            addToCart(item);
            console.log(`${item.name} added to cart! Redirecting to /cart...`);
            navigate('/cart'); 
        } else {
            console.log("Login required to order.");
            alert("Please log in or sign up to order food!");
        }
    };
    
    const handleCardClick = (restaurant) => {
        console.log(`Navigating to ${restaurant.name} menu...`);
    };
    
    const handleViewMenu = () => {
        const exploreSection = document.getElementById('explore-menu-section');
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div 
            className="home-container"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
        >
            {/* The main Navbar is handled by the component Header.jsx wrapped around the App component */}
            
            {/* 2. Hero Section (Modern Banner) */}
            <section className="hero-section">
                <div className="hero-card">
                    <div className="hero-content">
                        <motion.h2 
                            className="hero-title"
                            variants={textVariants}
                        >
                            Order your <br /> 
                            favourite food here
                        </motion.h2>
                        <motion.p 
                            className="hero-description"
                            variants={textVariants}
                        >
                            Choose from a diverse menu featuring a delectable array of dishes crafted with the finest 
                            ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your 
                            dining experience, one delicious meal at a time.
                        </motion.p>
                        <motion.button 
                            className="btn primary-btn"
                            variants={textVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleViewMenu}
                        >
                            View Menu
                        </motion.button>
                    </div>
                </div>
            </section>
            
            {/* 3. Explore Menu Section (Header for the restaurant list) */}
            <section id="explore-menu-section" className="explore-section">
                <motion.h3 
                    className="explore-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Explore our menu
                </motion.h3>
                <motion.p 
                    className="explore-description"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your 
                    cravings and elevate your dining experience, one delicious meal at a time.
                </motion.p>
            </section>

            {/* 4. Restaurant List */}
            <motion.section className="home-section">
                <h2 className="section-title">Restaurants near you (24+ Options) 📍</h2>
                
                <motion.div className="marquee-banner" initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}}>
                    <Marquee gradient={false} speed={50}>
                        <span style={{ color: '#FF4500', fontWeight: 'bold' }}>FLAT 50% OFF ON YOUR FIRST ORDER!</span> • FREE DELIVERY ON ORDERS ABOVE ₹500 • <span style={{ color: '#3CB371', fontWeight: 'bold' }}>🛵 DELIVERY TO {user ? user.location : 'YOUR LOCATION'} IN 20 MINS! 🛵</span> •
                    </Marquee>
                </motion.div>
                
                <motion.div 
                    className="restaurant-list" 
                    variants={cardContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {allRestaurants.map((item) => (
                        <motion.div 
                            key={item.id} 
                            className="restaurant-card" 
                            variants={cardItemVariants}
                            onClick={() => handleCardClick(item)} 
                            role="button"
                            tabIndex={0}
                        >
                            <div className="card-image-container">
                                <img src={item.image} alt={item.name} className="card-image"/>
                                
                                {item.offer && (
                                    <div className="offer-badge">
                                        {item.offer}
                                    </div>
                                )}
                            </div>
                            
                            <div className="card-details">
                                <h3 className="card-title">{item.name}</h3>
                                
                                <p className="card-info">
                                    <span className="rating-pill">★ {item.rating}</span>
                                    <span className="separator"> • </span>
                                    <span className="time-text">{item.time}</span>
                                </p>
                                
                                <p className="cuisine-text">{item.cuisine}</p>
                                <p className="location-text">{item.location}</p>
                                
                                <motion.button
                                    onClick={(e) => handleAddToCart(e, item)}
                                    className={`btn add-to-cart-btn ${isLoggedIn ? 'primary' : 'secondary'}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoggedIn ? `Add to Cart (₹${item.price})` : 'Login to Order'}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
            
            {/* --- Owner's Info --- */}
            <motion.footer 
                className="owner-info" 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '0.9em' }}
            >
                <p>
                    Connect with the owner: <a href="https://www.instagram.com/_guru_raghav__" target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', fontWeight: 'bold', textDecoration: 'none' }}>@_guru_raghav__</a> 
                </p>
            </motion.footer>
        </motion.div>
    );
}