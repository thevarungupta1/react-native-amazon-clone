// import packages
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("./models/user");

// initiliaze express app
const app = express();
app.use(express.json());
app.use(cors());

/***
 * MongoDb Connection
 */
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

/***
 * Send Verification email link logic
 */
const sendVerificationEmail = async (email, verificationToken) => {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransporter({
        // configure the email service or SMTP details
        service: "gmail",
        auth: {
            user: "varungupta2809@gmail.com",
            pass: "XXXXXX",
        },
    });

    // compose the email message
    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
    };

    // send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email send successfully");
    } catch (err) {
        console.log("Error sending verification email: " + err);
    }
};

/**
 * Register a new user
 */
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered: ", email);
            return res.status(400).json({
                error: true,
                message: "email already registerd",
            });
        }

        // create a new user
        const newUser = new User({ name, email, password });

        // generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        // save the user to the database
        await newUser.save();

        console.log("new user registered: ", newUser);

        // sending verification email to the server
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            error: false,
            message:
                "registeration successful, Please check your email for verification",
        });
    } catch (err) {
        console.log("Error registering user: " + err);
        res.status(500).json({
            error: true,
            message: "registeration failed",
        });
    }
});

/**
 * verify the email
 */
app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        // find the user with the given verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'invalid verification token'
            })
        }

        // mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();
        res.status(200).json({
            error: false,
            message: 'email verified successfully'
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "email verification failed",
        });
    }
});

/***
 * Login user
 */
app.post("/login", async (req, res) => {
    try {
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

        // generate a token
        const secretKey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({ userId: user._id }, secretKey)
        res.status(200).json({
            error: false,
            token: token
        })
    }
    catch (error) {
        res.status(500).json({
            error: false,
            message: 'login failed'
        })
    }
});

// setup server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
