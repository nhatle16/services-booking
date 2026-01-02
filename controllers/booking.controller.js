const Booking = require('../models/booking.model');
const RoomType = require('../models/roomType.model');
const RoomAvailability = require('../models/roomAvailability.model');
const FlightSchedule = require('../models/flightSchedule.model');

const bookHotel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomTypeId, checkInDate, checkOutDate, bookingQuantity } = req.body;

    if (!roomTypeId || !checkInDate || !checkOutDate || !bookingQuantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Controller-level validate for booking date
    if (checkOut <= checkIn) {
      return res.status(400).json({ message: "checkOutDate must be after checkInDate." });
    }

    // Get room type
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found." });
    }

    // Get availability for room type within the date range
    const roomAvailability = await RoomAvailability.find({
      roomTypeId,
      date: { $gte: checkIn, $lt: checkOut }
    });

    // Validate if the room availability is initialized and sotred
    if (roomAvailability.length === 0) {
      return res.status(400).json({ message: "Room availability not initialized." });
    }

      // Check available rooms for each day
    for (const day in roomAvailability) {
      if (day.availableRooms < bookingQuantity) {
        return res.status(409).json({ message: "Not enough rooms available." });
      }
    }

    // Enough rooms to book so decrease number of rooms within the date range
    for (const day of roomAvailability) {
      day.availableRooms -= bookingQuantity;
      await day.save()    // update the date's availability
    }

    // Calculate total booking price
    const totalPrice = roomAvailability.length * roomType.pricePerNight * bookingQuantity;

    // Create booking
    const booking = await Booking.create({
      userId,
      bookingType: "hotel",
      hotelId: roomType.hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      bookingQuantity,
      totalPrice,
      currency: "CAD"
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
} 

const bookFlight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { flightScheduleId, bookingQuantity } = req.body;

    if (!flightScheduleId || !bookingQuantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Get flight schedule
    const flightSchedule = await FlightSchedule.findById(flightScheduleId);
    
    if (!flightSchedule) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check available seats
    if (flightSchedule.availableSeats < bookingQuantity) {
      return res.status(409).json({ message: "Not enough seats available."});
    }

    flightSchedule.availableSeats -= bookingQuantity;
    await flightSchedule.save();    // update the flight availability

    // Calculate total booking price
    const totalPrice = flightSchedule.basePrice * bookingQuantity;

    const booking = await Booking.create({
      userId,
      bookingType: "flight",
      flightScheduleId,
      bookingQuantity,
      totalPrice,
      currency: "CAD"
    });

    res.status(201).json(booking);
   } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    // Booking and booking status validation
    if (!booking || !booking.status !== "confirmed") {
      return res.status(400).json({ message: "Cannot cancel invalid booking." });
    }

    // CANCEL HOTEL BOOKING
    if (booking.bookingType === "hotel") {
      const roomAvailability = await RoomAvailability.find({
        roomTypeId: booking.roomTypeId,
        date: { $gte: booking.checkInDate, $lt: booking.checkOutDate }
      });

      // Restore the number of booked rooms
      for (const day in roomAvailability) {
        day.availableRooms += bookingQuantity;  
        await day.save();
      }
    }

    // CANCEL FLIGHT BOOKING
    if (booking.bookingType === "flight") {
      const flightSchedule = await FlightSchedule.findById(booking.flightScheduleId);
      
      // Restore the number of occupied seats
      flightSchedule.availableRooms += bookingQuantity;
      await flightSchedule.save();
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(204).json({ message: "Booking cancelled." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  bookHotel,
  bookFlight,
  cancelBooking
}
