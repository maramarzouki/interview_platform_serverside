const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

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
    isActive:{
        type:Boolean,
        default:false
    },
    activationCode:{
        type:String,
    },
    disabled:{
        type:Boolean,
        default:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'
        // default:mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
    }
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

recruiter_schema.statics.create_account = async function (first_name,last_name,email,password,activationCode) {

    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    activationCode="";
    for(let i=0;i<25;i++){
        activationCode+=chars[Math.floor(Math.random()*chars.length)];
    }
    const user = await this.findOne({email});
    if(user){
        throw Error('This user already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    
    const recruiter = this.create({first_name,last_name,email,password:hash,activationCode});
    console.log(activationCode);
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
        throw Error("Please check your email inbox to verify your email!")
    }
    return user;
}

const recruiterModel = mongoose.model('Recruiters',recruiter_schema);
module.exports = recruiterModel;