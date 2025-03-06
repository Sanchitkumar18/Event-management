const express = require('express');
const router = express.Router();
const fetchusers = require('../middleware/fetchusers');
const checkRole = require('../middleware/checkRole');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

const QRCode = require('qrcode');

// Route 5: Register for an event
router.post('/register/:eventId', fetchusers, checkRole('attendee'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Check if user is already registered
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ error: "Already registered" });
        }

        event.attendees.push(req.user.id);
        await event.save();

        // Generate QR Code
        const qrData = JSON.stringify({ eventId: event.id, userId: req.user.id });
        const qrCode = await QRCode.toDataURL(qrData);

        res.json({ message: "Registration successful", qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route 6: Scan QR code and mark attendance
router.post('/scan', fetchusers, checkRole('organizer'), async (req, res) => {
    try {
        const { qrData } = req.body; // QR Code content sent from scanner
        const { eventId, userId } = JSON.parse(qrData);

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if (!event.attendees.includes(userId)) {
            return res.status(400).json({ error: "User not registered for this event" });
        }

        if (event.attended.includes(userId)) {
            return res.status(400).json({ error: "Attendance already marked" });
        }

        event.attended.push(userId);
        await event.save();

        res.json({ message: "Attendance marked successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Invalid QR Code or Internal Server Error' });
    }
});


module.exports = router;