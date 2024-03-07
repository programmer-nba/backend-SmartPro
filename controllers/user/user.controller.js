const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.schema");
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
//สร้างไอดี user
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


      if (req.body.username === undefined || req.body.username === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก username" });
      }
      if (req.body.password === undefined || req.body.password === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก password" });
      }
      if (req.body.firstname === undefined || req.body.firstname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก firstname" });
      }
      if (req.body.lastname === undefined || req.body.lastname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก lastname" });
      }
      if (req.body.nickname === undefined || req.body.nickname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก nickname" });
      }
      if (req.body.position === undefined || req.body.position === "") {

        return res.status(400).send({ status: false, message: "กรุณากรอก position" });
      }
      //หาว่า user ซ้ำกันไหม
      const user = await User.findOne({username:req.body.username})
      if(user)
      { 
        return res.status(409).send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }

      const data = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nickname: req.body.nickname,
        position: req.body.position,
        telephone:req.body.telephone,
        image: image,
        email: req.body.email,
      });
      
      const add = await data.save();
      return res
        .status(200)
        .send({
          status: true,
          message: "คุณได้สร้างไอดี user เรียบร้อย",
          data: add,
        });
    });
    ////
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.addexcel = async (req, res) => {
  try {
 
      if (req.body.username === undefined || req.body.username === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก username" });
      }
      if (req.body.password === undefined || req.body.password === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก password" });
      }
      if (req.body.firstname === undefined || req.body.firstname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก firstname" });
      }
      if (req.body.lastname === undefined || req.body.lastname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก lastname" });
      }
      if (req.body.nickname === undefined || req.body.nickname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก nickname" });
      }
      if (req.body.position === undefined || req.body.position === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก position" });
      }
      //หาว่า user ซ้ำกันไหม
      const user = await User.findOne({username:req.body.username})
      if(user)
      { 
        return res.status(409).send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }

      const data = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nickname: req.body.nickname,
        position: req.body.position,
        telephone:req.body.telephone,
        email: req.body.email,
      });
      
      const add = await data.save();
      return res
        .status(200)
        .send({
          status: true,
          message: "คุณได้สร้างไอดี user เรียบร้อย",
          data: add,
        });
    
    ////
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const userdata = await User.find().populate("position");
    if (!userdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล user" });
    }
    return res.status(200).send({ status: true, data: userdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const userdata = await User.findOne({ _id: req.params.id }).populate("position");
    if (!userdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล admin" });
    }
    return res.status(200).send({ status: true, data: userdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล user
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

        //ไฟล์รูป
        image = reqFiles[0]
      }

      if (req.body.username === undefined || req.body.username === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก username" });
      }
      if (req.body.firstname === undefined || req.body.firstname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก firstname" });
      }
      if (req.body.lastname === undefined || req.body.lastname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก lastname" });
      }
      if (req.body.nickname === undefined || req.body.nickname === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก nickname" });
      }
      if (req.body.position === undefined || req.body.position === "") {
        return res.status(400).send({ status: false, message: "กรุณากรอก position" });
      }
      //หาว่า user ซ้ำกันไหม
      const user = await User.findOne({_id:req.params.id})
      if(user)
      { 
        //เช็ค user ซ้ำ
        if(user.username != req.body.username)
        { 
            const duplicateuser = await User.findOne({username:req.body.username})
            if(duplicateuser)
            {
                return  res.status(409).send({ status: false, message: "username นี้มีคนใช้แล้ว" });
            }
        } 
        // เช็คว่ามีการอัพเดทรูปมาไหม ถ้ามาจะได้ลบ
        if(image != '' && user.image!=null)
        {
            await deleteFile(user.image)
        }
      }else{
        res.status(400).send({ status: false, message: "ไม่มีข้อมูล user" });
      }

      const data = {
        username: req.body.username,
        password:  (req.body.password !=undefined && req.body.password!=''? bcrypt.hashSync(req.body.password, 10):user.password), // ถ้าไม่ได้มีการส่ง password มาให้ทำการ ใช้ password เดิม
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nickname: req.body.nickname,
        position: req.body.position,
        telephone:req.body.telephone,
        image: (image !=''? image:user.image), //ถ้ามีส่งรูปมาให้แทนทีดว้ยรูปใหม่เลย แต่ถ้าไม่ได้ส่งมาใช้รูปเก่า
        email:req.body.email,
      }

      const edit = await User.findByIdAndUpdate(req.params.id,data,{new:true})
      return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล user เรียบร้อย",data: edit});
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล user
module.exports.delete = async (req, res) => {
  try {
    const userdata = await User.findOne({ _id: req.params.id });
    if (!userdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล admin" });
    }

    if(userdata.image !='')
    {
        await deleteFile(userdata.image)
    }
    const deleteuser = await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleteuser });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//เพิ่มรายเซ็นต์ของทุก user
module.exports.addsignature = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("signature", 20);
    upload(req, res, async function (err) {
    

      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let signature = '' // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        //เช็คก่อนว่ามี user ไหม
        const user = await User.findOne({_id:req.params.id})
        if(!user)
        {
            return res.status(400).send({ status: false, message: "ไม่มีข้อมูล user" });
        }else{
          if(user.signature !='')
          {
            await deleteFile(user.signature)
          }
        }


        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        signature = reqFiles[0]
      }

      const data = {
        signature: signature,
      }
      const edit = await User.findByIdAndUpdate(req.params.id,data,{new:true})
      return res.status(200).send({status: true,message: "คุณได้เพิ่มรายเซ็นต์ของทุก user เรียบร้อย",data: edit});
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
