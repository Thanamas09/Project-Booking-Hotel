const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    checkinDate: {
        type: Date,
        required: true
    },
    checkoutDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, "Comment can not be more than 500 characters"],
        default: ""
    },
    isRated: {
        type: Boolean,
        default: false
    },
    ratedAt: {
        type: Date,
        default: null
    }
});

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
