const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken') 
const {pool}=require('../config/db')
const queries=require('../queries/pharmacyQueries')
const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const uploadMiddleware = upload.array('images', 10);

const pharmacyRegister=asyncHandler(async (req,res)=>{
    if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file uploaded.');
    }

    const {Pharmacy_name,email_ID,Password,mobile_number,address,location}=req.body
    const Status="not verified"
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(Password,salt)
    const filePaths = req.files.map(file => file.path)

    await pool.query(queries.getPharmacy,[email_ID],async (err,result)=>{
      if(err){
        res.status(400).json({"err":`${err}`})
      }else{
        if(result.rows.length){
          res.status(400).json({"message":"email id is already taken by some one"})
        }else{
          await pool.query(queries.addPharmacy,[Pharmacy_name,email_ID,hashedPassword,mobile_number,address,location,Status,filePaths[0],filePaths[1],filePaths[2],filePaths[3],filePaths[4],filePaths[5],filePaths[6],filePaths[7],filePaths[8],filePaths[9]],(err,result)=>{
            if(err) res.status(400).json({"err":`${err}`})
            else{
              res.status(200).json({"message":"Account request initiallized"})
            }
          })
        }
      }
    }) 
})

const pharmacyLogin=asyncHandler(async (req,res)=>{
  const {email_ID,Password}=req.body
  await pool.query(queries.getPharmacy,[email_ID],async (err,result)=>{
    if(err){
      res.status(400).json({"err":`${err}`})
    }else {
      if(result.rows.length){
        if(await bcrypt.compare(Password,result.rows[0].Password)){
      res.status(200).json({"token":generateToken(result.rows[0].id)})
    }
      }else{
        res.status(400).json({"message":`no account found`})
    }
  }
  })
})

const downloadimage=asyncHandler(async (req,res)=>{
  const {id,no}=req.params;
  await pool.query('select "Drug_License","GST_Registration_Certificate","Shops_and_Establishment_Act_registration_Certificate","Trade_License","FSSAI_License","Fire_Safety_Certificate","Pollution_Control_Board_NOC","Business_Registration_Documents","Medical_Council_Registration","Signage_License" from public."Pharmacy_Table" where "Pharmacy_ID"=($1)',[id],(err,result)=>{
    if (err) res.status(400).json({"err":`${err}`})
    else{
      if(result.rows.length){
        const {Drug_License,GST_Registration_Certificate,Shops_and_Establishment_Act_registration_Certificate,Trade_License,FSSAI_License,Fire_Safety_Certificate,Pollution_Control_Board_NOC,Business_Registration_Documents,Medical_Council_Registration,Signage_License} = result.rows[0];
        const absolutePath1 = path.resolve(__dirname, '../..', Drug_License);
        const absolutePath2 = path.resolve(__dirname, '../..', GST_Registration_Certificate);
        const absolutePath3 = path.resolve(__dirname, '../..', Shops_and_Establishment_Act_registration_Certificate);
        const absolutePath4 = path.resolve(__dirname, '../..', Trade_License);
        const absolutePath5 = path.resolve(__dirname, '../..', FSSAI_License);
        const absolutePath6 = path.resolve(__dirname, '../..', Fire_Safety_Certificate);
        const absolutePath7 = path.resolve(__dirname, '../..', Pollution_Control_Board_NOC);
        const absolutePath8 = path.resolve(__dirname, '../..', Business_Registration_Documents);
        const absolutePath9 = path.resolve(__dirname, '../..', Medical_Council_Registration);
        const absolutePath10 = path.resolve(__dirname, '../..',Signage_License);

        if(no==1)
        res.sendFile(absolutePath1);
        if(no==2)
        res.sendFile(absolutePath2);
        if(no==3)
        res.sendFile(absolutePath3);
        if(no==4)
        res.sendFile(absolutePath4);
        if(no==5)
        res.sendFile(absolutePath5);
        if(no==6)
        res.sendFile(absolutePath6);
        if(no==7)
        res.sendFile(absolutePath7);
        if(no==8)
        res.sendFile(absolutePath8);
        if(no==9)
        res.sendFile(absolutePath9);
        if(no==10)
        res.sendFile(absolutePath10);
      }else{
        res.status(400).json({"message":"No images found in this id"})
      }
    }
  })
})

const handleApprove=asyncHandler(async (req,res)=>{
  const id=req.body.id
  const status="verified"
  await pool.query(queries.makeApprove,[id],(err,result)=>{
    if(err){ res.status(400).json({"err":`${err}`})}
    else{
      res.status(200).json({"message":"Approved Successfully"})
    }
  })
})

const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_PHARMACY_SECRET,{expiresIn:'3d'})
}

module.exports={
    pharmacyRegister,
    pharmacyLogin,
    uploadMiddleware,
    downloadimage,
    handleApprove
}