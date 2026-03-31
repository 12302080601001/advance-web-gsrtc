const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const auth = require('../middleware/auth');

// Create booking
router.post('/create', auth, async (req, res) => {
  try {
    const { busId, seatNumbers, journeyDate, totalAmount, paymentId } = req.body;
    
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Check if seats are already booked
    const searchDate = new Date(journeyDate);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const existingBookings = await Booking.find({
      bus: busId,
      journeyDate: { $gte: searchDate, $lt: nextDay },
      status: 'Confirmed',
      seatNumbers: { $in: seatNumbers }
    });
    
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }
    
    const booking = new Booking({
      user: req.user.id,
      bus: busId,
      seatNumbers,
      journeyDate: searchDate,
      totalAmount,
      paymentId,
      status: 'Confirmed'
    });
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('bus');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('bus')
      .sort({ journeyDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:bookingId/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }
    
    // Check if journey date is in future
    const journeyDate = new Date(booking.journeyDate);
    if (journeyDate < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past journeys' });
    }
    
    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;