const express = require('express');
const router = express.Router();
const deliverynote = require("../../controllers/deliverynote/deliverynote.controller")
const auth = require("../../authentication/userAuth")
const newAuth = require("../../authentication/newAuth")

//อนุมัติใบส่งของ
router.put('/accept/:id',newAuth.managerdeliverynote,deliverynote.accept)

module.exports = router;