const Admin = require('../Models/Admin')
const Recruiter = require('../Models/Recruiter')
const jwt = require('jsonwebtoken')
const prv_key = "fjegnflkzjhejgo"
const bcrypt = require('bcrypt')

const create_token = (_id) => {
    return jwt.sign({_id},prv_key);
}

exports.add_admin = async (req,res) => {
    const {first_name,last_name,email,password,address,phone} = req.body;

    try {
        const newAdmin = await Admin.create_account(first_name,last_name,email,password,address,phone);
        const token = create_token(newAdmin._id);
        res.status(200).send({token, new:true})
        console.log(newAdmin);
    }catch(err){
        res.status(400).send({err:err.message})
    }
}

exports.login_admin = async (req,res) =>{
    const {email,password} = req.body;

    try{
        const admin = await Admin.login(email,password)
        const token = create_token(admin._id);
        res.status(200).send({token,new:false});
    }catch(err){
        res.status(404).send({err:err.message});
    }
}

exports.get_admin_info = async (req,res) => {
    await Admin.findById({_id:req.params.adminID}).
    then(result=>{
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).send('Admin not found!')
        }
    }).catch(err=>{
        res.status(404).send(err);
    })
}

exports.get_all_admins = async (req,res) => {
    await Admin.find({}).then(admins_list=>{
        res.status(200).send(admins_list);
    }).catch(err=>{
        res.status(404).send({ERROR:err});
    })
}

exports.update_admin = async (req,res) => {
    const updates = req.body;
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt);
        req.body.password=hash;
        await Admin.updateOne({_id:req.params.adminID},{$set:updates})
        .then(result=>{
            res.status(200).send(result)
        }).catch(err=>{
            res.status(200).send(err)
        })
    }else{
        await Admin.updateOne({_id:req.params.adminID},{$set:updates}).
        then(result => { 
            res.status(200).send(result)
        }).catch(err=>{
           res.status(200).send(err)
        })
    }
}

exports.delete_admin = async (req,res) => {
    await Admin.findById({_id:req.params.adminID})
    .then(admin => {
        admin.remove();
        res.status(200).send('admin account deleted');
    }).catch(err=>{
        res.status(400).send(err);
    })
}
