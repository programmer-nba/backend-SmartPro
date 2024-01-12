const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const comparepriceSchema = new mongoose.Schema(
  { 
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(ชื่อลูกค้า)
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสแผนกขาย)
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    productdetail:{type:[{
        product_id: {type: mongoose.Schema.Types.ObjectId,ref:'product'},
        name:{type:String},
        brand: {type: mongoose.Schema.Types.ObjectId,ref:'brand'},
        image:{type:String},
        producttype:{type:mongoose.Schema.Types.ObjectId,ref:'producttype'},
        supplier:{type:[{
            supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
            price :{type:Number}
        }]}
    }],default:""}    
  },
  {timestamps: true}
);

const Compareprice = mongoose.model("compareprice", comparepriceSchema);

module.exports = Compareprice;