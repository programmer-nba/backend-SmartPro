const express = require('express');
const router = express.Router();
const Report = require("../../controllers/report/report.controller")
const newAuth = require("../../authentication/newAuth")


//จำนวนใบเสนอราคา
router.get('/getquotationprice/',newAuth.reportquotation,Report.reportquotationprice)
// รายงาน ใบเสนอราคา
router.get("/getquotation",newAuth.reportquotation,Report.reportquotation)

router.post("/getquotation",newAuth.reportquotation,Report.reportquotationbyid)

//รายงาน ยอดขาย
router.post("/getreportprice",newAuth.reportprice,Report.reportprice)
router.get("/getreportprice2",newAuth.reportprice,Report.reportpriceyear)
//รายงาน sale 
router.post("/getreportsale",newAuth.reportsale,Report.reportsaleall)
// dashboard 
router.post("/getdashboardadmin",newAuth.dashboardadmin,Report.dashboardadmin);
// dashboard sale
router.post("/getdashboardsale/",newAuth.dashboardsale,Report.dashboardsale);

//report การส่งของสินค้าให้ลูกค้า
router.post("/reportdelivery",newAuth.reportdeliverycustomers,Report.reportdelivery);
//report สินค้าค้างสต็อก
router.post("/reportstock",newAuth.reportproductstock,Report.reportstock);

//report supplier
router.post("/reportsupplier",newAuth.reportsupplier,Report.reportsupplier);

//report  กำไรและค่าใช้จ่าย
router.post("/reportprofit",newAuth.reportprofit,Report.reportprofit);

//report สรุปยอดขายวางบิล
router.post("/reportbill",newAuth.reportbill,Report.reportinvoice);

//report กำไร -ขาดทุน  และ ค่าภาษีนำเข้า
router.post("/reportprofitloss",newAuth.reportprofit,Report.reportprofitandloss);

//report Cash Flow 
router.post("/reportcashflow",newAuth.reportcashflow,Report.reportcashflow);


//report กำไร -ขาดทุน  และ ค่าภาษีนำเข้า
router.post("/reportprofitlossaccount",newAuth.reportprofitlossaccount,Report.reportprofitandloss);

//dashboard  Procurement Department
router.post("/getdashboardprocurement",newAuth.dashboardprocurement,Report.dashboardprocurement);

//dashboard  Logistic & Shipping Department
router.post("/getdashboardlogistic",newAuth.dashboardlogistic,Report.dashboardlogistic);

//dashboard  Account Department
router.post("/getdashboardaccount",newAuth.dashboardaccount,Report.dashboardaccount);



module.exports = router;