// food-app-backend/routes/ai.js

const express = require('express');
const router = express.Router();
// Import the Google Gen AI SDK
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// --- Configuration ---
// Initialize the GoogleGenAI client for the Gemini API
// Prefer GEMINI_API_KEY, fall back to GOOGLE_API_KEY for older examples
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn('Warning: No Gemini API key found in environment. Set GEMINI_API_KEY or GOOGLE_API_KEY to use the /api/ai endpoints.');
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Define the JSON schema for the model's response.
const dietPlanSchema = {
    type: "object",
    properties: {
        plan: {
            type: "array",
            description: "A list of meal plans for the day.",
            items: {
                type: "object",
                properties: {
                    meal: {
                        type: "string",
                        description: "The name of the meal (e.g., Breakfast, Lunch, Dinner).",
                    },
                    suggestion: {
                        type: "string",
                        description: "A brief, encouraging suggestion for the meal.",
                    },
                    recommendedFoods: {
                        type: "array",
                        description: "A list of food names, selected ONLY from the availableFoods array.",
                        items: {
                            type: "string",
                        },
                    },
                },
                required: ["meal", "suggestion", "recommendedFoods"],
            },
        },
    },
    required: ["plan"],
};

// The final list of available foods with dummy data structure matching MOCK data
const availableFoods = [
    { id: 1, name: 'Paneer Butter Masala', price: 250, image: 'https://i.postimg.cc/y8yN7f2k/paneer-butter-masala.jpg' },
    { id: 2, name: 'Chicken Biryani', price: 320, image: 'https://i.postimg.cc/zvbNqZ8V/chicken-biryani.jpg' },
    { id: 4, name: 'Masala Dosa', price: 150, image: 'https://i.postimg.cc/wv5255rZ/masala-dosa.jpg' },
    { id: 5, name: 'Grilled Chicken Salad', price: 280, image: 'https://i.postimg.cc/wMPy0YWH/grilled-chicken-salad.jpg' },
    { id: 6, name: 'Oats Upma', price: 120, image: 'https://i.postimg.cc/pXj22802/oats-upma.jpg' },
    { id: 7, name: 'Mixed Vegetable Curry', price: 220, image: 'https://i.postimg.cc/wMKJbTSP/mixed-veg-curry.jpg' },
];

// --- Router Endpoint ---
router.post('/generate-diet-plan', async (req, res) => {
    const { age, weight, height, goal } = req.body;

    if (!age || !weight || !height || !goal) {
        return res.status(400).json({ msg: 'Please provide all details (age, weight, height, goal).' });
    }
    
    const foodListString = availableFoods.map(f => f.name).join(", ");
    
    // 1. Construct the Prompt
    const userPrompt = `You are a professional nutritionist. Based on the user details (Age: ${age}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}) and the available foods [${foodListString}], create a concise one-day diet plan (Breakfast, Lunch, Dinner, Snack). Select items *only* from the available foods list.`;

    try {
        // 2. Call the Gemini API for structured generation
        const response = await ai.models.generateContent({
            // SPECIFYING GEMINI VERSION: Using the recommended Gemini 2.5 Flash model
            model: "gemini-2.5-flash", 
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dietPlanSchema,
                temperature: 0.7,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        
        if (!jsonResponse.plan || !Array.isArray(jsonResponse.plan)) {
            throw new Error("AI did not return a valid 'plan' array.");
        }

        // 3. Post-Process the Plan: Replace food names with full objects
        const planWithDetails = jsonResponse.plan.map(mealPlan => {
            const detailedFoods = mealPlan.recommendedFoods.map(foodName => {
                // Find the full food object (with price and image) by name
                return availableFoods.find(food => food.name === foodName);
            }).filter(Boolean);

            return { ...mealPlan, recommendedFoods: detailedFoods };
        });

        // 4. Send the final, detailed response
        res.json({ 
            plan: planWithDetails,
            // Explicitly mentioning the model version in the response for debugging/confirmation
            model_version: "gemini-2.5" 
        });

    } catch (error) {
        console.error("AI Generation Error (Gemini):", error);
        res.status(500).json({ msg: "Server error generating diet plan. Please ensure GEMINI_API_KEY is set correctly." });
    }
});

module.exports = router;