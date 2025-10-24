// src/pages/MenuPage.jsx

import React, { useState } from 'react';
import MenuList from '../components/MenuList.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { motion } from 'framer-motion';
import './MenuPage.css';

// 1. MOCK DATA UPDATED
// The 'category' field is now an ARRAY to hold multiple values.
const MENU_ITEMS = [
    { id: 101, name: 'Paneer Tikka Masala', price: 279.00, description: 'Cottage cheese cubes in a rich, creamy, and spicy gravy.', image: 'https://i.postimg.cc/Kzwb6p75/Paneer-Tikka-Masala.webp', category: ['Lunch', 'Dinner'] },
    { id: 102, name: 'Butter Chicken', price: 389.00, description: 'Creamy tomato-based curry with succulent chicken pieces.', image: 'https://i.postimg.cc/PJVDnj3V/Butter-Chicken.jpg', category: ['Lunch', 'Dinner'] },
    { id: 103, name: 'Classic Margherita Pizza', price: 299.00, description: 'Fresh mozzarella, basil, and San Marzano tomato sauce.', image: 'https://i.postimg.cc/02zX42rs/Classic-Margherita-Pizza.jpg', category: ['Lunch'] }, // Example: Pizza for Lunch only
    { id: 104, name: 'Spicy Chicken Biryani', price: 349.00, description: 'Fragrant basmati rice cooked with tender chicken and spices.', image: 'https://i.postimg.cc/fWVT8m7K/Spicy-Chicken-Biryani.jpg', category: ['Lunch', 'Dinner'] },
    { id: 105, name: 'Veg Manchurian Noodles', price: 229.00, description: 'Wok-tossed noodles with Manchurian gravy and fresh vegetables.', image: 'https://i.postimg.cc/RZMkDzrj/Veg-Manchurian-Noodles.jpg', category: ['Tiffin'] },
    { id: 106, name: 'Masala Dosa with Sambar', price: 149.00, description: 'Crispy rice crêpe filled with spiced mashed potatoes.', image: 'https://i.postimg.cc/nrJR9vpS/Masala-Dosa-with-Sambar.jpg', category: ['Tiffin'] },
    { id: 107, name: 'Chocolate Fudge Cake', price: 199.00, description: 'Decadent layer cake with dense chocolate frosting.', image: 'https://i.postimg.cc/3rF9b0KY/Chocolate-Fudge-Cake.jpg', category: ['Desserts'] },
    { id: 108, name: 'Grilled Salmon with Asparagus', price: 549.00, description: 'Heart-healthy salmon fillet, lightly seasoned and grilled.', image: 'https://i.postimg.cc/YqSNnXnD/Grilled-Salmon-with-Asparagus.jpg', category: ['Dinner'] }, // Example: Salmon for Dinner only
    { id: 109, name: 'Fresh Lime Soda', price: 89.00, description: 'Sweet or salted, refreshing sparkling drink.', image: 'https://i.postimg.cc/CKd14P4P/fresh-lime-soda.jpg', category: ['Beverages'] },
];

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // 2. LOGIC UPDATED
    // This code now automatically finds all unique categories from the arrays.
    const allCategories = MENU_ITEMS.flatMap(item => item.category);
    const uniqueCategories = [...new Set(allCategories)];
    const categories = ['All', ...uniqueCategories.sort()]; // e.g., ['All', 'Beverages', 'Desserts', 'Lunch', 'Dinner', 'Tiffin']

    // 3. LOGIC UPDATED
    // This now checks if the item's category *array* includes the selected category.
    const filteredItems = selectedCategory === 'All'
        ? MENU_ITEMS 
        : MENU_ITEMS.filter(item => item.category.includes(selectedCategory));

    return (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{padding: '20px'}}
        >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '25px' }}>Today's Exclusive Menu</h2>
            
            {/* This component needs no changes */}
            <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* This component needs no changes */}
            <MenuList items={filteredItems} />

        </motion.section>
    );
}