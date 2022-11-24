const express = require("express");


const routes = express.Router();


// routes.get("/",(req,res)=>{
//     res.render("index");
// })

routes.get("/",(req,res)=>{
    res.sendFile("index.html", {root: "./src"});
})

routes.get("/json",(req,res)=>{
    res.sendFile("/json/index.html", {root: "./src"});
})

// routes.get("/login",(req,res)=>{
//     res.sendFile("login.html", {root: "./public"});
// })

module.exports = routes;