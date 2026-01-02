// Initialize Express application
const express = require('express');
const app = express();

const hotelRouter = require('./controllers/hotel.controller');
const flightRouter = require('./controllers/flight.controller');
const bookingRouter = require('./controllers/booking.controller');

app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/v1', hotelRouter);
app.use('/api/v1', flightRouter);
app.use('/api/v1', bookingRouter);

module.exports = app;
