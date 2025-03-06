const express = require('express');
const router = express.Router();
const fetchusers = require('../middleware/fetchusers');
const checkRole = require('../middleware/checkRole');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

// Route 1: Create an event (Only Organizer)
router.post('/create', fetchusers, checkRole('organizer'), [
    body('title', 'Title is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('date', 'Valid date is required').isISO8601(),
    body('location', 'Location is required').notEmpty(),
    body('event_type', 'Event type (public/private) is required').isIn(['public', 'private']),
    body('tickets').optional().isArray().withMessage('Tickets must be an array'),
    body('tickets.*.tier').optional().isIn(['Regular', 'VIP']).withMessage('Invalid ticket tier'),
    body('tickets.*.price').optional().isNumeric().withMessage('Price must be a number'),
    body('tickets.*.available_quantity').optional().isInt({ min: 0 }).withMessage('Available quantity must be a non-negative integer')
], async (req, res) => {
    try {
        const { title, description, date, location, event_type, tickets = [] } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // If no tickets are provided, set default Regular ticket
        const finalTickets = Array.isArray(tickets) && tickets.length > 0
            ? tickets
            : [{ tier: 'Regular', price: 0, available_quantity: 100 }];

        const event = new Event({
            title,
            description,
            date,
            location,
            event_type,
            organizer: req.user.id,
            tickets: finalTickets
        });

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//  Route 2: Get all public events & user's private events
router.get('/fetchall', fetchusers, async (req, res) => {
    try {
        const { date, location, event_type, search } = req.query;
        let query = {};

        //  Filter by event type (public/private)
        if (event_type) {
            query.event_type = event_type;
        }

        //  Filter by date (ISO format expected)
        if (date) {
            query.date = { $gte: new Date(date) }; // Fetch events on or after the given date
        }

        //  Filter by location (Case-insensitive)
        if (location) {
            query.location = new RegExp(location, 'i'); // 'i' makes it case insensitive
        }

        //  Search by title or description (Case-insensitive)
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') }, // Matches title
                { description: new RegExp(search, 'i') } // Matches description
            ];
        }

        //  Restrict normal users to only public events
        if (req.user.role !== 'organizer' && req.user.role !== 'attendee') {
            query.event_type = 'public';
        }

        //  Fetch and return filtered events
        const events = await Event.find(query);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//  Route 3: Update event (Only Organizer)
router.put('/update/:id', fetchusers, checkRole('organizer'), [
    body('tickets').optional().isArray().withMessage('Tickets must be an array'),
    body('tickets.*.tier').optional().isIn(['Regular', 'VIP']).withMessage('Invalid ticket tier'),
    body('tickets.*.price').optional().isNumeric().withMessage('Price must be a number'),
    body('tickets.*.available_quantity').optional().isInt({ min: 0 }).withMessage('Available quantity must be a non-negative integer')
], async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Allow updating tickets
        const updatedData = { ...req.body };
        if (req.body.tickets && Array.isArray(req.body.tickets)) {
            updatedData.tickets = req.body.tickets;
        }

        event = await Event.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//  Route 4: Delete event (Only Organizer)
router.delete('/delete/:id', fetchusers, checkRole('organizer'), async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
