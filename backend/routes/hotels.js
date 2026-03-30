const {getHotels, getHotel, createHotel, updateHotel, deleteHotel, addRating } = require("../controllers/hotels");
const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getHotels).post(protect, authorize("admin"), createHotel);
router.route("/:id").get(getHotel).put(protect, authorize("admin"), updateHotel).delete(protect, authorize("admin"), deleteHotel);
router.post("/:id/rate",protect, authorize("admin", "user"), addRating);

module.exports = router;