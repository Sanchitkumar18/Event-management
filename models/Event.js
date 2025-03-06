const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    tier: {
        type: String,
        enum: ['Regular', 'VIP', 'Premium'],
        required: true,
        default: 'Regular'
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    available_quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 100
    }
});

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String,
    event_type: {
        type: String,
        enum: ['public', 'private']
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    tickets: {
        type: [TicketSchema],
        default: [{ tier: 'Regular', price: 0, available_quantity: 100 }] 
    }
});

module.exports = mongoose.model('Event', EventSchema);
