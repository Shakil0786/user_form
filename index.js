const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { log } = require("console");
const app = express();
app.use(express.static("public"));
dotenv.config();
const port = process.env.port || 3000;

// Replace the following line with your MongoDB connection URL
const mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@sankhla1.ghbtj5b.mongodb.net/registartionDB`;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Handle MongoDB connection error
mongoose.connection.on("error", (error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Handle MongoDB connection success
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
});

//registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

//module of registration schema
const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });

        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});