const express = require('express');
const router = express.Router();
const Report = require("../../controllers/report/report.controller")
const auth = require("../../authentication/userAuth")

//จำนวนใบเสนอราคา
router.get('/getquotationprice/',auth.all,Report.reportquotationprice)
// รายงาน ใบเสนอราคา
router.get("/getquotation",auth.all,Report.reportquotation)

router.post("/getquotation",auth.all,Report.reportquotationbyid)

//รายงาน ยอดขาย
router.post("/getreportprice",auth.all,Report.reportprice)
router.get("/getreportprice2",auth.all,Report.reportpriceyear)
//รายงาน sale 
router.post("/getreportsale",auth.all,Report.reportsaleall)
// dashboard 
router.post("/getdashboardadmin",auth.all,Report.dashboardadmin);
// dashboard sale
router.post("/getdashboardsale/",auth.all,Report.dashboardsale);
module.exports = router;