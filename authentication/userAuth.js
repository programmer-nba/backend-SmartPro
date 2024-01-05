const jwt = require('jsonwebtoken');

const verifyTokenadmin = async(req, res, next)=>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="admin"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }
}

const sales = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="แผนกขาย"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }
}

const all = async (req,res,next) => {
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
const authuser = {
    verifyTokenadmin,
    sales,
    all
};

module.exports = authuser;