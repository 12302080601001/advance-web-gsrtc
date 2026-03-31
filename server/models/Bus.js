const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: String, // Format: "08:30 AM"
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g., "4h 30m"
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 40
  },
  fare: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    enum: ['AC Sleeper', 'Non-AC Seater', 'AC Seater', 'Volvo AC'],
    default: 'AC Seater'
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
  }]
});

module.exports = mongoose.model('Bus', busSchema);