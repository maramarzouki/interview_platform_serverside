const Recruiter = require('../Models/Recruiter');
const Company = require('../Models/Company')
const jwt = require('jsonwebtoken');
const prv_key="njenbenvejzjfnzo";
const bcrypt = require("bcrypt");
const { sendVerificationEmail, sendResetPasswordEmail } = require('../Controllers/nodemail');


const create_token = (_id) => {
    return jwt.sign({_id},prv_key);
}

exports.add_recruiter = async (req,res) => {
    const {first_name,last_name,email,password,company_name,country,domain,size} = req.body;
    try{
        await Company.findOne({company_name:req.body.company_name}).then(async company=>{
            if(company){
                res.status(500).send({err:"This company already exists!"})
            }else{
                const newRec = await Recruiter.create_account(first_name,last_name,email,password)
                const token = create_token(newRec._id);
                const newCompany = new Company({company_name,country,domain,size});
                newCompany.recruiter=newRec._id;
                newRec.company=newCompany._id;
                newRec.save();
                newCompany.save();
                sendVerificationEmail(email,newRec.activationCode,newRec.first_name);
                res.status(200).json({token,msg:"A verification mail has been sent to your email, please verify your email to login!",newRec,newCompany});
            }
        })
    }catch(err){
        res.status(400).send({err:err.message})
    }
}


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
        res.status(400).send(err)
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
        Company.findOne({recruiter:req.params.recruiterID})
        .then(company=>{
            company.remove();
            recruiter.remove();
            res.status(200).send('account deleted!')
        })
    }).catch(err=>{
        res.status(400).send(err);
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

