const Hotel = require("../models/Hotel");
const Appointment = require("../models/Appoinment");
const mongoose = require("mongoose");

const recalculateHotelRating = async (hotelId) => {
    const normalizedHotelId = new mongoose.Types.ObjectId(hotelId.toString());

    const stats = await Appointment.aggregate([
        {
            $match: {
                hotel: normalizedHotelId,
                isRated: true,
                rating: { $gte: 1, $lte: 5 }
            }
        },
        {
            $group: {
                _id: "$hotel",
                ratingCount: { $sum: 1 },
                ratingAverage: { $avg: "$rating" }
            }
        }
    ]);

    const ratingCount = stats[0]?.ratingCount || 0;
    const ratingAverage = stats[0]?.ratingAverage || 0;

    await Hotel.findByIdAndUpdate(hotelId, {
        rating: Number(ratingAverage.toFixed(2)),
        ratingCount
    });
};

const sanitizeHotelPayload = (payload = {}) => {
    const sanitized = { ...payload };
    delete sanitized.rating;
    delete sanitized.ratingCount;
    return sanitized;
};

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g, match => `$${match}`);
    console.log(queryStr);

    query = Hotel.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Hotel.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const hotels = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({ success: true, count: hotels.length, data: hotels, pagination });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single hotel
// @route   GET /api/v1/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json({ success: true, data: hotel });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new hotel
// @route   POST /api/v1/hotels
// @access  Private
exports.createHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.create(sanitizeHotelPayload(req.body));
        res.status(201).json({ success: true, data: hotel });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update hotel
// @route   PUT /api/v1/hotels/:id
// @access  Private
exports.updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, sanitizeHotelPayload(req.body), {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: hotel });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/v1/hotels/:id
// @access  Private
exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: `Hotel not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Add rating score
// @route   POST /api/v1/hotels/:id/rate
// @access  Private (user only)
exports.addRating = async (req, res, next) => {
    try {
        const { rating, comment = "", appointmentId } = req.body;
        const hotelId = req.params.id;
        const userId = req.user.id;

        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Only users can rate hotels"
            });
        }

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "appointmentId is required"
            });
        }

        const numericRating = Number(rating);
        if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `Hotel not found with id of ${hotelId}`
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only rate your own appointment"
            });
        }

        if (appointment.hotel.toString() !== hotelId.toString()) {
            return res.status(400).json({
                success: false,
                message: "This appointment does not belong to this hotel"
            });
        }

        if (appointment.isRated || typeof appointment.rating === "number") {
            return res.status(400).json({
                success: false,
                message: "This appointment has already been rated"
            });
        }

        appointment.rating = numericRating;
        appointment.comment = String(comment).trim();
        appointment.isRated = true;
        appointment.ratedAt = new Date();
        await appointment.save();

        await recalculateHotelRating(hotelId);
        const updatedHotel = await Hotel.findById(hotelId);

        res.status(200).json({
            success: true,
            data: {
                hotel: updatedHotel,
                appointment
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.recalculateHotelRating = recalculateHotelRating;