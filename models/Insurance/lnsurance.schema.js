const mongoose = require("mongoose");

const lnsuranceSchema = new mongoose.Schema(
  {
    order_id: {type:mongoose.Schema.Types.ObjectId,ref:'order',required:true},
    productdetail: { type: [{
        product_id :{type: mongoose.Schema.Types.ObjectId,ref:'product'}, //(ข้อมูลสินค้า)
        product_name:{type:String}, // (ชื่อสินค้า)
        brand: {type: mongoose.Schema.Types.ObjectId,ref:'brand'},
        image:{type:String},
        quantity:{type:Number},//(จำนวน)
        price :{type:Number},
        unit:{type:String},
        rate: {type:mongoose.Schema.Types.ObjectId,ref:'rate'},
        rate_name: {type:String},
        rate_rateprice: {type:Number},
        rate_symbol: {type:String},
        supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
	      total:{type:Number} //(ราคารวมในสินค้า)
    }], required: true },
    status: { type: String},
    //ค่าใช้จ่าย
   
    date: { type: Date, default: Date.now },
    cost: { type: Number, default:0}, // ค่าใช้จ่ายที่ส่งให้บริษัทประกัน
    //ลูกค้าได้รับของแล้ว
    cost2 : { type: Number, default:0}, // ค่าใช้จ่ายที่ส่งให้ลูกค้า
    received: { type: Date, default: null },

  },
  {timestamps: true}
);

const Lnsurance = mongoose.model("lnsurance", lnsuranceSchema);

module.exports = Lnsurance;