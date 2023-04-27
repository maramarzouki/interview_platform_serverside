const mongoose = require('mongoose');

const company_schema = mongoose.Schema({
    company_name:{
        type:String,
        required:true,
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
    }
})

company_schema.statics.create_company = async function (company_name,country,domain,size) {
    const c = await this.findOne({company_name});
    if (c){
        throw Error("This company already exists!");
    }
    const company = this.create({company_name,country,domain,size});
    return company;
}

const companyModel = mongoose.model('Company',company_schema);
module.exports = companyModel;      