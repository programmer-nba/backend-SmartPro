const express = require('express');
const router = express.Router();
const Report = require("../../controllers/report/report.controller")
const auth = require("../../authentication/userAuth")

//จำนวนใบเสนอราคา
router.get('/getquotationprice/',auth.all,Report.reportquotationprice)
// รายงาน ใบเสนอราคา
router.get("/getquotation",auth.all,Report.reportquotation)

module.exports = router;