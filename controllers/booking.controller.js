const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');
const RoomType = require('../models/roomType.model');
const RoomAvailability = require('../models/roomAvailability.model');

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
    
  } catch (error) {
    
  }
}

const cancelBooking = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}
