const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

function adminAuth(req, res, next) {
    const token = req.headers.token;
    const response = jwt.verify(token, JWT_SECRET_ADMIN);
    if (response) {
        req.userId = response.userId;
        next();
    } else {
        res.json({
            msg: "Invalid token"
        })
    }
};

module.exports = {
    adminAuth
}
