const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "maramyoona123@gmail.com", // generated ethereal user
      pass: "vxnnpvgckcubuiza", // generated ethereal password
    },
  });

module.exports.sendVerificationEmail = (email,activationCode) => {
    transporter.sendMail({
        from: 'hackup.io', // sender address
        to: email,// list of receivers
        subject: "Confirmation Email", // Subject line
        text: "Click the following button to confirm your email!", // plain text body
        html: `<button><a href=http://localhost:3000/confirm/${activationCode} /> click me</button>`, // html body
      }, (err,info) => {
        if(err){
            console.log(err)
        }else{
            console.log("email sent", info.response)
        }
      });
}