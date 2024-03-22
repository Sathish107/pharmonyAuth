const router=require('express').Router()
const {registerDeliverGuy,loginDeliveryGuy}=require('../controllers/deliveryGuyControllers')

router.route('/register').post(registerDeliverGuy)
router.route('/login').post(loginDeliveryGuy)

module.exports=router