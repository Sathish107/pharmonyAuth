const getDeliveryGuy="SELECT * FROM deliveryGuy WHERE emailId=$1"
const addDeliveryGuy="INSERT INTO deliveryGuy (userId,mobileNumber,emailId) values ($1,$2,$3)"
const getUserPassword="SELECT password FROM userTable WHERE id=$1"

module.exports={
    getDeliveryGuy,
    addDeliveryGuy,
    getUserPassword
}