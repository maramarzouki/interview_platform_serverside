const interview_controllers = require('../Controllers/interviewControllers')
const Router = require('express');
const router = Router();

router.post('/add_interview',interview_controllers.add_interview);
router.post('/notify_user/:recruiterID',interview_controllers.notify_candidate)
router.get('/get_interviews/:recruiterID',interview_controllers.get_interviews);
router.get('/get_today_interviews/:recruiterID',interview_controllers.get_today_interviews);
router.get('/get_interview_details/:interviewID',interview_controllers.get_interview_details);
router.patch('/update_interview/:interviewID',interview_controllers.update_interview);
router.delete('/delete_interview/:interviewID',interview_controllers.delete_interview);

module.exports=router;