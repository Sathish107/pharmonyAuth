const Pool=require('pg').Pool;

const pool=new Pool({
    user:process.env.user,
    host:process.env.host,
    database:process.env.database,
    password:process.env.password,
    port:5432,
    ssl:true
})


module.exports={
    pool
};