const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Link to the user who placed the order
    ref: 'user',
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalCost: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;