const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Dummy payment processing
router.post('/process', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 90% success rate for simulation
    const isSuccess = Math.random() < 0.9;
    
    if (isSuccess) {
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.json({
        success: true,
        message: 'Payment successful',
        paymentId: paymentId,
        amount: amount
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;