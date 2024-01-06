const Product = require("../../models/product/product.schema");

//เพิ่ม product supplier
module.exports.add = async (req, res) => {
  try {
    const product_id = req.params.id
    const {supplier_id,price} = req.body
     //เช็ค product ว่ามีไหม?
     const product = await Product.findOne({_id:product_id});
     if(!product){
         return res.status(200).send({ status: false, message: "ไม่มีข้อมูล product" });
     }
     const duplicate = product.supplier.find(item=>item.supplier_id == supplier_id)
     if(duplicate !=undefined)
     {
        return res.status(200).send({ status: false, message: "มีข้อมูลsupplier ในproductนี้อยู่แล้ว" });
     }
    const supplier = product.supplier;
    const data ={
        supplier_id : supplier_id,
        price : price,
    };
    supplier.push(data)
    const edit = await Product.findByIdAndUpdate(product_id,{supplier:supplier},{new:true})
    return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลสินค้า supplier แล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลตาม product supplier
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const productdata = await Product.find({"supplier.supplier_id":id});
    if (!productdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล productdata " });
    }
    return res.status(200).send({ status: true, data: productdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล product supplier
module.exports.edit = async (req, res) => {
    try {
        const product_id = req.params.id
        const {supplier_id,price} = req.body
         //เช็ค product ว่ามีไหม?
         const product = await Product.findOne({_id:product_id});
         if(!product){
             return res.status(200).send({ status: false, message: "ไม่มีข้อมูล product" });
         }
        const supplier = product.supplier.filter(item=>item.supplier_id != supplier_id)
        const data ={
            supplier_id : supplier_id,
            price : price,
        };
        supplier.push(data)
        const edit = await Product.findByIdAndUpdate(product_id,{supplier:supplier},{new:true})
        return res.status(200).send({status: true,message:"คุณได้แก้ไขข้อมูลสินค้า supplier แล้ว",data: edit});
      } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
      }
};

//ลบข้อมูล product supplier
module.exports.delete = async (req, res) => {
  try {
    const product_id = req.params.id
    const {supplier_id} = req.body
    //เช็ค product ว่ามีไหม?
    const product = await Product.findOne({_id:product_id});
    if(!product){
        return res.status(200).send({ status: false, message: "ไม่มีข้อมูล product" });
    }
    const supplier = product.supplier.filter(item=>item.supplier_id != supplier_id)
    const edit = await Product.findByIdAndUpdate(product_id,{supplier:supplier},{new:true})
    return res.status(200).send({ status: true, message: "ลบข้อมูลสินค้าสำเร็จ", data: edit });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
