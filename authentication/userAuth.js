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
        if(decoded.position ==="admin" || decoded.position ==="Manager Department" ){
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
        if(decoded.position ==="Sales Department" || decoded.position ==="Manager Department"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }
}

const procurement = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="Procurement Department" || decoded.position ==="Logistic & Shipping Department" || decoded.position ==="Manager Department"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }
}
const manager = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="Manager Department"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    } 
}
const adminandmanager = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="Manager Department" || decoded.position ==="admin"){
            req.users = decoded.data
            next();
        }else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }
}

//Report & Analysis
const report = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.position ==="Report & Analysis" || decoded.position ==="Manager Department"){
            req.users = decoded.data
            next();
        }
        else{
            res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }

    }catch (err){
        return res.status(500).send({error:err})
    }
}

// Account Department
const account = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
         // ทำการยืนยันสิทธิ์ token
         const decoded =  jwt.verify(token,secretKey)
         if(decoded.position ==="Account Department" || decoded.position ==="Manager Department"){
             req.users = decoded.data
             next();
         }else{
             return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
         }
         
         
     }catch (err){
         return res.status(500).send({error:err})
     }
 }

//Logistic & Shipping Department
const logistic = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
         // ทำการยืนยันสิทธิ์ token
         const decoded =  jwt.verify(token,secretKey)
         if(decoded.position ==="Logistic & Shipping Department" || decoded.position ==="Manager Department"){
             req.users = decoded.data
             next();
         }else{
            return  res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
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
    adminandmanager,
    verifyTokenadmin,
    manager,
    sales,
    procurement,
    account,
    logistic,
    report,
    all
};

module.exports = authuser;