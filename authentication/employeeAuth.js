const jwt = require('jsonwebtoken');

//เช็ค token partner
tokenemployee = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.roles === "employee"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
                
    }catch (err){
        console.log(err)
        return res.status(500).send({error :err})
    }
};
//เช็ค token partner
all = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        req.users = decoded.data
        next()    
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
}
const authemployee = {
    tokenemployee,
    all
};

module.exports = authemployee;