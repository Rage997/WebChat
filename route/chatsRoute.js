const  express  = require("express");
const  dbconnect  = require("../mongoConnect");
const  DBChat  = require("../models/ChatSchema");

const  router  =  express.Router();

router.route("/").get( (req, res)=>{
    console.log("Retrieving chat history")
    res.setHeader("Content-Type", "application/json");
    res.status = 200;
    // retrieve chat history
    dbconnect.then(db => {
        DBChat.find({}).then( chat => {
            res.json(chat);
        })
        
    })
})

module.exports = router