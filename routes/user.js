const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { auth } = require('../middleware');
const Purchase = require('../models/purchase');
const { z } = require('zod');

router.use(express.json());

router.post("/signin", async (req, res) => {
    let requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(10)
    });
    let response = requiredBody.safeParse(req.body);
    if (!response.success) {
        res.json({
            msg: response.error.issues[0].message
        });
        return;
    }
    let { email, password } = req.body;
    let user = await User.findOne({
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
    const user = await User.create({
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

router.get("/purchases", auth, async (req, res) => {
    const purchases = await Purchase.find({
        userId: req.userId
    });
    res.json({
        msg: "Your purchased courses",
        purchases
    })
});

module.exports = router;
