const SignatiureAuthorized = require("../../models/information/signatureauthorized.schama");
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

//เพิ่มลายเซ็นต์ผู้ลงนาม
module.exports.add = async (req, res) => {
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

      const data = new SignatiureAuthorized({
        name: req.body.name,
        signature: image,
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณเพิ่มลายเซ็นต์ผู้ลงนามเรียบร้อยแล้ว",data: add});
      
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const signature = await SignatiureAuthorized.find();
    if (!signature) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: signature });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลลายเซ็นต์ผู้ลงนาม
module.exports.edit = async (req, res) => {
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
        const id = req.params.id
        const signature = await SignatiureAuthorized.findById(id)
    if (!signature) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }

    const data = {
        name: req.body.name,
        signature: image,
    }
    const edit = await SignatiureAuthorized.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลลายเซ็นต์ผู้ลงนามเรียบร้อยแล้ว",data: edit});
   
      
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลบัญชีธนาคารที่วางบิล
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const signature = await SignatiureAuthorized.findOne({ _id: id });
    if (!signature) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletesignature = await SignatiureAuthorized.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesignature });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
