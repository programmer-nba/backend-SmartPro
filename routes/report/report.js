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

//report การส่งของสินค้าให้ลูกค้า
router.post("/reportdelivery",auth.all,Report.reportdelivery);
//report สินค้าค้างสต็อก
router.post("/reportstock",auth.all,Report.reportstock);

//report supplier
router.post("/reportsupplier",auth.all,Report.reportsupplier);

//report  กำไรและค่าใช้จ่าย
router.post("/reportprofit",auth.all,Report.reportprofit);

//report สรุปยอดขายวางบิล
router.post("/reportbill",auth.all,Report.reportinvoice);

//report กำไร -ขาดทุน  และ ค่าภาษีนำเข้า
router.post("/reportprofitloss",auth.all,Report.reportprofitandloss);
module.exports = router;