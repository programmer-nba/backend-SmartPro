const mongoose = require("mongoose");

const signatureauthorizedSchema = new mongoose.Schema(
  {
    name:{type:String}, //ชื่อ
    signature:{type:String} //ลายเซ็นต์:
  }
);

const Signatureauthorized = mongoose.model("signatureauthorized", signatureauthorizedSchema);

module.exports = Signatureauthorized;