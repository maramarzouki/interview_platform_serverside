const company_controllers = require('../Controllers/companyControllers')
const Router = require('express')
const router = Router ();

// router.post('/add_company',company_controllers.add_company);
router.get('/get_company_info/:recruiterID',company_controllers.get_company);
router.get('/get_companies',company_controllers.get_all_companies);
router.patch('/update_company/:recruiterID',company_controllers.update_company);
router.delete('/delete_company',company_controllers.delete_company);
 
module.exports = router;