const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const comparepriceSchema = new mongoose.Schema(
  { 
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(ชื่อลูกค้า)
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสSales Department )
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    productdetail:{type:[{
        type_id: {type: mongoose.Schema.Types.ObjectId,ref:'type'},
        type_name:{type:String},
        product:{type:[
          {
            product_id: {type: mongoose.Schema.Types.ObjectId,ref:'product'},
            product_name:{type:String},
            price:{type:Number},
            rate:{type: mongoose.Schema.Types.ObjectId,ref:'rate'},
            rate_name: {type:String,default:""},
            rate_rateprice: {type:Number,default:0},
            rate_symbol: {type:String,default:""},
            supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
            supplier_name:{type:String}
          }
        ]}
    }],default:""}    
  },
  {timestamps: true}
);

const Compareprice = mongoose.model("compareprice", comparepriceSchema);

module.exports = Compareprice;