const Product = require("../../models/product/product.schema");
const Producttype = require("../../models/product/producttype.schema")
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
//เพิ่มสินค้า
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
      let {name,brand,model,price,rate,quotationsupplier_id,supplier_id,producttype,detail,unit} = req.body;
      const data = new Product({
        name:name, // (ชื่อสินค้า)
        brand:brand, //(แบรนด์)
        model:model,
        price:price,  
        rate :rate, // (รหัสซัพพลาย)(เรทเงิน)
        image:"", //(รูปภาพ)
        spec:"",
        detail:detail,
        quotationsupplier_id:quotationsupplier_id,
        supplier_id:supplier_id, // (รหัสซัพพลาย)
        producttype:producttype,
        unit:unit
      });
      const add = await data.save();
      return res
        .status(200)
        .send({ status: true, message: "คุณได้เพิ่มข้อมูลสินค้า", data: add });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//เพิ่มสินค้าจาก excel
module.exports.addexcel = async (req, res) => {
  try {
  
      const data = new Product({
        name:req.body.name, // (ชื่อสินค้า)
        brand:req.body.brand, //(แบรนด์)
        model:req.body.model,
        price:req.body.price,  
        rate :req.body.rate, // (รหัสซัพพลาย)(เรทเงิน)
        detail:req.body.detail,
        quotationsupplier_id:req.body.quotationsupplier_id,
        supplier_id:req.body.supplier_id, // (รหัสซัพพลาย)
        producttype:req.body.producttype,
        unit:req.body.unit
      });
      const add = await data.save();
      return res
        .status(200)
        .send({ status: true, message: "คุณได้เพิ่มข้อมูลสินค้า", data: add });
  
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//ดึงข้อมูลทั้งหมด 
module.exports.getall = async (req, res) => {
  try {
    const productdata = await Product.find()
      .populate({ path: "rate"})
      .populate({ path: "quotationsupplier_id"})
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!productdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลสินค้า" });
    }
    return res.status(200).send({ status: true, data: productdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const productdata = await Product.findOne({ _id: id })
    .populate({ path: "rate"})
      .populate({ path: "quotationsupplier_id"})
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!productdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลสินค้า" });
    }
    return res.status(200).send({ status: true, data: productdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลตาม supplier
module.exports.getbysupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const productdata = await Product.find({supplier_id: id })
    .populate({ path: "rate"})
    .populate({ path: "quotationsupplier_id"})
    .populate({ path: "producttype", select: "name" })
    .populate({ path: "supplier_id", select: { "name": 1, "categoryofproducts": 1 } });
    if (!productdata) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่มีข้อมูลสินค้า" });
    }
    return res.status(200).send({ status: true, data: productdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลสินค้า
module.exports.edit = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      //เช็คว่ามีข้อมูลก่อนไหม
      const id = req.params.id;
      const productdata = await Product.findById(id);
      if (!productdata) {
        return res
          .status(404)
          .send({ status: false, message: "ไม่มีข้อมูลสินค้า" });
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
    
      console.log(req.body)
      let {name,brand,model,price,rate,quotationsupplier_id,supplier_id,producttype,detail,unit} = req.body;
      const data = {
        name:name, // (ชื่อสินค้า)
        brand:brand, //(แบรนด์)
        model:model,
        price:price,  
        rate :rate, // (รหัสซัพพลาย)(เรทเงิน)
        quotationsupplier_id:quotationsupplier_id,
        supplier_id:supplier_id, // (รหัสซัพพลาย)
        producttype:producttype,
        detail:detail,
        unit:unit
      }
    const edit = await Product.findByIdAndUpdate(id, data, { new: true });
    return res
      .status(200)
      .send({
        status: true,
        message: "คุณได้แก้ไขข้อมูลสินค้าเรียบร้อย",
        data: edit,
      });
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลสินค้า
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const productdata = await Product.findOne({ _id: id });
    if (!productdata) {
      return res
        .status(200)
        .send({ status: false, message: "ไม่มีข้อมูลสินค้า" });
    }
    if(productdata.image !='')
    {
        await deleteFile(productdata.image)
    }
    if(productdata.spec !='')
    {
        await deleteFile(productdata.spec)
    }
    const deleteproduct = await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleteproduct });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


module.exports.addimage = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("file", 20);
    upload(req, res, async function (err) {
      const id = req.params.id;
      const checkdata = await Product.findById(id);
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
        if(checkdata.image != '')
        {
          await deleteFile(checkdata.image)
        } 
        const data = {
          image:file,
        }
        const edit = await Product.findByIdAndUpdate(id,data,{new:true})
        return res
        .status(200)
        .send({ status: true, message: "ได้เพิ่มไฟล์ใบเสนอราคาแล้ว", data: edit });
      }   
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.addspec = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("file", 20);
    upload(req, res, async function (err) {
      const id = req.params.id;
      const checkdata = await Product.findById(id);
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
        if(checkdata.spec !='')
        {
          await deleteFile(checkdata.spec)
        }

        const data = {
          spec:file,
        }
        const edit = await Product.findByIdAndUpdate(id,data,{new:true})
        return res
        .status(200)
        .send({ status: true, message: "ได้เพิ่มspec แล้ว", data: edit });
      }   
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
