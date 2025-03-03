const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const checkRole = (role) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (user.role !== role) {
                return res.status(403).json({ error: "Access Denied" });
            }
            next();
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
};

module.exports = checkRole;
