// services/utilityDataService.js
const UtilityData = require('../../model/homeModel');



exports.upsertUtilityData = async (data, homeId) => {
  const conditions = { homeId: homeId, mobileNumber: data.mobileNumber };
  const options = { upsert: true,  setDefaultsOnInsert: true };

  const updatedData = await UtilityData.findOneAndUpdate(conditions, data, options);
  return updatedData;
};


exports.creatingUser = async (data) =>{
  const conditions = {userName:data.userName, mobileNumber:data.mobileNumber};
  const options = {upsert:true,new:true, setDefaultsOnInsert:true};

  const existinguser = await UtilityData.findOne(conditions,options);
   if(!existinguser){
    try{
      let createuser=await UtilityData.create(data);
      console.log("New User Created");
      return createuser;
     }catch(err){console.error(err)}
   }else{
     console.log("User already exists")
     return "User Already Exists";
   }
}


exports.updateuser = async (id, data) => {
  try {
      // Find and update the user by ID
      const updatedUser = await UtilityData.findByIdAndUpdate(id, data, { new: true });

      return updatedUser;
  } catch (error) {
      // Handle errors
      throw new Error("Error updating user: " + error.message);
  }
}




exports.findbynumber = async(mobileNumber) => {
  try{
    const existinguser_withMobile = await UtilityData.findOne({mobileNumber});

    return existinguser_withMobile
  }catch{
    return  null
  }
}