const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken') 

const {pool}=require('../config/db')
const queries=require('../queries/userQueries')

const handleRegister=asyncHandler(async (req,res)=>{
    const {emailId,userName,password,mobileNumber,address,location}=req.body
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    await pool.query(queries.checkEmail,[emailId],(err,result)=>{
        if(err) res.status(400).json({"err":`${err}`})
        else{
            if(result.rows.length){
                res.status(400).json({"message":"user with same emaild id is already there"})
            }else{
                pool.query(queries.addUser, [emailId, userName, hashedPassword, mobileNumber, address, location[0],location[1]],(err,result)=>{
                    if (err) res.status(400).json({"err":`${err}`})
                    else{
                        pool.query(queries.getUser,[emailId],(err,result)=>{
                            if (err) res.status(400).json({"err":`${err}`})
                            else{
                                let {id,emailid,username,password,mobilenumber,address,location}=result.rows[0]
                                res.status(200).json({
                                    id:id,
                                    emailId:emailid,
                                    userName:username,
                                    mobileNumber:mobilenumber,
                                    address:address,
                                    location:location,
                                    token:generateToken(id)
                                })
                            }
                        })
                    } 
                });
            }
        }
    })
})

const handleLogin=asyncHandler(async (req,res)=>{
    const {emailId,password}=req.body
    await pool.query(queries.checkEmail,[emailId],(err,result)=>{
        if(err) res.status(400).json({"err":`${err}`})
        else{
            if(result.rows.length){
                pool.query(queries.getUser,[emailId],async (err,result)=>{
                    if (err) res.status(400).json({"err":`${err}`})
                    else{
                        if(await bcrypt.compare(password,result.rows[0].password)){
                            let {id,emailid,username,password,mobilenumber,address,location}=result.rows[0]
                            res.status(200).json({
                                id:id,
                                emailId:emailid,
                                userName:username,
                                mobileNumber:mobilenumber,
                                address:address,
                                locaton:location,
                                token:generateToken(id)
                            })
                        }else{
                            res.status(400).json({"message":"wrong credentials"})
                        }
                    }
                })
            }else{
                res.status(400).json({"Message":"No such email exist"})
            }
        }
    })
    
})

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_USER_SECRET,{expiresIn:'3d'})
}

module.exports={
    handleLogin,
    handleRegister
}