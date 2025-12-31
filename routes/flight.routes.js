const express = require('express');
const {
  getAllFlights,
  getFlightById,
  createFlight,
  createFlightSchedule,
  updateFlightSchedule,
  deleteFlightSchedule
} = require('../controllers/flight.controller');

const router = express('router');

// Public
router.route('/').get(getAllFlights);
router.route('/:id').get(getFlightById);

// Admin
router.route('/').post(createFlight);
router.route('/schedule').post(createFlightSchedule);
router.route('/schedule/:id')
  .put(updateFlightSchedule)
  .delete(deleteFlightSchedule);

module.exports = router;
