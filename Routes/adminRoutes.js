const Router = require('express')
const admin_controllers = require('../Controllers/adminControllers')
const router = Router();

router.post('/register_admin',admin_controllers.add_admin);
router.post('/admin_login',admin_controllers.login_admin);
router.get('/admin_profile/:adminID',admin_controllers.get_admin_info);
router.get('/admins_list',admin_controllers.get_all_admins);
router.put('/update_info/:adminID',admin_controllers.update_admin);
router.delete('/delete_admin/:adminID',admin_controllers.delete_admin);
 
module.exports = router;