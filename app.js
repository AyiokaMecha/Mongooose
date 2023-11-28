//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import { stringify } from "querystring";
import encrypt from "mongoose-encryption";
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb:localhost:27017/userDB", { useNewUrlParser: true });

//defining a schema for the user object to be fed into the database
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
//a long string to be used for encryption
const secret = "ajlkjaljdfkjalkdjflakdflkajdlkjflajslfdjalsdjkfasf";

userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})





const User = new mongoose.model("User", userSchema);
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ email: username }, function (err,foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets.ejs");
        }
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let userName = req.body.username;
  let password = req.body.password;
  const newUser = new User({
    email: userName,
    password: password,
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets.ejs");
    }
  });
});

app.listen(3000, function () {
  console.log("Server Started at port 3000");
});
