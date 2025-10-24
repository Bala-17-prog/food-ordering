const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
require('dotenv').config();

// --- NODEMAILER SETUP ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @route   POST api/orders/place
// @desc    Place a new order, send email, and return order data
// @access  Private
router.post('/place', authMiddleware, async (req, res) => {
    const { items, totalCost } = req.body;
    try {
        const user = await User.findById(req.user.id);

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalCost,
        });
        const order = await newOrder.save();

        // --- Send Confirmation Email ---
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Your FoodDash Order Confirmation #${order._id}`,
            html: `<h1>Order Confirmed!</h1>
                   <p>Hi ${user.name}, thank you for your order.</p>
                   <p>Your total bill is <strong>₹${totalCost.toFixed(2)}</strong>.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('Error sending order confirmation email:', error);
            else console.log('Order confirmation email sent: ' + info.response);
        });

        res.status(201).json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/orders/bill/:orderId
// @desc    Generate and download a PDF bill for an order
// @access  Private
router.get('/bill/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('user', 'name email');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (order.user._id.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bill-${order._id}.pdf`);
        doc.pipe(res);

        // --- PDF Content ---
        doc.fontSize(20).text('FoodDash Invoice', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Bill To: ${order.user.name}`);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`).moveDown();
        
        // Table Header
        doc.fontSize(14).text('Item', 50, doc.y);
        doc.text('Qty', 300, doc.y, { width: 50, align: 'right' });
        doc.text('Price', 370, doc.y, { width: 70, align: 'right' });
        doc.text('Total', 460, doc.y, { width: 90, align: 'right' });
        doc.moveDown(0.5).lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

        // Table Rows
        order.items.forEach(item => {
            doc.fontSize(12).text(item.name, 50, doc.y);
            doc.text(item.quantity, 300, doc.y, { width: 50, align: 'right' });
            doc.text(`₹${item.price.toFixed(2)}`, 370, doc.y, { width: 70, align: 'right' });
            doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 460, doc.y, { width: 90, align: 'right' });
            doc.moveDown();
        });
        
        doc.moveDown(0.5).lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();
        doc.fontSize(16).text(`Total Cost: ₹${order.totalCost.toFixed(2)}`, { align: 'right' });
        
        doc.end();

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/orders/myorders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get('/myorders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;