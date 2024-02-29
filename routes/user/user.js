const express = require('express');
const router = express.Router();
const User = require("../../controllers/user/user.controller")
const auth = require("../../authentication/userAuth")

//สร้างรหัส user
router.post('/',auth.verifyTokenadmin,User.add)

//สร้างรหัส execl
router.post('/excel',auth.all,User.addexcel)


//ดึงข้อมูลทั้งหมด
router.get('/',auth.verifyTokenadmin,User.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,User.getbyid)
// แก้ไขข้อมูล user 
router.put('/:id',auth.all,User.edit)
// ลบข้อมูล user
router.delete('/:id',auth.verifyTokenadmin,User.delete)

//เพิ่มรายเซ็น user    
router.put('/signature/:id',auth.all,User.addsignature)


module.exports = router;