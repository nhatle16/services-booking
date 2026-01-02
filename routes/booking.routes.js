const express = require('express');
const { bookFlight, bookHotel, cancelBooking } = require('../controllers/booking.controller');

const router = express.Router();

router.route('/bookings/flight').post(bookFlight);
router.route('/bookings/hotel').post(bookHotel);
router.route('/bookings/:bookingId/cancel').delete(cancelBooking);

module.exports = router;
