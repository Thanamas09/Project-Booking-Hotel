const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the name'],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"]
    },
    address: {
        type: String,
        required: [true, 'Please add the address']
    },
    district: {
        type: String,
        required: [true, 'Please add the district']
    },
    province: {
        type: String,
        required: [true, 'Please add the province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add the postal code'],
        maxlength: [5, "Postal code can not be more than 5 characters"]
    },
    tel: {
        type: String,
    },
    region: {
        type: String,
        required: [true, 'Please add the region']
    }, 
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }, 
    ratingCount: {
        type: Number,
        default: 0
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals

hotelSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "hotel",
    justOne: false
});

module.exports = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);