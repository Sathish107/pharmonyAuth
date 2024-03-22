const router=require('express').Router()
const {handleLogin,handleRegister}=require('../controllers/userControllers')

router.route('/register').post(handleRegister)
router.route('/login').post(handleLogin)

module.exports=router
