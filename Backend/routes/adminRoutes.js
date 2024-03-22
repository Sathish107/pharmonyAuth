const router=require('express').Router()
const {adminRegister,adminLogin}=require('../controllers/adminControllers')
const protect =require('../middleware/authMiddleware')

router.route('/register').post(protect,adminRegister)
router.route('/login').post(adminLogin)

module.exports=router