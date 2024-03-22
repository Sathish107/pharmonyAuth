const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const queries=require('../queries/adminQueries')
const {pool}=require('../config/db')

const adminRegister=asyncHandler(async (req,res)=>{
    const {userName,emailId,password}=req.body

    await pool.query(queries.getAdmin,[emailId],async (err,result)=>{
        if(err) {res.status(400).json({"message":`${err}`})}
        else if(result.rows.length){
            res.status(400).json({"message":"this emaild id is already taken by some one"})
        }else{
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            const createdBy=req.user.id
            await pool.query(queries.addAdmin,[userName,emailId,hashedPassword,createdBy],(err,result)=>{
                if(err){
                    res.status(400).json({"message":"Unable to create user"})
                }else{
                    pool.query(queries.getAdmin,[emailId],(err,result)=>{
                        const id=result.rows[0].id
                        res.status(200).json({
                            token:generateToken(id)
                        })
                    })
                }
            })
        }
    })
})

const adminLogin=asyncHandler(async (req,res)=>{
    const{emailId,password}=req.body
    await pool.query(queries.getAdmin,[emailId],async (err,result)=>{
        if(err){res.status(400).json({"err":`${err}`})}
        else{
            if(result.rows.length && await bcrypt.compare(password,result.rows[0].password)){
                res.status(200).json({
                    token:generateToken(result.rows[0].id)
                })
            }else{
                res.status(400).json({"message":"Wrong credentials"})
            }
        }
    })
})

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_ADMIN_SECRET,{expiresIn:'3d'})
}

module.exports={
    adminRegister,
    adminLogin
}