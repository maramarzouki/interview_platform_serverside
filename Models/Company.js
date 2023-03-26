const mongoose = require('mongoose');

const company_schema = mongoose.Schema({
    company_name:{
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
        ref:'Recruiters',
        // default:mongoose.Types.ObjectId('507f1f77bcf86cd799439022')
    }
})

const companyModel = mongoose.model('Company',company_schema);
module.exports = companyModel;