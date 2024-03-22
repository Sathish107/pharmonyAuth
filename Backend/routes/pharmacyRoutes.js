const router=require('express').Router()
const {pharmacyRegister,pharmacyLogin,uploadMiddleware,downloadimage,handleApprove}=require('../controllers/pharmacyControllers')
const protect=require('../middleware/authMiddleware')

router.route('/register').post(uploadMiddleware,pharmacyRegister)
router.route('/login').post(pharmacyLogin)
router.route('/:id/:no').get(downloadimage)
router.route('/approve').put(protect,handleApprove)

module.exports=router