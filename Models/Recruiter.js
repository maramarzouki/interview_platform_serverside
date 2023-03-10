const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../Controllers/nodemail');

var validate_email = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const recruiter_schema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:[validate_email,'Invalid Email!']
    },
    password:{
        type:String,
        required:true,
        minLength:8,
    },
    company_name:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
    },
    size:{
        type:Number,
        required:true
    },
    sector:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    activationCode: String 
})

// recruiter_schema.statics.create_account = async function (data) {
//     const email = data.email;
//     const password = data.password

//     const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&éè'()_ç^@à[]={}+-*/";
//     let activationCode = "";
//     for(let i=0;i<25;i++){
//         activationCode+=chars[Math.floor(Math.random()*chars.length)];
//     }
//     const user = await this.findOne({email});
//     if(user){
//         throw Error('This user already exists');
//     }
    
//     const salt = await bcrypt.genSalt(10);
//     data.password = await bcrypt.hash(password,salt);
    
//     const recruiter = this.create(data);
//     return recruiter; 
// }

recruiter_schema.statics.create_account = async function (first_name,last_name,email,password,company_name,country,size,sector,activationCode) {

    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&éè'()_ç^@à[]={}+-*/";
    let activationCODE = "";
    for(let i=0;i<25;i++){
        activationCODE+=chars[Math.floor(Math.random()*chars.length)];
    }
    const user = await this.findOne({email});
    if(user){
        throw Error('This user already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    
    const recruiter = this.create({first_name,last_name,email,password:hash,company_name,country,size,sector,activationCode:activationCODE});
    sendVerificationEmail(email,activationCode);
    return recruiter; 
}

recruiter_schema.statics.login = async function(email,password){
    if(!email || !password){
        throw Error("Please enter your email and password!");
    }
    const user = await this.findOne({email});
    if(!user){
        throw Error('user not found!')
    }

    const match = await bcrypt.compare(password,user.password);
    if(!match){
        throw Error("Email or password not correct!");
    }

    if(user.email && match && !user.isActive){
        throw Error("Please check your email inboxe to verify your email!")
    }
}

const recruiterModel = mongoose.model('Recruiters',recruiter_schema);
module.exports = recruiterModel;