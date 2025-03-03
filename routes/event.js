const express = require('express');
const router = express.Router();
const fetchusers = require('../middleware/fetchusers');
const checkRole = require('../middleware/checkRole');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

// 🔹 Route 1: Create an event (Only Organizer)
router.post('/create', fetchusers, checkRole('organizer'), [
    body('title', 'Title is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('date', 'Valid date is required').isISO8601(),
    body('location', 'Location is required').notEmpty(),
    body('eventType', 'Event type (public/private) is required').isIn(['public', 'private']),
], async (req, res) => {
    try {
        const { title, description, date, location, eventType } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const event = new Event({
            title, description, date, location, eventType,
            organizer: req.user.id // Only organizers can create events
        });
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🔹 Route 2: Get all public events & user's private events
router.get('/fetchall', fetchusers, async (req, res) => {
    try {
        let events;
        
        if (req.user.role === 'organizer' || req.user.role === 'attendee') {
            // Organizers can see all events (public & private)
            events = await Event.find();
        }
         else {
            // Normal users can only see public events
            events = await Event.find({ eventType: 'public' });
        }

        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 🔹 Route 3: Update event (Only Organizer)
router.put('/update/:id', fetchusers, checkRole('organizer'), async (req, res) => {
    const { title, description, date, location, eventType } = req.body;
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        event = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🔹 Route 4: Delete event (Only Organizer)
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
