const express = require('express');
const router = express.Router();
const User = require("../../controllers/user/user.controller")
const newAuth = require("../../authentication/newAuth")


//สร้างรหัส user
router.post('/',newAuth.createuser,User.add)

//สร้างรหัส execl
router.post('/excel',newAuth.createuser,User.addexcel)


//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,User.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,User.getbyid)
// แก้ไขข้อมูล user 
router.put('/:id',newAuth.all,User.edit)
// ลบข้อมูล user
router.delete('/:id',newAuth.createuser,User.delete)

//เพิ่มรายเซ็น user    
router.put('/signature/:id',newAuth.createuser,User.addsignature)


module.exports = router;