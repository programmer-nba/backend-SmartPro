const Insurance = require("../../models/Insurance/lnsurance.schema");

//ดึงข้อมูลทั้งหมด
module.exports.getAll = async (req, res) => {
    try {
        const insurance = await Insurance.find();
        res.status(200).send({status:true, message: "ดึงข้อมูลสำเร็จ", data: insurance});
    } catch (error) {
        res.status(500).send({ status:false ,message: error.message });
    }
};

//แจ้งเคลมสินค้า
module.exports.claim  =  async (req,res)=>{
    try{
        const { order_id,productdetail} = req.body;
        const newInsurance = new Insurance({
            order_id:order_id,
            productdetail:productdetail,
            status:"แจ้งเคลมสินค้า",
        });
        const add = await newInsurance.save();
        res.status(200).send({status:true, message:"แจ้งเคลมสินค้าสำเร็จ" ,data:add});
    } catch (error) {
        res.status(500).send({ status:false , message: error.message });
    }
}

//ส่งให้บริษัทประกัน
module.exports.sendtoinsurance  =  async (req,res)=>{
    try{
        const id =req.params.id;
        const data ={
            status:"ส่งให้บริษัทประกัน",
            cost : req.body.cost
        }
        const update = await Insurance.findByIdAndUpdate(id,data,{new:true});
        res.status(200).send({status:true, message:"ส่งให้บริษัทประกัน" ,data:update});
    } catch (error) {
        res.status(500).send({ status:false,message: error.message });
    }

}
//บริษัทประกันส่งกลับมาให้เรา
module.exports.sendback  =  async (req,res)=>{
    try{
        const id =req.params.id;
        const data ={
            status:"รอจัดส่งให้ลูกค้า",
            cost2 : req.body.cost2
        }
        const update = await Insurance.findByIdAndUpdate(id,data,{new:true});
        res.status(200).send({status:true,message:"รอจัดส่งให้ลูกค้า" ,data:update});
    } catch (error) {
        res.status(500).send({ status:false,message: error.message });
    }
}

//สินค้าส่งให้ลูกค้า
module.exports.sendtocustomer  =  async (req,res)=>{
    try{
        const id =req.params.id;
        const data ={
            status:"เคลมสินค้าสำเร็จ",
            received : req.body.received
        }
        const update = await Insurance.findByIdAndUpdate(id,data,{new:true});
        res.status(200).send({status:true , message:"เคลมสินค้าสำเร็จ" ,data:update});
    } catch (error) {
        res.status(500).send({ status:false , message: error.message });
    }
}
