const Hotel = require("../models/Hotel");
const Appointment = require("../models/Appoinment");

const calRating = async (userId, hotelId) => {

    const current = new Date();
    const stats = await Appointment.find({
        hotel: hotelId,
        user: userId,
        checkoutDate: {
            $lt: current
        },
        rating: { $exists: true }
    })

    let count = stats.length;
    let ratingSum = stats.reduce((acc, curr) => {
        return acc + curr.rating;
    }, 0);

    await Hotel.findByIdAndUpdate(hotelId, {
        rating: ratingSum/count,
        ratingCount: count
    });
}

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Replace operators with $gt, $gte, etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g, match => `$${match}`);
    console.log(queryStr);

    // Finding resource
    query = Hotel.find(JSON.parse(queryStr));

    // select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    try {
        const total = await  Hotel.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const hotels = await query;
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
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
        const hotel = await Hotel.create(req.body);
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
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
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
        if( !hotel ) {
            return res.status(404).json({ success: false, message: `Hotel not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: {} });
    }  catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//@desc     Add rating score
//@route    POST /api/v1/hotels/:id/rating
//@access   Public
exports.addRating = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const hotelId = req.params.id;
        const userId = req.user.id;

        const hotel = await Hotel.findById(hotelId);
        
        if(!hotel) {
            return res.status(400).json({ success: false, message: `Hotel not found with id of ${hotelId}`});
        }
        if(req.user.role === "admin") {
            await Hotel.findByIdAndUpdate(hotelId, req.body);
            return res.status(200).json({
                success: true,
                data: hotel
        })

        }

        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            })
        }

        const current = new Date();

        // Finding User's Appointments
        const appointment = await Appointment.findOne({
            user: userId,
            hotel: hotelId,
            checkoutDate: {
                $lt: current
            },
            rating: {$exists: false}
        }).sort({ checkoutDate: -1});
        // For recalculate rating score
        calRating(userId, hotelId);

        // Check that the appointment already happened
        if (!appointment) {
            return res.status(400).json({
                success: false,
                message: "No completed appointment found for this hotel"
            })
        }

        appointment.rating = rating;
        appointment.comment = comment;
        await appointment.save();
        
        const newCount = hotel.ratingCount + 1;
        const newAverage = (hotel.rating * hotel.ratingCount + rating) / newCount;

        hotel.ratingCount = newCount;
        hotel.rating = newAverage;
        await hotel.save();

        res.status(200).json({
            success: true,
            data: hotel
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
}