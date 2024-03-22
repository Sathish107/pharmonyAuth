const dotenv=require('dotenv').config()
const express=require('express')
const app=express()
app.use(express.json())
const PORT=process.env.PORT


app.use('/api/admin',require('./routes/adminRoutes'))
app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/deliveryguy',require('./routes/deliveryGuyRoutes'))
app.use('/api/pharmacy',require('./routes/pharmacyRoutes'))

app.listen(PORT,()=>console.log(`server is runing on port ${PORT}`))