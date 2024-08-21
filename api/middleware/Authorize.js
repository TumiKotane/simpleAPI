const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {
    try {
        const token = req.headers.cookie.split('=')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no JWT token" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message});
        console.log("Unauthorized, please log in", err.message);
    }
};

module.exports = authorize