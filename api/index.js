// import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");

// initiliaze express app
const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect("mongodb://localhost:27017/ecommercedb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => {
        console.log(err);
    });

app.post("/register", async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({
        error: false,
        message: "user created successfully",
        data: user,
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "email in valid",
        });
    }

    // check if password is correct
    if (user.password !== password) {
        return res.status(404).json({
            error: true,
            message: "password invalid",
        });
    }

    res.status(200).json({
        error: false,
        message: "user login successfully",
        data: user,
    });
});

// setup server
app.listen(3000, () => {
    console.log("server is listening on port: 3000");
});
