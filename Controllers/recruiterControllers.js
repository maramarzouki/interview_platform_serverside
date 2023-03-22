const Recruiter = require('../Models/Recruiter');
const jwt = require('jsonwebtoken');
const prv_key="njenbenvejzjfnzo";
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { sendVerificationEmail, sendResetPasswordEmail } = require('../Controllers/nodemail');
const { findOne } = require('../Models/Recruiter');
const axios = require("axios").default;
const secret_key = ""

const create_token = (_id) => {
    return jwt.sign({_id},prv_key);
}

exports.add_recruiter = async (req,res) => {
    const {first_name,last_name,email,password} = req.body;

    try{
        // console.log(req.body);
        const newRec = await Recruiter.create_account(first_name,last_name,email,password)
        const token = create_token(newRec._id);
        sendVerificationEmail(email,newRec.activationCode);
        console.log(newRec);
        res.status(200).json({token,new:true,msg:"A verification mail has been sent to your email, please verify your email to login!",newRec});
    }catch(err){
        res.status(400).send({err:err.message})
    }
}

// exports.add_recruiter = async (req,res) => {
//     //const {first_name,last_name,email,password,company:{name,size,country,domain}} = req.body;

//     try{
//         const recaptchaValue = req.body.recaptcha_value
//         axios({
//             url:`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recaptchaValue}`,
//             method:'POST'
//         }).then(async ({data})=>{
//             console.log(data);

//             if(data.success){
//                 const newRec = await Recruiter.create_account(req.body)
//                 const token = create_token(newRec._id);
//                 res.status(200).json({token,new:true});
//             }else{
//                 res.status(400).send("Recaptcha verification failed")
//             }
//         }).catch(err=>{
//             res.status(400).send(err)
//         })
//     }catch(err){
//         res.status(400).send({err:err.message})
//     }
// }

exports.login_recruiter = async (req,res) => {
    const {email,password} = req.body;

    try{
        const user = await Recruiter.login(email,password);
        const token = create_token(user._id);

        res.status(200).send({token, new:false})
    }catch(err){
        res.status(400).send({err:err.message});
    }
}

exports.verify_recru = async (req,res) => {
    await Recruiter.findOne({activationCode:req.params.activationCode}).
    then(user=>{
        if(!user){
            res.status(400).send("activation code not found")
        }
        user.isActive=true;
        user.save();
        res.status(200).send("success!")
    }).catch(err=>{
        res.status(400).send(err)
    })
}
exports.get_recruiter_info = async (req,res) => {
    await Recruiter.findById({_id:req.params.recruiterID})
    .then((recruiter) => {
         res.status(200).send(recruiter);
    }).catch(err=>{
        res.status(400).send({err:err.message});
    })
 }

exports.get_all_recruiters = async (req,res) => {
    await Recruiter.find({})
    .then(recu_list => {
        res.status(200).send(recu_list)
    }).catch(err=>{
        res.status(400).send('ERROR:',err)
    })
}

exports.update_recru = async (req, res) => {
    const updates = req.body;
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt);
        req.body.password=hash;
        await Recruiter.updateOne({_id:req.params.recruiterID},{$set:updates})
        .then(result=>{
            res.status(200).send(result)
        }).catch(err=>{
            res.status(200).send(err)
        })
    }else{
        await Recruiter.updateOne({_id:req.params.recruiterID},{$set:updates}).
        then(result => {
            res.status(200).send(result)
        }).catch(err=>{
           res.status(200).send(err)
        })
    }
}

exports.delete_recru = (req,res) => {
    Recruiter.findById({_id:req.params.recruiterID}).
    then(recruiter=>{
        recruiter.remove();
        res.status(200).send('account deleted!')
    }).catch(err=>{
        res.status(400).send('ERROR:',err);
    })
}
 
exports.forgot_passowrd = async (req,res) => {
    const { email } = req.body;
        const user = await Recruiter.findOne({email});
        if(!user) {
            throw Error ("user doesn't exist");
        }
        //const token = jwt.sign({email: user.email, id:user._id}, prv_key, {expiresIn: "5m"})
        const userID = user._id;
        sendResetPasswordEmail(email,userID);
}

// exports.reset_password = async (req,res) => {
//     const {userID, token} = req.params
//     const user = await Recruiter.findById({_id:userID})
//     const link = `http://localhost:3001/resetpassword/${userID}/${token}`
//     try{
//         let transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           auth: {
//             user: "maramyoona123@gmail.com", // generated ethereal user
//             pass: "vxnnpvgckcubuiza", // generated ethereal password
//           },
//         });

//     transporter.sendMail({
//         from: 'hackup.io', // sender address
//         to: user.email,// list of receivers
//         subject: "Reset Password", // Subject line
//         text: "Reset your password by clicking the following button!", // plain text body
//         html: `<button><a href=${link}/> click me</button>`, // html body
//       }, (err,info) => {
//         if(err){
//             console.log(err)
//         }else{
//             console.log("email sent", info.response)
//         }
//       });

//     }catch(err){
//         res.status(400).send(err.message)
//     }
// }

// exports.reset_password_request = (req, res) => {
// }

exports.resetPASSWORD = async (req,res) => {
    try{
        // const input =req.body;
        // const {userID, token} = req.params
        const user = await Recruiter.findOne({_id: req.params.userID})
        if(!user){
            throw Error("User is not found")
        }
        console.log(user);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt)
        console.log(hash);
        await Recruiter.updateOne({_id: req.params.userID},{$set:{password:hash}}).
        then(result=>{
            res.status(200).send(result);
        }).catch(err=>{
            res.status(400).send(err)
        })
    }catch(err){}
}

