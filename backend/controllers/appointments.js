const Hotel = require("../models/Hotel");
const Appointment = require("../models/Appoinment");

const checkAppointmentDate = (checkinDate, checkoutDate) => {
    // Convert string to Date object
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const current = new Date();

    // Remove time part for accurate date comparison
    current.setHours(0, 0, 0, 0);

    if (!checkinDate || !checkoutDate) {
        return "Check-in and check-out date are required"
    }

    // Ensure check-in date is come after today
    if (checkin <= current) {
        return "Check-in date must come after current date"
    }

    // Ensure check-out is after check-in
    if (checkout <= checkin) {
        return "Check-out date must be after check-in date"
    }

    const duration = (checkout - checkin) / (1000 * 60 * 60 * 24); // duration in days

    if (duration > 3) {
        return "Your appointment is exceed 3 nights"
    }
    return null;
}

//@desc Get all appointments
//@route Get /api/v1/appointments
//@access private
exports.getAppointments = async (req, res, next) => {
    let query;
    // General users can only see their own appointments
    if(req.user.role !== 'admin') {
        query = Appointment.find({  user: req.user.id }).populate({
            path: "hotel",
            select: "name address tel"
        }).populate({
            path:"user",
            select: "name email phone"
        });
        // console.log(req.user.role);
    } // If you are admin, you can see all appointments
    else {
        if(req.query.hotelId) {
            console.log("Hotel ID:", req.query.hotelId);
            query = Appointment.find({ hotel: req.query.hotelId }).populate({
                path: "hotel",
                select: "name address tel"
            }).populate({
                path: "user",
                select: "name email phone"
            });
        } else {
            query = Appointment.find().populate({
                path: "hotel",
                select: "name address tel"
            }).populate({
                path: "user",
                select: "name email phone"
            })
        }
    }
    try {
        const appointments = await query;
        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Cannot find Appointment" });
    }
}

//@desc Get single appointment
//@route GET /api/v1/appointment/:id
//@access Public
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: "hotel",
            select: "name province tel"
        }).populate({
            path: "user",
            select: "name email phone"
        });

        if(!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}`});
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Cannot find Appointment" });
    }
};

// @desc Create an appointment
// @route POST /api/v1/hospitals/:hospitalId/appointments
// @access Private
exports.addAppointment = async (req, res, next) => {
    try {
        const { checkinDate, checkoutDate } = req.body;

        let checkDate = checkAppointmentDate(checkinDate, checkoutDate);
        // console.log(checkDate);
        if(checkDate) {
            return res.status(400).json({ success: false, message: checkDate });
        }

        req.body.hotel = req.params.id;
        req.body.user = req.user.id;
        
        const hotel = await Hotel.findById(req.body.hotel);

        if( !hotel ) {
            return res.status(400).json({
                success: false,
                message: `No hotel with id ${req.params.hotelId}`
            });
        }

        const appointment = await Appointment.create(req.body);

        return res.status(200).json({
            success: true,
            data: appointment
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
}

//@desc update appointment
//@route PUT /api/v1/appintments/:id
//@access public
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` });
        }

        if (req.user.role !== "admin" && appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: `User not authorized to update this appointment` });
        }
        // Check if update check-in, check-out date
        if (req.body.checkinDate || req.body.checkoutDate) {
            console.log("Change date");
            let newCheckIn = req.body.checkinDate ? req.body.checkinDate : appointment.checkinDate;
            let newCheckOut = req.body.checkoutDate ? req.body.checkoutDate : appointment.checkoutDate;
            let checkDate = checkAppointmentDate(newCheckIn, newCheckOut);
            if (checkDate) {
                return res.status(400).json({ success: false, message: checkDate });
            }
        }
        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Cannot update Appointment" });
    }
}

// @desc Delete an appointment
// @route DELETE /api/v1/appointments/:id
// @access Private
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` });
        }
        if(appointment.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ success: false, message: "User not authorized to delete this appointment" });
        }
        await appointment.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Cannot delete Appointment" });
    }
}