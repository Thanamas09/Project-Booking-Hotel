const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        dbName: "hotelBooking",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;