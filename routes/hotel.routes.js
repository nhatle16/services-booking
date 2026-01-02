const express = require('express');
const {
  getHotels,
  getHotelById,
  getRoomAvailability,
  createHotel,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  initializeRoomAvailability
} = require('../controllers/hotel.controller');

const router = express.Router();

router.route('/hotels').get(getHotels);
router.route('/hotels/:hotelId').get(getHotelById);
router.route('/rooms/:roomTypeId/availability').get(getRoomAvailability);

router.route('/hotels').post(createHotel);
router.route('/hotels/:hotelId/rooms').post(createRoomType);
router.route('/rooms/:roomTypeId/vailability').post(initializeRoomAvailability);
router.route('/rooms/:roomTypeId')
  .put(updateRoomType)
  .delete(deleteRoomType);

module.exports = router;
