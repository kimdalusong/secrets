//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require('md5');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//Model
const User = mongoose.model("User", userSchema);

//Get
app.get("/", (req, res)=> {
    res.render("home");
});

app.get("/login", (req, res)=> {
    res.render("login");
})

app.get("/register", (req, res)=> {
    res.render("register");
})

//post
app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=>{
        if (err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    })
});

app.post("/login", (req, res)=> {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundItem)=>{
        if (err){
            console.log(err);
        } else {
            if (foundItem){
                if (foundItem.password === password){
                    res.render("secrets");
                } else {
                    res.send("Incorrect Email or Password");
                }
            }
        }
    })

});






app.listen(3000, function(){
    console.log("Server Started on port 3000");
});