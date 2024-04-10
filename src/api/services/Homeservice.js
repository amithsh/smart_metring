// services/utilityDataService.js
const UtilityData = require('../../model/homeModel');



exports.upsertUtilityData = async (data, homeId) => {
  const conditions = { homeId: homeId, mobileNumber: data.mobileNumber };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  const updatedData = await UtilityData.findOneAndUpdate(conditions, data, options);
  return updatedData;
};
