const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
    const token = req.headers.token;
    const response = jwt.verify(token, JWT_SECRET);
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
    auth
};