const admin             = require("firebase-admin");
//replace the **../fir-project-f7eae-firebase-adminsdk-uzbps-ede111a35c.json**
//by your own sdk keys address
const serviceAccount    = require("PUT HERE");



// initializing the admin sdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-f7eae.firebaseio.com"
});
//creating the database instance
const db = admin.database();


function dbHandler( user ) {
    return new Promise((resolve, reject)=> {
       //creating the ref point in the real time database
        const users = db.ref("users");
        const usersInformation = db.ref("usersInformation");
        // inserting the user into the usernode
        users.push({
            name: user.name,
            emailId: user.emailId
        }, function( err ) {
            if(err) {
                reject(new Error("Could not save the data to Users node"));
            }
        });
        
        //listening to the changes on the users node
        users.once("child_added", function( snapshot ) {
            const data = snapshot.val();
            // pushing the new user to userInformation node
            usersInformation.push({
                name: data.name,
                emailId: data.emailId
            }, function( err ){
                if( err ) {
                    reject(new Error("Could not save the data to userInformation node"));
                }
                resolve(data);
            });
        });
        
    });
}

module.exports = dbHandler;
