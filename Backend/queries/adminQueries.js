const getAdmin="SELECT * FROM adminTable WHERE emailId=($1)"
const addAdmin="INSERT INTO adminTable (userName,emailId,password,createdBy) VALUES ($1,$2,$3,$4)"
const getAdminPassword ="SELECT password from adminTable WHERE(emailId=$1)"

const getAdminById="SELECT * FROM adminTable WHERE id=($1)"

module.exports={
    getAdmin,
    addAdmin,
    getAdminPassword,
    getAdminById
}