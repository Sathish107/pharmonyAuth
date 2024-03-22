const getPharmacy='SELECT * FROM public."Pharmacy_Table" WHERE "email_ID"=$1'

const addPharmacy='INSERT INTO public."Pharmacy_Table" ("Pharmacy_name","email_ID","Password",mobile_number,address,location,"Status","Drug_License","GST_Registration_Certificate","Shops_and_Establishment_Act_registration_Certificate","Trade_License","FSSAI_License","Fire_Safety_Certificate","Pollution_Control_Board_NOC","Business_Registration_Documents","Medical_Council_Registration","Signage_License")  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)'

const getPassword='SELECT "Password" FROM public."Pharmacy_Table" WHERE "email_ID"=$1'

const makeApprove = 'UPDATE public."Pharmacy_Table" SET "Status"=\'verified\' WHERE "Pharmacy_ID"=$1';

module.exports={
    getPharmacy,
    addPharmacy,
    getPassword,
    makeApprove
}