import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
// FIX: Correct CSS import path based on file structure
import './CartPage.css'; 

const API_ORDER_ENDPOINT = 'http://localhost:5000/api/place-order';

// Component name must match file name (CartPage.jsx)
export default function CartPage() { 
    // Uses 'cart' from the context
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');
    
    const DELIVERY_FEE = 50.00; 

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCost = subtotal + DELIVERY_FEE;

    // --- Core Order Placement Function ---
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setOrderMessage('Your cart is empty. Please add items before placing an order.');
            return;
        }

        setIsProcessing(true);
        setOrderMessage('Processing your order...');

        const userEmail = localStorage.getItem('userEmail') || 'guest@fooddash.com';
        const orderDetails = {
            items: cart,
            subtotal: subtotal,
            deliveryFee: DELIVERY_FEE,
            total: totalCost,
            userEmail: userEmail,
        };

        try {
            const response = await fetch(API_ORDER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                throw new Error(`Order failed with status: ${response.status}`);
            }

            const result = await response.json();
            
            setOrderMessage(`Order #${result.orderId || '0000'} placed successfully! A confirmation email has been sent to ${userEmail}.`);
            clearCart(); 

            if (result.pdfUrl) {
                const link = document.createElement('a');
                link.href = result.pdfUrl;
                link.setAttribute('download', `Invoice-${result.orderId || '0000'}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                 console.warn("PDF URL not provided by the server. Check backend setup.");
            }

        } catch (error) {
            console.error('Error placing order:', error);
            setOrderMessage(`There was an error placing your order. Please try again. Error: ${error.message}`);
        } finally {
            setTimeout(() => setIsProcessing(false), 1500);
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0, transition: { duration: 0.3 } }
    };

    return ( 
        <div className="cart-page">
            <motion.h1 
                className="cart-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Your Cart
            </motion.h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <motion.p 
                            className="empty-cart-message"
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                        >
                            Your cart is currently empty. Start ordering! 🍔
                        </motion.p>
                    ) : (
                        cart.map((item, index) => (
                            <motion.div 
                                key={item.id + '-' + index}
                                className="cart-item-card"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={itemVariants}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img 
                                    src={item.image || 'placeholder-url-if-not-found'} 
                                    alt={item.name} 
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                    <p className="item-price">Price: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <motion.button
                                    onClick={() => removeFromCart(item.id)}
                                    className="btn btn-remove"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Remove
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="order-summary-card">
                    <h2 className="summary-title">Order Summary</h2>
                    
                    <div className="summary-line">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                        <span>Delivery Fee</span>
                        <span>₹{DELIVERY_FEE.toFixed(2)}</span>
                    </div>

                    <div className="summary-total">
                        <span>Total Cost</span>
                        <span>₹{totalCost.toFixed(2)}</span>
                    </div>

                    <motion.button
                        onClick={handlePlaceOrder}
                        className="btn btn-place-order"
                        disabled={cart.length === 0 || isProcessing}
                        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                        {isProcessing ? 'Placing Order...' : 'Place Order'}
                    </motion.button>
                    
                    {orderMessage && (
                        <p className={`order-message ${isProcessing ? 'processing' : (orderMessage.includes('successfully') ? 'success' : 'error')}`}>
                            {orderMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}