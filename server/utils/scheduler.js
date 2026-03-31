const cron = require('node-cron');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// Run every 15 minutes
const startScheduler = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('🕐 Running reminder scheduler...');
    
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      // Find bookings with journey date within next hour
      const upcomingBookings = await Booking.find({
        journeyDate: { $gte: now, $lte: oneHourLater },
        status: 'Confirmed',
        reminderSent: false
      }).populate('bus user');
      
      for (const booking of upcomingBookings) {
        // Simulate sending reminder email/SMS
        console.log(`📧 REMINDER SENT to ${booking.user.email}`);
        console.log(`   Bus: ${booking.bus.busNumber}`);
        console.log(`   From: ${booking.bus.source} To: ${booking.bus.destination}`);
        console.log(`   Departure: ${booking.bus.departureTime}`);
        console.log(`   Seats: ${booking.seatNumbers.join(', ')}`);
        
        // Mark reminder as sent
        booking.reminderSent = true;
        await booking.save();
      }
      
      if (upcomingBookings.length > 0) {
        console.log(`✅ Sent reminders for ${upcomingBookings.length} booking(s)`);
      }
    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  });
  
  console.log('⏰ Reminder scheduler started (runs every 15 minutes)');
};

module.exports = startScheduler;