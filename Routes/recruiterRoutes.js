const recruiter_controllers = require('../Controllers/recruiterControllers')
const Router = require('express')
const router = Router();

router.post('/add_recru',recruiter_controllers.add_recruiter);
router.post('/recru_login',recruiter_controllers.login_recruiter);
router.get('/recru_info/:recruiterID',recruiter_controllers.get_recruiter_info);
router.get('/recru_list',recruiter_controllers.get_all_recruiters);
router.patch('/update_recru/:recruiterID',recruiter_controllers.update_recru);
router.delete('/delete_recru_account/:recruiterID',recruiter_controllers.delete_recru);
router.post('/forgot-password',recruiter_controllers.forgot_passowrd)
// router.get('/reset-password/:userID/:token',recruiter_controllers.reset_password)
// router.get('/resetpassword/:userID/:token',recruiter_controllers.reset_password_request)
router.post('/resetpassword/:userID',recruiter_controllers.resetPASSWORD)
router.post('/verify_user/:activationCode',recruiter_controllers.verify_recru)

module.exports = router;