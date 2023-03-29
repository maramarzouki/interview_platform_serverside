const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "hackup.pi@gmail.com", // generated ethereal user
      pass: "bfuztmrgrbxlfilq ", // generated ethereal password
    },
  });

  try{
    module.exports.sendVerificationEmail = (email,activationCode,username) => {
      const link = `http://localhost:3000/confirm/${activationCode}`
        transporter.sendMail({
            from: 'hackup.io', // sender address
            to: email,// list of receivers
            subject: "Confirmation Email", // Subject line
            //text: "Click the following button to confirm your email!", // plain text body
            html: `
            Hello, ${username}
            <br/><br/>
            You registered an account on platform,
            before being able to use your account you need to verify that this is your email address by clicking here: <a href=${link}>${link}</a>
            <br/><br/>
            Kind Regards, HackUp`, // html body
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
          html: `
          Trouble signing in?
          <br/><br/>
          Resetting your password is easy.
          <br/><br/>
          Just click on this <a href=${link}>link</a> and follow the instructions.We’ll have you up and running in no time.
          <br/>
          <br/> If you did not make this request then please ignore this email.
          `, // html body
        }, (err,info) => {
          if(err){
              console.log(err) 
          }else{
              console.log("email sent", info.response)
          }
        }); 
  }}catch{}