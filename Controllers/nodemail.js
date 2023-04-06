const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "hackup.ip.99@gmail.com", // generated ethereal user
      pass: "gcckhrixbjtzfvyk", // generated ethereal password
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

  try{
    module.exports.email_candidate = (link,candidate_email,recruiter,company_name,date,hour) => {
        transporter.sendMail({
            from: 'hackup.io', // sender address
            to: candidate_email,// list of receivers
            subject: `Interview with ${company_name}`, // Subject line 
            html: `<div style="background-color: white; width: 100%;">
            <div style="width: 500px; margin-left: 25%; height: 415px; border-radius: 20px; background-color: rgb(249, 249, 249); box-shadow: rgba(0, 0, 0, 0.25) 0px 3px 8px;  padding-top: 70px;">
                <img style="margin-left: 33%;height: 142px;width: 180px;"  src="cid:unique@nodemailer.com"/>
                <h2 style="font-size: 20px; font-weight: 700; color: rgb(49, 49, 49); margin-top: 40px; text-align: center;">Interview Invitation!</h2>
                <p style="font-size: 14px; font-weight: 400; color: rgb(49, 49, 49); text-align: center; margin-top: 13px;">You have been invited to an interview, and here are the interview details:</p>
                <p style="font-size: 14px; font-weight: 400; color: rgb(49, 49, 49); text-align: center;">Date: ${date}</p>
                <p style="font-size: 14px; font-weight: 400; color: rgb(49, 49, 49); text-align: center;">Hour: ${hour}</p>
                <p style="font-size: 14px; font-weight: 400; color: rgb(49, 49, 49); text-align: center; text-transform:capitalize;">Interviewer: ${recruiter}</p>
                <p style="color: rgb(193, 0, 0); font-size: 12px; font-weight: 500; text-align: center;">Interview link:${link}</p>
            </div>
            </div>`, // html body
          }, (err,info) => {
            if(err){
                console.log(err) 
            }else{
                console.log("email sent", info.response)
            }
          }); 
    }}catch{}