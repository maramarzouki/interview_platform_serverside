const mongoose = require('mongoose');

const company_schema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    country:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'recruiter'
    }
})

const companyModel = mongoose.model('company',company_schema);
module.exports = companyModel;