const Company = require('../Models/Company');

exports.add_company = async (req,res) => {
    await Company.findOne({name:req.body.name}).
    then(company=>{
        if(company){
            res.status(400).send("This company alread exists")
        }
        const new_company=new Company(req.body);
        new_company.save();
        res.status(200).send({msg:"company saved",new_company})
    }).catch(err => {
        res.status(500).send(err);
    }) 
}

exports.get_all_companies = async (req,res) => {
    await Company.find({}).then(companies=>{
        if(!companies){
            res.status(404).send("No company found!")
        }
        res.status(200).send(companies);
    }).catch(err=>{
        res.status(500).send(err);  
    })
}

exports.update_company = async (req,res) => {
    const updates = req.body;
    await Company.updateOne({recruiter:req.params.recruiterID},{$set:updates})
    .then(() => res.status(200).send("Company has been successfully updated!"))
    .catch(err=>{res.status(500).send(err)})
}

exports.delete_company = async (req,res) => {
    await Company.findOne({name:req.body.name}).
    then(company=>{
        if(!company){
            res.status(404).send("This company doesn't exist")
        }
        company.remove();
        res.status(200).send("Company removed")
    }).catch(err=>{
        res.status(500).send(err); 
    })
}