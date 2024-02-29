const mongoose = require("mongoose");


// Define the schema for the HotelUser entity
const orderSchema = new mongoose.Schema(
  {
    reforder:{type:String,default:""},
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',default:null},
    contact_id:{type: mongoose.Schema.Types.ObjectId,ref:'contactcustomer',default:null},
    sale_id :{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
    requested_products :{type:[{
      partnumber:{type:String,default:""},
      serialnumber:{type:String,default:""},
      product_name:{type:String,default:""},
    }],default:null},
    compareprice_id:{type: mongoose.Schema.Types.ObjectId,ref:'compareprice',default:null},
    quotation_id: {type: mongoose.Schema.Types.ObjectId,ref:'quotation',default:null},
    status:{type:String,default:""},
    //ส่วนการดีลงาน
    dealstatus:{type:Boolean,default:null}, // สถานะการดีล
    dealremark:{type:String,default:""},
    file:{type:String,default:""},
    //ค่าคอมมิสชั่น
    commissionpercent:{type:Number,default:0},
    //วันจะที่จบดีลวันที่ผ่าน  
    dealenddate:{type:Date,default:null},
    //วันที่ต้องส่งของให้กับลูกค้า
    deliverydate:{type:Date,default:null},
    //ส่วนของ po
    procurement_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
    purchaseorder:{type:[
      {
        _id:{type: mongoose.Schema.Types.ObjectId,ref:'purchaseorder',default:null},
        refpurchaseorder:{type:String,default:""},
      }
    ],default:null},
    //ส่วนของการจัดส่ง
    deliverystatus:{type:Boolean,default:false},
    //ส่วนของการจัดส่งให้กับลูกค้าไปแล้ว
    date_delivery:{type:Date,default:null},
    date_customer_delivery:{type:Date,default:null},
    deliverycustomerstatus:{type:Boolean,default:false},


    //ใบแจ้งหนี้และวางบิล
    invoiceid:{type: mongoose.Schema.Types.ObjectId,ref:'invoice',default:null},
    invoicesendstatus:{type:Boolean,default:false},

    //ส่วนของ Logistic
    logistic_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
  },
  {timestamps: true} 
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;