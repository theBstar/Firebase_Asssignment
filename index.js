const express           = require("express");
const app               = express();
const bodyParser        = require("body-parser");
const mailer            = require("./app/mailer");
const dbHandler         = require("./app/dbHandler");
const PORT              = process.env.PORT || 3000;





//setting up the render engine
app.set("view engine", "ejs");
// setting the static resources directory
app.use(express.static(__dirname + "/public"));
// using the bodyParser middleware to parse the req object
app.use(bodyParser.urlencoded({ extended: false }));




app.route( "/" )
    .get( function( req, res ) {
        const afterPost= false;
        const success = false;
        res.render("index", {afterPost, success});
    })
    .post( function( req, res ) {
        const afterPost= true;
        let success = false;
        
        const user = {
            name: req.body.name,
            emailId: req.body.emailId
        };
        
        dbHandler(user)
            .then(( user )=>{
                mailer( user )
                .then(()=>{
                    console.log('Email sent to '+ user.emailId );
                    success = true;
                    res.render("index", {afterPost, success});
                })
                .catch((err)=>{
                    success = false;
                    console.log(err);
                    res.render("index", {afterPost, success});
                })
            })
            .catch((err)=>{
                success = false;
                console.log(err);
                res.render("index", {afterPost, success});
            });
    });
    

    


app.listen(PORT, function() {
    console.log("the server is running");
})