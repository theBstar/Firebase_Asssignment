const nodemailer        = require("nodemailer");


const SECRET            = {
            emailId: "yourEmail@xyz.com", //replace by your own email id
            password: "YourOwnPassword" // replace by your password
};

// creating the mail transporter

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SECRET.emailId,
    pass: SECRET.password
  }
});

function mailer( user ) {
    return new Promise((resolve, reject)=>{
      const mailOptions = {
          from: SECRET.emailId,
          to: user.emailId,
          subject: 'Welcome',
          text: `Dear ${user.name}, Welcome to our app`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            reject(new Error("Email could not be sent"));
          } else {
              resolve();
          }
        });  
    });
}

//I couldn't figure out why import and export are not working
//I would appreciate your input
module.exports = mailer;
