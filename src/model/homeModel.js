// models/UtilityData.js
const mongoose = require('mongoose');

const utilityDataSchema = new mongoose.Schema({
  homeId: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('UtilityData', utilityDataSchema);
