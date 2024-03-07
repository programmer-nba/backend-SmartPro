const jwt = require('jsonwebtoken');


const dashboardadmin = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardadmin == true ||decoded.permissions?.dashboardmanager == true || decoded.permissions?.dashboardreport == true ){
            req.users = decoded.data
            next();
        }else{
           return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
           
    }catch (err){
        return res.status(500).send({error:err.message})
    }
}

const createuser = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.createuser == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const setposition = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'" 
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.setposition == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    } catch (err){
        return res.status(500).send({error:err.message})
    }
}

const information = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.information == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    } catch (err){
        return res.status(500).send({error:err.message})
    }
}

const typeproduct = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.typeproduct == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const typebusiness = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.typebusiness == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const typebusinesscustomer = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.typebusinesscustomer == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const typelndustry = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.typelndustry == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardsale = async (req,res,next) =>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardsale == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const openorder = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.openorder == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const compareprice = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.compareprice == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const quotation = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.quotation == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dealwork = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dealwork == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const produt = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.produt == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const customer = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.customer == true || decoded.customerall == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const supplier = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.supplier == true ||decoded.permissions?.supplierall == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardprocurement = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'" 
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardprocurement == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const openpurchaseorder = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.openpurchaseorder == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const insurance = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.insurance == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardlogistic = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardlogistic == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const delivery = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.delivery == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardaccount = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardaccount == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const invoice = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.invoice == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const loan = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.loan == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardreport = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardreport == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportquotation = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportquotation == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportprice = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportprice == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportsale = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportsale == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportdeliverycustomers = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportdeliverycustomers == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportproductstock = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportproductstock == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportsupplier = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportsupplier == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportprofit = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportprofit == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportbill = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportbill == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportcashflow = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportcashflow == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const reportprofitlossaccount = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.reportprofitlossaccount == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const dashboardmanager = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.dashboardmanager == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const managerquotation = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded?.permissions?.managerquotation == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const managerpurchaseorder = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded?.permissions?.managerpurchaseorder == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const managerdeliverynote = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.managerdeliverynote == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const managerinvoice = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.managerinvoice == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const orderall = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.orderall == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const supplierall = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.supplierall == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
    }
}

const customerall = async (req,res,next) =>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'ไม่มี token'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        if(decoded.permissions?.customerall == true ){
            req.users = decoded.data
            next();
        }
        else{
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }
    catch (err){
        return res.status(500).send({error:err.message})
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
    dashboardadmin,
    createuser,
    setposition,
    information,
    typeproduct,
    typebusiness,
    typebusinesscustomer,
    typelndustry,
    dashboardsale,
    openorder,
    compareprice,
    quotation,
    dealwork,
    produt,
    customer,
    supplier,
    dashboardprocurement,
    openpurchaseorder,
    insurance,
    dashboardlogistic,
    delivery,
    dashboardaccount,
    invoice,
    loan,
    dashboardreport,
    reportquotation,
    reportprice,
    reportsale,
    reportdeliverycustomers,
    reportproductstock,
    reportsupplier,
    reportprofit,
    reportbill,
    reportcashflow,
    reportprofitlossaccount,
    dashboardmanager,
    managerquotation,
    managerpurchaseorder,
    managerdeliverynote,
    managerinvoice,
    orderall,
    supplierall,
    customerall,
    all
};
module.exports = authuser;