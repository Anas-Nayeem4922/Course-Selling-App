const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const adminRoute = require('./routes/admin');

const dbUrl = process.env.dbUrl;

main()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.use(express.json());

app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/admin", adminRoute);


app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});