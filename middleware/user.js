const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET_USER = process.env.JWT_SECRET_USER;

function userAuth(req, res, next) {
    const token = req.headers.token;
    const response = jwt.verify(token, JWT_SECRET_USER);
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
    userAuth
}