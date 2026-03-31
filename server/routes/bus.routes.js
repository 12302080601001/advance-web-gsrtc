const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

// Search buses
router.get('/search', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Find buses matching route
    const buses = await Bus.find({
      source: { $regex: new RegExp(source, 'i') },
      destination: { $regex: new RegExp(destination, 'i') }
    });
    
    // Calculate available seats for each bus
    const busesWithAvailability = await Promise.all(buses.map(async (bus) => {
      const bookedSeats = await Booking.aggregate([
        {
          $match: {
            bus: bus._id,
            journeyDate: { $gte: searchDate, $lt: nextDay },
            status: 'Confirmed'
          }
        },
        { $unwind: '$seatNumbers' },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]);
      
      const bookedCount = bookedSeats[0]?.count || 0;
      const availableSeats = bus.totalSeats - bookedCount;
      
      return {
        ...bus.toObject(),
        availableSeats: Math.max(0, availableSeats),
        bookedSeats: bookedCount
      };
    }));
    
    res.json(busesWithAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seat map for a bus on specific date
router.get('/:busId/seats', async (req, res) => {
  try {
    const { busId } = req.params;
    const { date } = req.query;
    
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    // Get booked seats for this date
    const bookings = await Booking.find({
      bus: busId,
      journeyDate: { $gte: searchDate, $lt: nextDay },
      status: 'Confirmed'
    });
    
    const bookedSeats = bookings.flatMap(b => b.seatNumbers);
    
    // Generate seat layout (example: 40 seats)
    const totalSeats = bus.totalSeats;
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = i.toString();
      seats.push({
        number: seatNumber,
        status: bookedSeats.includes(seatNumber) ? 'booked' : 'available'
      });
    }
    
    res.json({
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        source: bus.source,
        destination: bus.destination,
        departureTime: bus.departureTime,
        fare: bus.fare
      },
      seats,
      journeyDate: date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;