const express = require('express');
const router = express.Router();
const ReportCost = require("../../controllers/report/report.Cost.profit.controller")
const auth = require("../../authentication/userAuth")


router.post("/Report/Cost/:id",auth.all,ReportCost.ReportCost);


module.exports = router;