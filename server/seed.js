const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const buses = [
  { busNumber: 'GJ-01-1234', source: 'Surat', destination: 'Mumbai', departureTime: '06:00 AM', arrivalTime: '11:30 AM', duration: '5h 30m', totalSeats: 40, fare: 350, busType: 'AC Seater', amenities: ['WiFi', 'Charging Point'] },
  { busNumber: 'GJ-05-5678', source: 'Ahmedabad', destination: 'Surat', departureTime: '08:00 AM', arrivalTime: '01:00 PM', duration: '5h', totalSeats: 30, fare: 450, busType: 'AC Sleeper', amenities: ['Water Bottle', 'Blanket'] }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Bus = require('./models/Bus');
  await Bus.deleteMany({});
  await Bus.insertMany(buses);
  console.log("✅ Database seeded with buses successfully using correct fare!");
  process.exit();
}).catch(err => console.error(err));