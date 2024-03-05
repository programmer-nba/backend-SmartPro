const express = require('express');
const router = express.Router();
const deliverynote = require("../../controllers/deliverynote/deliverynote.controller")
const auth = require("../../authentication/userAuth")

//อนุมัติใบส่งของ
router.put('/accept/:id',auth.manager,deliverynote.accept)

module.exports = router;