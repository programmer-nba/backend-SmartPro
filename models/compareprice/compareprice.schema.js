const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const comparepriceSchema = new mongoose.Schema(
  { 
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:"order"},
    sale_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    supplier1:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice1:{type:Array,default:[]},
    supplier2:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice2:{type:Array,default:[]},
    supplier3:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice3:{type:Array,default:[]},
    supplier4:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice4:{type:Array,default:[]},
    supplier5:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice5:{type:Array,default:[]},
    supplier6:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    salecompareprice6:{type:Array,default:[]},

    selectproduct:{type:Array,default:[]},


    procurement_id:{type:mongoose.Schema.Types.ObjectId,ref:"user",default:null},
    supplierpro1:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice1:{type:Array,default:[]},
    supplierpro2:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice2:{type:Array,default:[]},
    supplierpro3:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice3:{type:Array,default:[]},
    supplierpro4:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice4:{type:Array,default:[]},
    supplierpro5:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice5:{type:Array,default:[]},
    supplierpro6:{type:mongoose.Schema.Types.ObjectId,ref:"supplier",default:null},
    procurementcompareprice6:{type:Array,default:[]},

  },
  {timestamps: true}
);

const Compareprice = mongoose.model("compareprice", comparepriceSchema);

module.exports = Compareprice;