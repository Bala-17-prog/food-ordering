import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import './DietPlannerPage.css'; // Import the new CSS

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span><span></span><span></span>
  </div>
);

export default function DietPlannerPage() {
  const { addToCart } = useContext(CartContext);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am your personal diet planner. To start, what is your age?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('age');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const questions = {
    age: 'Great! Now, what is your weight in kilograms?',
    weight: 'Perfect. What is your height in centimeters?',
    height: 'Almost there. What is your primary fitness goal?',
    goal: 'Thank you! Generating your personalized diet plan now. This might take a moment...'
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: userInput }];
    setChatHistory(newHistory);
    
    const updatedFormData = { ...formData, [currentQuestion]: userInput };
    setFormData(updatedFormData);
    setUserInput('');

    if (currentQuestion === 'goal') {
      setLoading(true);
      setCurrentQuestion('finished');
      setTimeout(() => {
        setChatHistory([...newHistory, { sender: 'ai', text: questions.goal }]);
        fetchDietPlan(updatedFormData);
      }, 500);
    } else {
      const nextQuestionKey = Object.keys(questions)[Object.keys(questions).indexOf(currentQuestion) + 1];
      setCurrentQuestion(nextQuestionKey);
      setTimeout(() => {
        setChatHistory([...newHistory, { sender: 'ai', text: questions[currentQuestion] }]);
      }, 500);
    }
  };

  const fetchDietPlan = async (finalFormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get a diet plan from the server.');
      }
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'ai', plan: data.plan }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: `Sorry, an error occurred: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    if (currentQuestion === 'goal') {
      return (
        <select value={userInput} onChange={(e) => setUserInput(e.target.value)}>
          <option value="">Select your goal...</option>
          <option value="lose weight">Lose Weight</option>
          <option value="maintain weight">Maintain Weight</option>
          <option value="gain muscle">Gain Muscle</option>
        </select>
      );
    }
    return (
      <input
        type="number"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={`Enter your ${currentQuestion}...`}
        required
      />
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="diet-planner-page">
      <div className="chat-window">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
              {msg.plan && (
                <div className="diet-plan-card">
                  <h3>Your Personal Plan for Today:</h3>
                  {msg.plan.map((meal, mealIndex) => (
                    <div key={mealIndex} className="meal-section">
                      <h4>{meal.meal}</h4>
                      <p style={{ fontStyle: 'italic', color: 'var(--secondary-text)' }}>{meal.suggestion}</p>
                      {meal.recommendedFoods.map(food => (
                        <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <span>{food.name} - ₹{food.price}</span>
                          <button onClick={() => addToCart(food)} className="btn secondary">Add</button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
        {currentQuestion !== 'finished' && (
          <div className="chat-input-area">
            <form onSubmit={handleUserInput}>
              {renderInput()}
              <button type="submit" className="btn primary">Send</button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
}