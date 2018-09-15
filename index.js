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
        res.render("index");
    })
    .post( function( req, res ) {
        let status = {
            afterPost: true,
            success: undefined
        }
        
        const user = {
            name: req.body.name,
            emailId: req.body.emailId
        };
        dbHandler(user)
            .then(( user )=>{
                mailer( user )
                .then(()=>{
                    console.log('Email sent to '+ user.emailId );
                    status.success = true;
                })
                .catch((err)=>{
                    status.success = false;
                    console.log(err);
                })
            })
            .catch((err)=>{
                status.success = false;
                console.log(err);
            })
        
        res.render("index", {status});
    });
    

    


app.listen(PORT, function() {
    console.log("the server is running");
})