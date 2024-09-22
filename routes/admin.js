const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const { adminAuth } = require('../middleware/admin');
const Course = require('../models/course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_ADMIN;
const { z } = require('zod');

router.use(express.json());

router.post("/signin", async (req, res) => {
    let requiredBody = z.object({
        email: z.string().email(),
        password: z.string().max(10)
    });
    let response = requiredBody.safeParse(req.body);
    if (!response.success) {
        res.json({
            msg: response.error.issues[0].message
        });
        return;
    }
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
    const requiredBody = z.object({
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(3).max(10)
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
        res.json({
            msg: error.issues[0].message
        });
        return;
    }
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

router.post("/course", adminAuth, async (req, res) => {
    let admin = await Admin.findById(req.userId);
    if (admin) {
        let requiredBody = z.object({
            title: z.string().min(3).max(20),
            description: z.string().min(5),
            price: z.number().min(0),
            image: z.string().url()
        });
        const { success, error } = requiredBody.safeParse(req.body);
        if (!success) {
            res.json({
                msg: error.issues[0].message
            })
        }
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

router.get("/course", adminAuth, async (req, res) => {
    const allCourses = await Course.find();
    res.json({
        allCourses
    });
});

module.exports = router