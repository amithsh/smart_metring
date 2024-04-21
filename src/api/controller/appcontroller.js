const utilityDataService = require('../services/Homeservice')
const UtilityData = require('../../model/homeModel');


exports.updateUtilityData = async (req, res) => {

    const { mobileNumber,homeId,value } = req.body; // Updated mobile number and value
    


    try {
        const data = {mobileNumber,value}
        const updatedData = await utilityDataService.upsertUtilityData( data, homeId);

        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found or unauthorized update attempt' });
        }

        res.json(updatedData);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Error updating the utility data");
    }
};



exports.createUser = async (req,res)=>{
    const {mobileNumber,userName} = req.body;

    try{
        const data = {mobileNumber,userName}
        
        const existinguser_withMobile = await utilityDataService.findbynumber(mobileNumber)
        
       
        if(!existinguser_withMobile){
             const createuser = await utilityDataService.creatingUser(data)
            if(!createuser){
                return res.status(409).json({message:"User already exists"})
            }else{
                return res.status(200).json(createuser)
            }
        }else{
            return  res.status(409).json("user exist with this mobile number");
        }
        

    }catch(error){
        console.log(error);
        res.status(500).send("error creatin user")
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { mobileNumber, userName, paymentStatus } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: 'No User Id is provided' });
        }

        // Find the user by ID
        let user = await UtilityData.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'No User Found' });
        }

        // Construct the update data based on provided fields
        const updateData = {};

        if (mobileNumber) {
            updateData.mobileNumber = mobileNumber;
        }
        if (userName) {
            updateData.userName = userName;
        }
        if (paymentStatus !== undefined) {
            updateData.paymentStatus = paymentStatus;
        }

        // Update the user with the provided data
        user = await UtilityData.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(500).json({ message: "Error updating user data" });
        }

        return res.status(200).json({ message: "Updated Successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in updating the user for the utility", error });
    }
}


exports.getUsers = async(req,res)=>{
    try{

        const userlist = await UtilityData.find()

        // console.log(userlist)
        return res.status(200).json(userlist)

    }catch(error){
        console.log("Error getting users : ", error);
        return res.status(500).send("Server Error");
    }
}
