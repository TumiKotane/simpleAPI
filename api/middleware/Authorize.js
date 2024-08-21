const User = require('../models/user'); //importing the user model
const jwt = require('jsonwebtoken'); //importing jsonwebtoken

const authorize = async (req, res, next) => {
    try {
        const token = req.headers.cookie.split('=')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no JWT token" }) // if no token, return unauthorized
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        const user = await User.findById(decoded.userId).select("-password"); 
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message});
        console.log("Unauthorized, please log in", err.message);} // log the error message}
};

module.exports = authorize