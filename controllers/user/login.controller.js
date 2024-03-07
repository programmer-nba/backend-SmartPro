const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.schema");

//ล็อคอิน
module.exports.login = async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.username ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก username" })
        }
        if(req.body.password === undefined || req.body.password ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก password" })
        }
        const username = req.body.username
        const password = req.body.password
        
        //เช็คว่า user นี้มีในระบบไหม
        const login = await User.findOne({username:username}).populate("position")
        if(login)
        {
            //เช็ค password
            bcryptpassword = await bcrypt.compare(password,login.password)
            if(bcryptpassword)
            {
                //สร้าง signaturn
                const payload = {
                    _id:login._id,
                    username:login.username,
                    firstname:login.firstname,
                    lastname:login.lastname,
                    nickname:login.nickname,
                    position:login.position?.position,
                    permissions:login.position?.permissions
                }
                const secretKey = process.env.SECRET_KEY
                const token = jwt.sign(payload,secretKey,{expiresIn:"10D"})
                return res.status(200).send({ status: true, data: payload, token: token})

            }else{
                return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
            }
        }
        else{
            return res.status(200).send({ status: false, message: "ไม่มี user นี้ในระบบ" })
        }

      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      } 
}
// get me
module.exports.getme = async (req,res) =>{
    try {  
        const token = req.headers['token'];
        if(!token){
            return res.status(403).send({status:false,message:'Not authorized'});
        }
        const decodded =jwt.verify(token,process.env.SECRET_KEY)
        const dataResponse = {
            _id:decodded._id,
            username:decodded.username,
            firstname:decodded.firstname,
            lastname:decodded.lastname,
            nickname:decodded.nickname,
            position:decodded.position,
            permissions:decodded.permissions
        }  
        return res.status(200).send({status:true,data:dataResponse});
    } catch (error) {
          console.log(error);
          return res.status(500).send({status:false,error:error.message});
    }
}