const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken') 

const {pool}=require('../config/db')
const queries=require('../queries/deliveryGuyQueries')

const registerDeliverGuy=asyncHandler(async (req,res)=>{
    const {userId,mobileNumber,emailId}=req.body
    await pool.query(queries.getDeliveryGuy,[emailId],(err,result)=>{
        if(err) res.status(400).json({"err":`${err}`})
        else if(result.rows.length){
            res.status(400).json({"message":"This email id is already taken"})
        }else{
            pool.query(queries.addDeliveryGuy,[userId,mobileNumber,emailId],(err,result)=>{
                if(err) res.status(400).json({"err":`${err}`})
                else{
                    pool.query(queries.getDeliveryGuy,[emailId],(err,result)=>{
                        if(err) res.status(400).json({"err":`${err}`})
                        else{
                            let {id,userid,mobilenumber,emailid}=result.rows[0]
                            res.status(200).json({
                                id:id,
                                userId:userid,
                                mobileNumber:mobilenumber,
                                emailId:emailid,
                                token:generateToken(id)
                            })
                        }
                    })
                }
            })
        }
    })
})

const loginDeliveryGuy=asyncHandler(async (req,res)=>{
    const {emailId,password}=req.body
    await pool.query(queries.getDeliveryGuy,[emailId],(err,result)=>{    
        if(err) res.status(400).json({"err":`${err}`})
        else if(result.rows.length){
            let {id,userid,mobilenumber,emailid}=result.rows[0]
            pool.query(queries.getUserPassword,[result.rows[0].userid],async (err,result)=>{
                if (err) res.status(400).json({"err":`${err}`})
                else{
                    if(await bcrypt.compare(password,result.rows[0].password)){
                        res.status(200).json({
                            id:id,
                            userId:userid,
                            mobileNumber:mobilenumber,
                            emaild:emailid,
                            token:generateToken(id)
                        })
                    }else{
                        res.status(400).json({"message":"Incorrect credentials"})
                    }
                }
            })
        }else{
            res.status(400).json({"message":"email doesnt exist"})
        }
    })
})

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_DELIVERYGUY_SECRET,{expiresIn:'3d'})
}

module.exports={
    registerDeliverGuy,
    loginDeliveryGuy
}