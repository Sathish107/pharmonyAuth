const checkEmail="SELECT * FROM userTable WHERE emailId=$1"
const addUser="INSERT INTO usertable (emailId,userName,password,mobileNumber,address,location) values($1,$2,$3,$4,$5,POINT($6,$7))"
const getUser="SELECT * FROM userTable Where emailId=$1"
const checkCredential="SELECT password FROM userTable WHERE emailId=$1"
module.exports={
    checkEmail,
    addUser,
    getUser,
    checkCredential
}