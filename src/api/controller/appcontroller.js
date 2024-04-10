const utilityDataService = require('../services/Homeservice')


exports.updateUtilityData = async (req, res) => {

    const { mobileNumber, value,homeId } = req.body; // Updated mobile number and value
    console.log()


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
