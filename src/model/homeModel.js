// models/UtilityData.js
const mongoose = require('mongoose');

const utilityDataSchema = new mongoose.Schema({
  homeId:{
    type:String,
    default:''
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  value: {
    type:Number,
    default: 0
  },
  timestamp: {
    type:Date,
    default: Date.now()
  },
  paymentStatus: {
    type:String,
    default: 'Unpaid'
  },
  masterNodeName: {
    type:String,
    default:'MasterNode'
  },
  userName: {
    type:String,
    default: "Guest"
  },
  region: {
    type:String,
    default: "No Region Assigned"
  }
}, { timestamps: true });

module.exports = mongoose.model('UtilityData', utilityDataSchema);
