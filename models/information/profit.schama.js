const mongoose = require("mongoose");

const ProfitSchema = new mongoose.Schema(
  {
    profitstart:{type:Number}, // (ราคาเริ่มต้น)
    profitend:{type:Number}, // (ราคาถึง)
    percent:{type:Number} // เปอร์เซ็นต์
  },
  {timestamps: true}
);

const Profit = mongoose.model("profit", ProfitSchema);

module.exports = Profit;