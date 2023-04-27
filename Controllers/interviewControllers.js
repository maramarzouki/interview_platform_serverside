const Interview = require('../Models/Interview');
const Recruiter = require('../Models/Recruiter');
const { email_candidate } = require('./nodemail');
const dayjs = require('dayjs');

exports.add_interview = async (req,res) =>{
    try{
        const {title,candidate_email,date,start_hour,end_hour,recruiterID} = req.body;
        await Recruiter.findOne({_id:req.params.recruiterID}).then(async (recruiter)=>{
            if(recruiter){
                if(req.body.recruiter==req.params.recruiterID){
                    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    forpath="";
                    for(let i=0;i<30;i++){
                        forpath+=chars[Math.floor(Math.random()*chars.length)];
                    }
                    const link_title = title.replace(/ /g,"-");
                    const interview_link=`http://localhost:3001/${link_title}/${forpath}`;
                    const day=dayjs(date).format('DD/MM/YYYY');
                    const data = {title,candidate_email,date:day,start_hour,end_hour,link:interview_link,recruiter}
                    const new_interview = await Interview.create(data);
                    res.status(200).send(new_interview);
                }else{
                    res.status(500).send("something went wrong!");
                }
            }else{
                res.status(404).send("recruiter doesn't exist")
            }
        })
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
            company_name=interviewer.company.company_name;})
        email_candidate(req.body.link,req.body.candidate_email,rec_name,company_name,req.body.date,req.body.start_hour);
     }catch(err){}
}

exports.get_interview_details = async (req,res) => {
    try{
        const interview = await Interview.findById({_id:req.params.interviewID})
        if(interview){
            res.status(200).send(interview);
        }else{
            res.status(404).send('interview not found!')
        }
        // console.log(interview);
    }catch(err){
        res.status(500).send({err:err.message})
    }
}

exports.get_interviews = async (req,res) => {
    try{
        await Interview.find({recruiter:req.params.recruiterID})
        .then((interviews)=>{
            if(interviews){
                res.status(200).send(interviews);
            }else{
                res.status(404).send("interviews list is empty");
            }
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

        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let m = months[date.getMonth()];

        let interviews=await Interview.find({recruiter:req.params.recruiterID, date:currentDate})
        if(interviews.length!=0){
            let dInterviews=interviews.map(el=>{
                return {title:el.title,weekday:today,month:m,day:day,year:year,start_hour:el.start_hour,end_hour:el.end_hour}
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

exports.get_month_interviews = async (req,res) => {
    try{
        const c_date = new Date();
        let c_month = String(c_date.getMonth() + 1);
        let interviews=await Interview.find({recruiter:req.params.recruiterID })
        if(interviews.length!=0){
            let dInterviews=interviews.filter(el=>{
                const date = dayjs(el.date).format('YYYY-DD-MM')
                const d = new Date(date);
                return (d.getMonth()+1)==c_month
            })
            res.status(200).send({month_interviews:dInterviews.length});
        }else{
            res.status(404).send("No interviews for today!")
        }
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

exports.update_interview = async (req,res) => {
    try {
        const updates = req.body;
        if(req.body.date){
            req.body.date=dayjs(req.body.date).format('DD/MM/YYYY');
        }
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        forpath="";
        for(let i=0;i<30;i++){
            forpath+=chars[Math.floor(Math.random()*chars.length)];
        }
        if(req.body.title){
            await Interview.findByIdAndUpdate(req.params.interviewID , {$set:updates})
            .then(async (result)=>{ 
                if(result){
                    const interview_link=`http://localhost:3001/${req.body.title.replace(/ /g,"-")}/${forpath}`;
                    await Interview.findByIdAndUpdate(req.params.interviewID, {$set:{link:interview_link}})
                    .then(()=>{res.status(200).send("Interview is updated!")})
                }
            }).catch(err=>{
                res.status(404).send({err:err.message});
            }) 
        }else{
            await Interview.findByIdAndUpdate(req.params.interviewID , {$set:updates})
            .then(()=>{ 
                res.status(200).send("Interview is updated!")
            }).catch(err=>{
                res.status(404).send({err:err.message});
            }) 
        }
    } catch (error) {
        res.status(500).send({err:error.message})
    }
}

exports.delete_interview = async (req,res) => {
    try {
        const interview = await Interview.findById({_id:req.params.interviewID});
        if(interview){
            interview.remove();
            res.status(200).send("Interview is deleted!")
        }else{
            res.status(404).send('interview not found')
        }
    } catch (error) {
        res.status(500).send({err:error.message})
    }
}

