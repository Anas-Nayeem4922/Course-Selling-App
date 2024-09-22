const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Purchase = require('../models/purchase');
const { auth } = require('../middleware');

router.get("/", async (req, res) => {
    const allCourses = await Course.find();
    res.json({
        allCourses
    });
});

router.post("/purchase/:courseId", auth, async (req, res) => {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (course) {
        await Purchase.create({
            userId: req.userId,
            courseId
        });
        res.json({
            msg: "Congratulations, Your course has been purchased successfully"
        })
    } else {
        res.json({
            msg: "Course doesn't exist"
        })
    }
});

module.exports = router;
