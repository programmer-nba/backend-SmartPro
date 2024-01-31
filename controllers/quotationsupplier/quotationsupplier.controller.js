const Product = require("../../models/product/product.schema");
const Quotationsupplier = require("../../models/quotationsupplier/quotationsupplier.schema")
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
//เพิ่มใบเสนอราคาของซัพพลายเออร์
module.exports.add = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }

      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);

          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        image = reqFiles[0];
      }
      let { quotationnumber,originproducts,order_code,delivery,dateoffer,payment,remark,supplier_id} = req.body;
      
      const data = new Quotationsupplier({
        quotationnumber :quotationnumber, //(เลขใบที่ซัพพลายเออร์ไปให้)
        originproducts:originproducts,
        order_code:order_code, //(เลขรหัสออเดอร์ใบเสนอราคาจากซัพพลายเออร์)
        delivery:delivery, //  (เวลาในการจัดส่ง)
        dateoffer:dateoffer, // (วันที่เสนอไป)
        payment :payment,//(การจ่ายเงิน)
        remark:remark, //(หมายเหตุ)
        supplier_id:supplier_id, // (รหัสซัพพลาย)
        filequotation:"",
        fileemail:""
      });
      const add = await data.save();
      return res
        .status(200)
        .send({ status: true, message: "คุณได้เพิ่มข้อมูลใบเสนอราคาซัพพลายเออร์", data: add });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const quotationsupplierdata = await Quotationsupplier.find()
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!quotationsupplierdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    return res.status(200).send({ status: true, data: quotationsupplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};



//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const quotationsupplierdata = await Quotationsupplier.findOne({ _id: id })
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!quotationsupplierdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคาซัพพลายเออร์" });
    }
    return res.status(200).send({ status: true, data: quotationsupplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลตาม supplier
module.exports.getbysupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const quotationsupplierdata = await Quotationsupplier.find({supplier_id: id })
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!quotationsupplierdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคาซัพพลายเออร์" });
    }
    return res.status(200).send({ status: true, data: quotationsupplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมดพร้อมสินค้าใน ใบเสนอราคานั้นด้วย
module.exports.getbyquotionsupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const quotationsupplierdata = await Quotationsupplier.find({supplier_id: id })
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });


    if (!quotationsupplierdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคาซัพพลายเออร์" });
    }
    return res.status(200).send({ status: true, data: quotationsupplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//แก้ไขข้อมูลใบเสนอราคาซัพพลายเออร์
module.exports.edit = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      //เช็คว่ามีข้อมูลก่อนไหม
      const id = req.params.id;
      const quotationsupplierdata = await Quotationsupplier.findById(id);
      if (!quotationsupplierdata) {
        return res
          .status(404)
          .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคาซัพพลายเออร์" });
      }

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

        //ไฟล์รูป
        image = reqFiles[0]
      }
    
      // เช็คว่ามีการอัพเดทรูปมาไหม ถ้ามาจะได้ลบ
      if(image != '' && quotationsupplierdata.image!=null)
      {
          await deleteFile(quotationsupplierdata.image)
      }
      let { quotationnumber,originproducts,order_code,delivery,dateoffer,payment,remark,supplier_id} = req.body;
      const data = {
        quotationnumber :quotationnumber, //(เลขใบที่ซัพพลายเออร์ไปให้)
        originproducts:originproducts,
        order_code:order_code, //(เลขรหัสออเดอร์ใบเสนอราคาจากซัพพลายเออร์)
        delivery:delivery, //  (เวลาในการจัดส่ง)
        dateoffer:dateoffer, // (วันที่เสนอไป)
        payment :payment,//(การจ่ายเงิน)
        remark:remark, //(หมายเหตุ)
      }
    const edit = await Quotationsupplier.findByIdAndUpdate(id, data, { new: true });
    return res
      .status(200)
      .send({
        status: true,
        message: "คุณได้แก้ไขข้อมูลใบเสนอราคาซัพพลายเออร์เรียบร้อย",
        data: edit,
      });
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลใบเสนอราคาซัพพลายเออร์
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const quotationsupplierdata = await Quotationsupplier.findOne({ _id: id });
    if (!quotationsupplierdata) {
      return res
        .status(200)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคาซัพพลายเออร์" });
    }
    if(quotationsupplierdata.filequotation !='')
    {
        await deleteFile(quotationsupplierdata.filequotation)
    }
    if(quotationsupplierdata.fileemail !='')
    {
        await deleteFile(quotationsupplierdata.fileemail)
    }
    const deletepoduct = await Product.deleteMany({quotationsupplier_id:id})
    const deleteproduct = await Quotationsupplier.findByIdAndDelete(id);
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleteproduct });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.addfilequotation = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("file", 20);
      upload(req, res, async function (err) {
        const id = req.params.id;
        const checkdata = await Quotationsupplier.findById(id);
        if(!checkdata)
        {
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
  
        let file = ""; // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
  
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
          file = reqFiles[0];
          const data = {
            filequotation:file,
          }
          const edit = await Quotationsupplier.findByIdAndUpdate(id,data,{new:true})
          return res
          .status(200)
          .send({ status: true, message: "ได้เพิ่มไฟล์ใบเสนอราคาแล้ว", data: edit });
        }   
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
};

module.exports.addfileemail = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("file", 20);
      upload(req, res, async function (err) {
        const id = req.params.id;
        const checkdata = await Quotationsupplier.findById(id);
        if(!checkdata)
        {
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
  
        let file = ""; // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
  
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
          file = reqFiles[0];
          const data = {
            fileemail:file,
          }
          const edit = await Quotationsupplier.findByIdAndUpdate(id,data,{new:true})
          return res
          .status(200)
          .send({ status: true, message: "ได้เพิ่มไฟล์emailแล้ว", data: edit });
        }   
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
};
  
module.exports.getbyproduct = async (req, res) => {
  try {
    const quotationsupplierdata = await Quotationsupplier.find()
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    ///////////
    const productdata = await Product.find()
      .populate({ path: "rate"})
      .populate({ path: "quotationsupplier_id"})
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
      /////////

      const mappedData = quotationsupplierdata.map(item => {
        const productmap =  productdata.filter(items=> JSON.parse(JSON.stringify(items.quotationsupplier_id._id))  == JSON.parse(JSON.stringify(item._id)))
      return {
      _id: item._id,
      quotationnumber: item.quotationnumber,
      originproducts: item.originproducts,
      order_code: item.order_code,
      delivery: item.delivery,
      dateoffer: item.dateoffer,
      payment: item.payment,
      remark: item.remark,
     
      supplier_id: {
        _id: item.supplier_id._id,
        name: item.supplier_id.name,
        categoryofproducts: item.supplier_id.categoryofproducts
      },
      filequotation: item.filequotation,
      fileemail: item.fileemail,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      __v: item.__v,
      //เพิ่มสินค้า
      product:productmap,
      };
    });

    if (! mappedData) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    return res.status(200).send({ status: true, data:  mappedData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


module.exports.getbysupplierproduct = async (req, res) => {
  try {
    const id = req.params.id
    const quotationsupplierdata = await Quotationsupplier.find({supplier_id:id})
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });

    if(quotationsupplierdata == undefined)
    {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    ///////////
    const productdata = await Product.find({supplier_id:id})
      .populate({ path: "rate"})
      .populate({ path: "quotationsupplier_id"})
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
      /////////

      const mappedData = quotationsupplierdata.map(item => {
        const productmap =  productdata.filter(items=> JSON.parse(JSON.stringify(items.quotationsupplier_id._id))  == JSON.parse(JSON.stringify(item._id)))
      return {
      _id: item._id,
      quotationnumber: item.quotationnumber,
      originproducts: item.originproducts,
      order_code: item.order_code,
      delivery: item.delivery,
      dateoffer: item.dateoffer,
      payment: item.payment,
      remark: item.remark,
     
      supplier_id: {
        _id: item.supplier_id._id,
        name: item.supplier_id.name,
        categoryofproducts: item.supplier_id.categoryofproducts
      },
      filequotation: item.filequotation,
      fileemail: item.fileemail,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      __v: item.__v,
      //เพิ่มสินค้า
      product:productmap,
      };
    });

    if (! mappedData) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    return res.status(200).send({ status: true, data:  mappedData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
