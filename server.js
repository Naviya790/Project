const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/home", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/project", (req, res) => res.render("project"));
app.get("/gallery", (req, res) => res.render("gallery"));

app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  await newUser.save();
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    res.redirect("/home");
  } else {
    res.send("Invalid credentials. Please try again!");
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
