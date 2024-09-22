const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const { auth } = require('../middleware');
const Course = require('../models/course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signin", async (req, res) => {
    let { email, password } = req.body;
    let user = await Admin.findOne({
        email
    });
    if (user) {
        let foundUser = await bcrypt.compare(password, user.password);
        if (foundUser) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);
            res.json({
                msg: "You are successfully signed-in",
                token
            });
        } else {
            res.json({
                msg: "Incorrect password"
            })
        }
    } else {
        res.json({
            msg: "E-mail incorrect"
        })
    }
});

router.post("/signup", async (req, res) => {
    let { firstName, lastName, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 5);
    const user = await Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);
    res.json({
        msg: "You are signed-up",
        token
    })
});

router.post("/course", auth, async (req, res) => {
    let admin = await Admin.findById(req.userId);
    if (admin) {
        let { title, description, price, image } = req.body;
        const course = await Course.create({
            title,
            description,
            price,
            image,
            creatorId: req.userId
        });
        res.json({
            msg: "New course has been added",
            course
        })
    } else {
        res.json({
            msg: "You don't have access"
        })
    }
})

router.get("/course", auth, async (req, res) => {
    const allCourses = await Course.find();
    res.json({
        allCourses
    });
});

module.exports = router