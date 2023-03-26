const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "hackup.ip@gmail.com", // generated ethereal user
      pass: "ihyggjfsohponfgs", // generated ethereal password
    },
  });

  try{
module.exports.sendVerificationEmail = (email,activationCode) => {
  const link = `http://localhost:3000/confirm/${activationCode}`
    transporter.sendMail({
        from: 'hackup.io', // sender address
        to: email,// list of receivers
        subject: "Confirmation Email", // Subject line
        text: "Click the following button to confirm your email!", // plain text body
        html: `<button><a href=${link}/> click me</button>`, // html body
      }, (err,info) => {
        if(err){
            console.log(err)
        }else{
            console.log("email sent", info.response)
        }
      }); 
}}catch{}

try{
  module.exports.sendResetPasswordEmail = (email,userID) => {
    const link = `http://localhost:3000/resetpassword/${userID}`
      transporter.sendMail({
          from: 'hackup.io', // sender address
          to: email,// list of receivers
          subject: "Reset Password", // Subject line
          text: "Click the following button to reset your password!", // plain text body
          html: `<button><a href=${link}/> click me</button>`, // html body
        }, (err,info) => {
          if(err){
              console.log(err)
          }else{
              console.log("email sent", info.response)
          }
        }); 
  }}catch{}