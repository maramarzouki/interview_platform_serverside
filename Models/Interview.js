const mongoose = require('mongoose')

const interview_model = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    start_hour:{
        type:Date,
        required:true
    }
})