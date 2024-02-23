const mongoose = require("mongoose");

const billingaccountSchema = new mongoose.Schema(
  {
    nameaccount:{type:String},
    bankname:{type:String},
    bankid:{type:String},
    bankbranch:{type:String},
  }
);

const Billingaccount = mongoose.model("billingaccount", billingaccountSchema);

module.exports = Billingaccount;