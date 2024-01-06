const Product = require("../../models/product/product.schema");
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
      const { name, brand, producttype} = req.body;
      const data = new Product({
        name: name, //(ชื่อสินค้า)
       
        brand: brand, //(แบรนด์)
        image: image, //(รูปภาพ)
        producttype: producttype, //(ประเภทสินค้า)
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

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const productdata = await Product.find()
      .populate({ path: "brand", select: "name" })
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier.supplier_id", select: "name" });
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
      .populate({ path: "brand", select: "name" })
      .populate({ path: "producttype", select: "name" })
      .populate({ path: "supplier.supplier_id", select: "name" });
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
    
      // เช็คว่ามีการอัพเดทรูปมาไหม ถ้ามาจะได้ลบ
      if(image != '' && productdata.image!=null)
      {
          await deleteFile(productdata.image)
      }
   
    const { name, brand, producttype} = req.body;

    const data = {
      name: name, //(ชื่อสินค้า)
      brand: brand, //(แบรนด์)
      image: image, //(รูปภาพ)
      producttype: producttype, //(ประเภทสินค้า)
    };
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
    const deleteproduct = await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleteproduct });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
