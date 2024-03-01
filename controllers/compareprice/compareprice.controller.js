// const Compareprice = require("../../models/compareprice/compareprice.schema")

const Compareprice = require("../../models/compareprice/compareprice.schema");
const Order = require("../../models/order/order.schema");

//เพิ่มใบเปรียบเทียบราคา  ของ sale
module.exports.add = async (req, res) => {
  try {
      const data =  new Compareprice({
        order_id:req.body.order_id,
        sale_id:req.body.sale_id,
        supplier1:req.body.supplier1,
        salecompareprice1:req.body.salecompareprice1,
        supplier2:req.body.supplier2,
        salecompareprice2:req.body.salecompareprice2,
        supplier3:req.body.supplier3,
        salecompareprice3:req.body.salecompareprice3,
        supplier4:req.body.supplier4,
        salecompareprice4:req.body.salecompareprice4,
        supplier5:req.body.supplier5,
        salecompareprice5:req.body.salecompareprice5,
        supplier6:req.body.supplier6,
        salecompareprice6:req.body.salecompareprice6,
        selectproduct:req.body.selectproduct 
      })
      const add = await data.save();
      const order = await Order.findOne({ _id: req.body.order_id });
        if (!order) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อ" });
        }
      const editorder = await Order.findByIdAndUpdate(req.body.order_id,{compareprice_id:add._id},{new:true})
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบเปรียบเทียบราคา",data: add,order:editorder});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขใบเปรียบเทียบราคา  ของ sale
module.exports.editsale = async (req, res) => {
    try {
        const order_id = req.params.id;
        const order = await Order.findOne({ _id: order_id });
        if (!order) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อ" });
        }
        const data = {
            supplier1:req.body.supplier1,
            salecompareprice1:req.body.salecompareprice1,
            supplier2:req.body.supplier2,
            salecompareprice2:req.body.salecompareprice2,
            supplier3:req.body.supplier3,
            salecompareprice3:req.body.salecompareprice3,
            supplier4:req.body.supplier4,
            salecompareprice4:req.body.salecompareprice4,
            supplier5:req.body.supplier5,
            salecompareprice5:req.body.salecompareprice5,
            supplier6:req.body.supplier6,
            salecompareprice6:req.body.salecompareprice6, 
            selectproduct:req.body.selectproduct 
            }
        const edit = await Compareprice.findOneAndUpdate({order_id:order_id},data,{new:true});
        return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบเปรียบเทียบราคา",data: edit});
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};



//แก้ไขใบเปรียบเทียบราคา  ของ procurement
module.exports.editpro = async (req, res) => {
    try{
        const order_id = req.params.id;
        const order = await Order.findOne({ _id: order_id });
        if (!order) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อ" });
        }
        const data = {
            supplierpro1:req.body.supplierpro1,
            procurementcompareprice1:req.body.procurementcompareprice1,
            supplierpro2:req.body.supplierpro2,
            procurementcompareprice2:req.body.procurementcompareprice2,
            supplierpro3:req.body.supplierpro3,
            procurementcompareprice3:req.body.procurementcompareprice3,
            supplierpro4:req.body.supplierpro4,
            procurementcompareprice4:req.body.procurementcompareprice4,
            supplierpro5:req.body.supplierpro5,
            procurementcompareprice5:req.body.procurementcompareprice5,
            supplierpro6:req.body.supplierpro6,
            procurementcompareprice6:req.body.procurementcompareprice6, 
            selectproduct:req.body.selectproduct
            }
            
        const edit = await Compareprice.findOneAndUpdate({order_id:order_id},data,{new:true});
        return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบเปรียบเทียบราคา",data: edit});

    }catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};


// //ดึงข้อมูลทั้งหมด
// module.exports.getall = async (req, res) => {
//   try {
//     const comparepricedata = await Compareprice.find()
//     .populate('customer_id')
//     .populate('user_id')
//     if (!comparepricedata) {
//       return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
//     }
//     return res.status(200).send({ status: true, data: comparepricedata });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };

// module.exports.getcustomer = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const comparepricedata = await Compareprice.find({customer_id:id})
//     .populate('customer_id')
//     .populate('user_id')
//     if (!comparepricedata) {
//       return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
//     }
//     return res.status(200).send({ status: true, data: comparepricedata });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };
// //ดึงข้อมูล by id
// module.exports.getbyid = async (req, res) => {
//   try {
//     const comparepricedata = await Compareprice.findOne({ _id: req.params.id }).populate('customer_id')
//     .populate('customer_id')
//     .populate('user_id')
//     if (!comparepricedata) {
//       return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
//     }
//     return res.status(200).send({ status: true, data: comparepricedata });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };

// //แก้ไขข้อมูลใบเปรียบเทียบราคา
// module.exports.edit = async (req, res) => {
//   try {
//     const id = req.params.id
//     const comparepricedata = await Compareprice.findById(id)
//     if (!comparepricedata) {
//         return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
//     }
//     const {productdetail,rate,ratename,rateprice,ratesymbol} = req.body
//     const data = {
//       productdetail:productdetail, //(ชื่อ)
//       rate:rate,
//       ratename:ratename,
//       rateprice:rateprice,
//       ratesymbol: ratesymbol, 
//     }
//     const edit = await Compareprice.findByIdAndUpdate(id,data,{new:true})
//     return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลใบเปรียบเทียบราคาเรียบร้อย",data: edit});
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };

// //ลบข้อมูลใบเปรียบเทียบราคา
// module.exports.delete = async (req, res) => {
//   try {
//     const id = req.params.id
//     const comparepricedata = await Compareprice.findOne({ _id: id });
//     if (!comparepricedata) {
//       return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
//     }
//     const deletesupplier = await Compareprice.findByIdAndDelete(id);
//     return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };
