const Company = require('../Models/Company');

// exports.add_company = async (req,res) => {
//     const {company_name,country,size,domain} = req.body
//     await Company.findOne({name:req.body.name}).
//     then(company=>{
//         if(company){
//             res.status(400).send("This company alread exists")
//         }
//         const new_company=new Company({name:company_name,country,size,domain});
//         new_company.save();
//         console.log(new_company);
//         res.status(200).send({msg:"company saved",new_company})
//     }).catch(err => {
//         res.status(500).send(err);
//     }) 
// }

exports.get_company = async(req,res) => {
    try{
        await Company.findOne({recruiter:req.params.recruiterID})
        .then(company=>{
            if(!company){
                res.status(500).send("Company not found")
            }
            res.status(200).send(company);
        })
    }catch(err){
        res.status(500).send({err:err.message})
    }
}

exports.get_all_companies = async (req,res) => {
    try{
        await Company.find({}).then(companies=>{
            if(!companies){
                res.status(404).send("No company found!")
            }
            res.status(200).send(companies);
        }).catch(err=>{
            res.status(500).send(err);  
        })
    }catch{
        res.status(500).send({err:err.message})
    }
}

exports.update_company = async (req,res) => {
    try{
        await Company.find({recruiter:req.params.recruiterID},{$set:updates}).then(companies=>{
            if(!companies){
                res.status(404).send("No company found!")
            }
            res.status(200).send(companies);
        })
    }catch(err){
        res.status(500).send({err:err.message})
    }
}

// exports.delete_company = async (req,res) => {
//     await Company.findOne({name:req.body.name}).
//     then(company=>{
//         if(!company){
//             res.status(404).send("This company doesn't exist")
//         }
//         company.remove();
//         res.status(200).send("Company removed")
//     }).catch(err=>{
//         res.status(500).send(err); 
//     })
// }