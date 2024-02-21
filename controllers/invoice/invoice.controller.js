const Invoice = require('../../models/invoice/invoice.schema');
const Order = require('../../models/order/order.schema');

//เปิดใบแจ้งหนี้และวางบิล
module.exports.openinvoice = async (req, res) => {
    try {
        const id = req.body.id;
        const order =  await Order.findById(id).populate('quotation_id');
        if(!order) 
        {
            return res.status(404).json({status:false , message: "ไม่มีออเดอร์" });
        }
        
        // วันครบกำหนดชำระเงิน
        const date = req.body.date;
        const account_id = req.body.account_id;
        const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
        const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const referenceNumber = String(await Order.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments()).padStart(5, '0');
        const refno = `Order${currentDate}${referenceNumber}`;
        const invoice = new Invoice({
            order_id:order._id, //(รหัสใบสั่งซื้อ)
            customer_id: order.customer_id ,//(ชื่อลูกค้า)
            contact_id:order.contact_id, //(ชื่อผู้ติดต่อ)
            sale_id :order.sale_id,
            procurement_id:order.procurement_id,

            refno:refno, //(เลขที่เอกสาร)
            date :Date.now(), //(วันที่ลงเอกสาร)
            productdetail:order.quotation_id.productdetail,
            
            rate: order.quotation_id.rate,
            ratename: order.quotation_id.ratename,
            rateprice: order.quotation_id.rateprice,
            ratesymbol: order.quotation_id.ratesymbol,
            ////
        
            total:order.quotation_id.priceprofit, //(ราคารวมสินค้า)
            discount:order.quotation_id.discount, //เพิ่มเข้ามาใหม่
            tax:order.quotation_id.tax, //(หักภาษี 7 %)
            alltotal:order.quotation_id.alltotal, //(ราคารวมทั้งหมด)
            
            //ส่วนเพิ่มใหม่
            project: order.quotation_id.project, //ชื่อโปรเจค
            paymentterm :order.quotation_id.paymentterm, //เงื่อนไขการชำระเงิน
            timeofdelivery: order.deliverydate,//กำหนดส่งของ  
            remark:order.quotation_id.remark,
        
            stauts:"รอชำระเงิน", 
            dateofpayment:date, //วันที่ชำระเงิน
            account_id:account_id
        })
        const savedInvoice = await invoice.save();
        if (!savedInvoice) return res.status(500).json({status:false, message: "ไม่สามารถเปิดใบแจ้งหนี้ได้" });
        const updatedOrder = await Order.findByIdAndUpdate(id, { invoiceid: savedInvoice._id, invoicesendstatus: true ,status:"รอจัดส่งให้ลูกค้า" }, { new: true });
        if (!updatedOrder) return res.status(500).json({ status:false,message: "ไม่สามารถเปิดใบแจ้งหนี้ได้" });
        return res.status(200).json({ status:true,data:savedInvoice,order:updatedOrder, message: "เปิดใบแจ้งหนี้สำเร็จ" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//get ข้อมูลใบแจ้งหนี้และวางบิล
module.exports.getinvoice = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).json({ message: "ไม่พบใบแจ้งหนี้" });
        return res.status(200).json({ status:true,data:invoice, message: "พบใบแจ้งหนี้" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//getall ข้อมูลใบแจ้งหนี้และวางบิล
module.exports.getallinvoice = async (req, res) => {
    try {
        const invoice = await Invoice.find();
        if (!invoice) return res.status(404).json({ message: "ไม่พบใบแจ้งหนี้" });
        res.status(200).json({ status:true,data:invoice, message: "พบใบแจ้งหนี้" });
    }
    catch (error) {
       return res.status(500).json({ message: error.message });
    }
}

// ลบข้อมูลใบแจ้งหนี้และวางบิล
module.exports.deleteinvoice = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await Invoice.findByIdAndDelete(id);
        if (!invoice) return res.status(404).json({ message: "ไม่พบใบแจ้งหนี้" });
        const order = await Order.findByIdAndUpdate(invoice.order_id, { invoiceid: null, invoicesendstatus: false }, { new: true });
        return res.status(200).json({ status:true,data:invoice, message: "ลบใบแจ้งหนี้สำเร็จ" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../../functions/uploadfilecreate");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

// แจ้งชำระเงิน
module.exports.paymentnotification = async (req, res) => {
    try {
       
        let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
          
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
          image = reqFiles[0]
        }
  
        const id = req.params.id;
        const invoice = await Invoice.findByIdAndUpdate(id, { stauts: "ชำระเงินแล้ว",silp:image,dateofpayment:req.body.dateofpayment }, { new: true });
        if (!invoice) return res.status(404).json({ message: "ไม่พบใบแจ้งหนี้" });
        return res.status(200).json({ status:true,data:invoice, message: "แจ้งชำระเงินสำเร็จ" });
       
      });
      ////
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

