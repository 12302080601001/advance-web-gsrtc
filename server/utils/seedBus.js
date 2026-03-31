const mongoose = require('mongoose');
const Bus = require('../models/Bus');
require('dotenv').config();

const sampleBuses = [
  {
    busNumber: 'GJ-01-1234',
    source: 'Ahmedabad',
    destination: 'Surat',
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
    duration: '5h 30m',
    totalSeats: 40,
    fare: 350,
    busType: 'AC Seater',
    amenities: ['WiFi', 'Charging Point', 'Water Bottle']
  },
  {
    busNumber: 'GJ-02-5678',
    source: 'Ahmedabad',
    destination: 'Vadodara',
    departureTime: '08:00 AM',
    arrivalTime: '10:30 AM',
    duration: '2h 30m',
    totalSeats: 45,
    fare: 180,
    busType: 'Non-AC Seater',
    amenities: ['Charging Point']
  },
  {
    busNumber: 'GJ-03-9012',
    source: 'Surat',
    destination: 'Mumbai',
    departureTime: '09:00 PM',
    arrivalTime: '03:30 AM',
    duration: '6h 30m',
    totalSeats: 36,
    fare: 650,
    busType: 'AC Sleeper',
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle']
  },
  {
    busNumber: 'GJ-04-3456',
    source: 'Rajkot',
    destination: 'Ahmedabad',
    departureTime: '07:00 AM',
    arrivalTime: '11:00 AM',
    duration: '4h',
    totalSeats: 40,
    fare: 280,
    busType: 'AC Seater',
    amenities: ['WiFi', 'Charging Point']
  },
  {
    busNumber: 'GJ-05-7890',
    source: 'Vadodara',
    destination: 'Mumbai',
    departureTime: '10:00 PM',
    arrivalTime: '04:30 AM',
    duration: '6h 30m',
    totalSeats: 40,
    fare: 550,
    busType: 'Volvo AC',
    amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket']
  },
  {
    busNumber: 'GJ-06-1122',
    source: 'Ahmedabad',
    destination: 'Udaipur',
    departureTime: '07:30 PM',
    arrivalTime: '12:30 AM',
    duration: '5h',
    totalSeats: 40,
    fare: 420,
    busType: 'AC Seater',
    amenities: ['WiFi', 'Charging Point']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing buses
    await Bus.deleteMany({});
    console.log('Cleared existing buses');
    
    // Insert sample buses
    await Bus.insertMany(sampleBuses);
    console.log(`✅ Added ${sampleBuses.length} sample buses`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();