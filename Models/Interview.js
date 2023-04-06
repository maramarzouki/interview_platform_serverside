const mongoose = require('mongoose');

var validate_email = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const interview_schema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    candidate_email:{
        type:String,
        required:true,
        validate:[validate_email,'Invalid Email!']
    },
    date:{
        type:String,
        required:true
    },
    start_hour:{
        type:String,
        required:true
    },
    end_hour:{
        type:String,
    },
    link:{
        type:String,
        required:true
    },
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recruiters',
        required:true
    }
})

const interviewModel = mongoose.model('Interviews',interview_schema);
module.exports=interviewModel;