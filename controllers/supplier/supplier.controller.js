const Supplier = require("../../models/supplier/supplier.schema");

//เพิ่ม supplier
module.exports.add = async (req, res) => {
  try {
    const {name,typeofbusiness,categoryofproducts,email,contact,telephone,address,country,remake,website,taxid,user_id,secret} = req.body
    
    const checktaxid = await Supplier.findOne({taxid:taxid})
    // ถ้าหาเจอ ให้ res
    if (checktaxid) {
      return res.status(409).send({ status: false, message: "เลขประจำตัวผู้เสียภาษีซ้ำๆกัน กรุณากรอกใหม่" });
    }
    const data = new Supplier({
      name:name,  //(ชื่อบริษัทของ supplier)
      typeofbusiness:typeofbusiness,
      categoryofproducts:categoryofproducts,
      address:address,  //(ที่อยู่)
      country:country,
      telephone:telephone, //(เบอร์โทรศัพท์)
      email:email, // (อีเมล์)
      contact:contact, //(ผู้ติดต่อ)
      website:website, //(เว็บไซต์)
      remake:remake,
      taxid:taxid,
      user_id:user_id,
      secret:secret

      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูล supplier",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//เพิ่ม supplier จาก excel
module.exports.addexcel = async (req, res) => {
  try {
    const {name,typeofbusiness,categoryofproducts,email,contact,telephone,address,country,remake,website,taxid,user_id,secret} = req.body
    const checktaxid = await Supplier.findOne({taxid:taxid})
    // ถ้าหาเจอ ให้ res
    if (checktaxid) {
      return res.status(409).send({ status: false, message: "เลขประจำตัวผู้เสียภาษีซ้ำๆกัน กรุณากรอกใหม่" });
    }
    const data = new Supplier({
      name:name,  //(ชื่อบริษัทของ supplier)
      typeofbusiness:typeofbusiness,
      categoryofproducts:categoryofproducts,
      address:address,  //(ที่อยู่)
      country:country,
      telephone:telephone, //(เบอร์โทรศัพท์)
      email:email, // (อีเมล์)
      contact:contact, //(ผู้ติดต่อ)
      website:website, //(เว็บไซต์)
      remake:remake,
      taxid:taxid,
      user_id:user_id,
      secret:secret
      });
    const add = await data.save();
    return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูล supplier",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }

}

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const supplierdata = await Supplier.find().populate('user_id').populate({ path: "typeofbusiness"}).populate({ path: "categoryofproducts"});
    if (!supplierdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    return res.status(200).send({ status: true, data: supplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const supplierdata = await Supplier.findOne({ _id: req.params.id }).populate('user_id').populate({ path: "typeofbusiness"}).populate({ path: "categoryofproducts"});
    if (!supplierdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    return res.status(200).send({ status: true, data: supplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล supplier
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const supplierdata = await Supplier.findById(id)
    if (!supplierdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    const {name,typeofbusiness,categoryofproducts,email,contact,telephone,address,country,remake,website,taxid,user_id,secret} = req.body    
    if(supplierdata !=taxid)
    {
      const checktaxid = await Supplier.findOne({taxid:taxid})
      // ถ้าหาเจอ ให้ res
      if (checktaxid) {
        return res.status(409).send({ status: false, message: "เลขประจำตัวผู้เสียภาษีซ้ำๆกัน กรุณากรอกใหม่" });
      }
    }  
    
    const data = {
      name:name,  //(ชื่อบริษัทของ supplier)
      typeofbusiness:typeofbusiness,
      categoryofproducts:categoryofproducts,
      address:address,  //(ที่อยู่)
      country:country,
      telephone:telephone, //(เบอร์โทรศัพท์)
      email:email, // (อีเมล์)
      contact:contact, //(ผู้ติดต่อ)
      website:website, //(เว็บไซต์)
      remake:remake,
      taxid:taxid,
      user_id:user_id,
      secret:secret
    }
    const edit = await Supplier.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล supplier เรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล supplier
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const supplierdata = await Supplier.findOne({ _id: id });
    if (!supplierdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล admin" });
    }
    const deletesupplier = await Supplier.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//ดึงข้อมูลตาม user_id
module.exports.getbyuserid = async (req, res) => {
  try {
    const user_id = req.params.id
    const supplierdata = await Supplier.find({user_id:user_id}).populate('user_id').populate({ path: "typeofbusiness"}).populate({ path: "categoryofproducts"});
    if (!supplierdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    return res.status(200).send({ status: true, data: supplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//เพิ่มชื่อ user_id ใน supplier
// module.exports.edit_user_id = async (req, res) => {
//   try {
//     const user_id = req.body.user_id
//     const edit = await Supplier.updateMany({user_id:undefined},{user_id:user_id,secret:false})
//     return res.status(200).send({ status: true, message: "แก้ไขข้อมูลคนขายเรียบร้อย", data: edit });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// } 
