const express = require('express');
const router = express.Router();
const User = require("../../controllers/user/user.controller")
const auth = require("../../authentication/userAuth")

//สร้างรหัส user
router.post('/',auth.verifyTokenadmin,User.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.verifyTokenadmin,User.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,User.getbyid)
// แก้ไขข้อมูล user 
router.put('/:id',auth.all,User.edit)
// ลบข้อมูล user
router.delete('/:id',auth.verifyTokenadmin,User.delete)


module.exports = router;