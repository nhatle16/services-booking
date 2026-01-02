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
router.route('/flights').get(getAllFlights);
router.route('/flights/:flightId').get(getFlightById);

// Admin
router.route('/flights').post(createFlight);
router.route('/flights/:flightId/schedules').post(createFlightSchedule);
router.route('/schedules/:flightScheduleId')
  .put(updateFlightSchedule)
  .delete(deleteFlightSchedule);

module.exports = router;
