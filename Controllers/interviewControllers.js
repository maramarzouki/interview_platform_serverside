const Interview = require('../Models/Interview');
const Recruiter = require('../Models/Recruiter');
const { email_candidate } = require('./nodemail');
const dayjs = require('dayjs');

exports.add_interview = async (req,res) =>{
    try{
        const {title,candidate_email,date,start_hour,end_hour,recruiter} = req.body;
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        forpath="";
        for(let i=0;i<30;i++){
            forpath+=chars[Math.floor(Math.random()*chars.length)];
        }
        const link_title = title.replace(/ /g,"-");
        const interview_link=`http://localhost:3001/${link_title}/${forpath}`;
        const day=dayjs(date).format('MM/DD/YYYY');
        const data = {title,candidate_email,date:day,start_hour,end_hour,link:interview_link,recruiter}
        const new_interview = await Interview.create(data);
        res.status(200).send(new_interview);
    }catch(err){
        res.status(500).send({message:err.message});
    }
}

exports.notify_candidate= async (req,res)=>{
    try{
        await Recruiter.findOne({_id:req.params.recruiterID})
        .populate('company')
        .then(async (interviewer)=>{
            rec_name=interviewer.first_name+" "+interviewer.last_name;
            company_name=interviewer.company.company_name;
            await Interview.findOne({link:req.body.link})
            .then((interview)=>{
                interview_link=interview.link;
                candidate_email=interview.candidate_email;
                interview_date=interview.date;
                interview_hour=interview.start_hour;
            })
        })
        email_candidate(interview_link,candidate_email,rec_name,company_name,interview_date,interview_hour);
    }catch(err){}
}

exports.get_interview_details = async (req,res) => {
    try{
        const interview = await Interview.findById({_id:req.params.interviewID})
        res.status(200).send(interview);
        // console.log(interview);
    }catch(err){
        res.status(500).send({err:err.message})
    }
}

exports.get_interviews = async (req,res) => {
    try{
        await Interview.find({recruiter:req.params.recruiterID})
        .then((interviews)=>{
            res.status(200).send(interviews);
        })
    }catch(err){
        res.status(500).send({err:err.message});
    }
}

exports.get_today_interviews = async (req,res) => {
    try {
        const date = new Date();
        let day = String(date.getDate());
        day=day.length==1?"0"+day:day
        let month = String(date.getMonth() + 1);
        month=month.length==1?"0"+month:month

        let year = date.getFullYear();
        let currentDate = `${day}/${month}/${year}`;
        
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let today = weekday[date.getDay()];

        let interviews=await Interview.find({recruiter:req.params.recruiterID, date:currentDate})
        if(interviews.length!=0){
            let dInterviews=interviews.map(el=>{
                return {title:el.title,weekday:today,date:el.date,start_hour:el.start_hour,end_hour:el.end_hour}
            })
            res.status(200).send(dInterviews);
        }else{
            res.status(404).send("No interviews for today!")
        }
        interviews.forEach
    } catch (err) {
        res.status(500).json({err:err.message});
    }
}

// 

exports.delete_interview = async (req,res) => {
    try {
        const interview = await Interview.findById({_id:req.params.interviewID});
        interview.remove();
        res.status(200).send("Interview is deleted!")
    } catch (error) {
        res.status(500).send({err:error.message})
    }
}

