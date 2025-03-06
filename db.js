require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

async function connectToMongo() {
    await mongoose.connect(mongoURI)
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch(err => console.log("MongoDB Connection Error:", err));
}

module.exports = connectToMongo;
