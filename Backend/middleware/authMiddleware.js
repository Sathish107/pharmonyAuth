const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const {pool}=require('../config/db')
const queries=require('../queries/adminQueries')

const protect=asyncHandler(async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1]
            const decode=await jwt.verify(token,process.env.JWT_ADMIN_SECRET)
            const result = await pool.query(queries.getAdminById, [decode.id]);
            if (result.rows.length) {
                req.user= result.rows[0];
                next()
            }else{
                return res.status(400).json({ "message": "User not found in database" });
            }
        }catch(err){
            if(err.name=="TokenExpiredError"){
                res.status(400).json({"message":"Token expired"})
            }else{
                res.status(400).json({"message":`${err}`})
            }
        }
    }
    
    // if(!req.user){
    //     res.status(400).json({"message":"User not found in database"})
    // }else{
    //     next()
    // }
})

module.exports=protect