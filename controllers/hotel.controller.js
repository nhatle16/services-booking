const Hotel = require('../models/hotel.model');
const RoomType = require('../models/roomType.model');
const RoomAvailability = require('../models/roomAvailability.model');

const getHotels = async (req, res) => {
  try {
    const { city } = req.body;

    // Create a query object
    const query = {};
    if (city) query.city = city.trim();
    
    // Find desired hotels based on given city, sorted in descending order
    const hotels = await Hotel.find(query).sort({ createdAt: -1 });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const getHotelById = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = Hotel.findById(hotelId)
    
    // Validate a hotel's existence
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Get room types offered by the hotel
    const roomTypes = await RoomType.find({ hotelId: hotel._id });

    res.status(200).json({ hotel, roomTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const getRoomAvailability = async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const { checkIn, checkOut } = req.query;

    // Query parameters validation
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "checkIn and checkOut parameters required. "});
    }

    // Get available rooms
    const availability = await RoomType.find({
      roomTypeId,
      date: {
        $gte: new Date(checkIn),
        $lte: new Date(checkOut)
      }
    }).sort({ createdAt: 1 });    // sorted oldest -> newest
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const createHotel = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    // Information validation
    if (!name || !city || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hotel = await Hotel.create({
      name,
      city,
      address
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }  
}  

const createRoomType = async (req, res)  => {
  try {
    const {
      name,
      maxGuests,
      bedType,
      sizeSqm,
      pricePerNight,
      currency,
      totalRooms
    } = req.body;

    if (!name || !maxGuests || !pricePerNight || !currency || !totalRooms) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const roomType = await RoomType.create({
      name,
      maxGuests,
      bedType,
      sizeSqm,
      pricePerNight,
      currency,
      totalRooms
    });

    res.status(201).json(roomType);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

const updateRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const fields = req.body;

    const roomType = await RoomType.findByIdAndUpdate(
      roomTypeId,
      fields,
      { new: true, runValidators: true }
    );

    // Room type validation
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found." });
    }

    res.status(200).json(roomType);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const deleteRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.id;
    const roomType = await RoomType.findByIdAndDelete(roomTypeId);

    // Validation
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found." });
    }

    await RoomType.deleteMany({ roomTypeId: roomType._id });

    res.status(204).json({ message: "Room type deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

const initializeRoomAvailability = async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const { startDate, endDate } = req.body;

    // Information validation
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Missing start and end date." });
    }

    const roomType = RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found." });
    }

    // Build an availability document for daily
    const docs = [];
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      // Collect availability of a room type on each day
      docs.push({
        roomTypeId,
        date: new Date(currentDate),
        availableRooms: roomType.totalRooms
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add availabilities for this room type to the database
    await RoomAvailability.insertMany(docs, { ordered: false });

    res.status(201).json({ message: "Room type's availability intialized." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  getHotels,
  getHotelById,
  getRoomAvailability,
  createHotel,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  initializeRoomAvailability
}
