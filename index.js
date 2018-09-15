const express           = require("express");
const app               = express();
const bodyParser        = require("body-parser");
const admin             = require("firebase-admin");
const serviceAccount    = require("./fir-project-f7eae-firebase-adminsdk-uzbps-ede111a35c.json");
const PORT              = process.env.PORT;
const IP                = process.env.IP;

// initializing the admin sdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-f7eae.firebaseio.com"
});
//creating the database instance
const db = admin.database();
// creating a ref to users

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
        //creating the ref point in the real time database
        const users = db.ref("users");
        const usersInformation = db.ref("usersInformation");
        // inserting the user into the usernode
        users.push({
            name: req.body.name,
            emailId: req.body.emailId
        });
        
        //listening to the changes on the users node
        users.once("child_added", function( snapshot ) {
            const data = snapshot.val();
            usersInformation.push({
                name: data.name,
                emailId: data.emailId
            });
            
        })
        res.redirect("/");
    })


app.listen(PORT, IP, function() {
    console.log("the server is running");
})