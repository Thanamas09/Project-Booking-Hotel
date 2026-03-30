const express = require("express");
const { getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment } = require("../controllers/appointments");
const { protect, authorize } = require("../middleware/auth");

router = express.Router({ mergeParams: true });

router.route("/").get(protect, getAppointments);
router.route("/:id").get(getAppointment).post(protect, addAppointment).put(protect, authorize("admin", "user"), updateAppointment).delete(protect, authorize("admin", "user"), deleteAppointment);

module.exports = router;