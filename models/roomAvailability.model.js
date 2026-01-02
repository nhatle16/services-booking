const mongoose = require('mongoose');

const roomAvailabilitySchema = new mongoose.Schema(
  {
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 0
    }
  },

  { timestamps: true }
);

// Ensure unique availability record per room type and per date
roomAvailabilitySchema.index(
  { roomTypeId: 1, date: 1 }, 
  { unique: true }
);

module.exports = mongoose.model("RoomAvailability", roomAvailabilitySchema);
