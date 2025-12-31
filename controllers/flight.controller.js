const Flight = require('../models/flight.model');
const FlightSchedule = require('../models/flightSchedule.model');

const getAllFlights = async (req, res) => {
  try {
    // Get origin and destination from query parameters
    const { from, to } = req.query;

    // Create a query object
    const query = {};
    if (from) 
      query.from = from.toUpperCase().trim();
    if (to)
      query.to = to.toUpperCase().trim();

    // Find desired flights based on given query, sorted in descending order
    const flights = await Flight.find(query).sort({ createdAt: -1 });

    res.status(200).json(flights);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
}

const getFlightById = async (req, res) => {
  try {
    const { flightId } = req.params;
    const flight = await Flight.findById(flightId);

    // Validate a flight route
    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    // Get available flight schedules for the flight
    const schedules = FlightSchedule.find({
      flightId: flight._id,
      status: "available",
      departureTime: { $gte: new Date() }
    }).sort({ departureTime: 1 });    // sorted oldest -> newest

    res.status(200).json({ flight, schedules });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
}

const createFlight = async (req, res) => {
  try {
    const { flightNumber, from, to, durationMinutes } = req.body;

    // Information validation
    if (!flightNumber || !from || !to || !durationMinutes) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Create a route
    const flight = await Flight.create({
      flightNumber,
      from,
      to,
      durationMinutes
    });

    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const createFlightSchedule = async (req, res) => {
  try {
    const { flightId, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
    
    // Information validation
    if (!flightId || !departureTime || !arrivalTime || !basePrice || !totalSeats) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const schedule = await FlightSchedule.create({
      flightId,
      departureTime,
      arrivalTime,
      basePrice,
      totalSeats,
      availableSeats: totalSeats    // as newly created, no seat is occupied
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const updateFlightSchedule = async (req, res) => {
  try {
    const flightId = req.params.id;
    const fields = req.body;

    // Update specific schedule with provided fields
    const schedule = await FlightSchedule.findByIdAndUpdate(
      flightId,  
      fields,
      { new: true, runValidators: true}
    );

    // Schedule validation
    if (!schedule) {
      return res.status(404).json({ message: "Flight schedule not found." });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const deleteFlightSchedule = async (req, res) => {
  try {
    const flightId = req.params.id;
    const schedule = await FlightSchedule.findByIdAndDelete(flightId);

    // Schedule validation
    if (!schedule) {
      return res.status(404).json({ message: "Flight schedule not found." });
    }
    
    res.status(204).json({ message: "Flight schedule deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  createFlightSchedule,
  updateFlightSchedule,
  deleteFlightSchedule
}
