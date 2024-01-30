const Quotation = require("../../models/quotation/quotation.schema");
const Producttype = require("../../models/product/producttype.schema");
const User = require("../../models/user/user.schema");
module.exports.reportquotationprice = async (req, res) => {
  try {
    //รายเดือน
    const monthlyQuotationCount = await Quotation.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }, // ใช้ $month เพื่อรวมตามเดือน
            year: { $year: "$createdAt" }, // ใช้ $year เพื่อรวมตามปี
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // ปรับ format ข้อมูลให้เหมาะสม
    const monthData = monthlyQuotationCount.map((item) => ({
      month: item._id.month,
      year: item._id.year,
      count: item.count,
    }));
    monthData.sort((a, b) => {
      // แยกเป็นปีและเดือน
      const yearA = a.year;
      const monthA = a.month;

      const yearB = b.year;
      const monthB = b.month;

      // เรียงตามปีก่อน
      if (yearA !== yearB) {
        return yearA - yearB;
      }

      // เรียงตามเดือนถัดมา
      return monthA - monthB;
    });

    /// รายไตรมาส
    const quarterlyQuotationCount = await Quotation.aggregate([
      {
        $group: {
          _id: {
            quarter: {
              $cond: {
                if: { $lte: [{ $month: "$createdAt" }, 3] }, // ไตรมาส 1
                then: 1,
                else: {
                  $cond: {
                    if: { $lte: [{ $month: "$createdAt" }, 6] }, // ไตรมาส 2
                    then: 2,
                    else: {
                      $cond: {
                        if: { $lte: [{ $month: "$createdAt" }, 9] }, // ไตรมาส 3
                        then: 3,
                        else: 4, // ไตรมาส 4
                      },
                    },
                  },
                },
              },
            },
            year: { $year: "$createdAt" }, // ใช้ $year เพื่อรวมตามปี
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // ปรับ format ข้อมูลให้เหมาะสม
    const quarterlyData = quarterlyQuotationCount.map((item) => ({
      quarter: item._id.quarter,
      year: item._id.year,
      count: item.count,
    }));

    quarterlyData.sort((a, b) => {
      // แยกเป็นปีและไตรมาส
      const yearA = a.year;
      const quarterA = a.quarter;

      const yearB = b.year;
      const quarterB = b.quarter;

      // เรียงตามปีก่อน
      if (yearA !== yearB) {
        return yearA - yearB;
      }

      // เรียงตามไตรมาสถัดมา
      return quarterA - quarterB;
    });

    //รายปี
    const yearlyQuotationCount = await Quotation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // ใช้ $year เพื่อรวมตามปี
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // ปรับ format ข้อมูลให้เหมาะสม
    const yearData = yearlyQuotationCount.map((item) => ({
      year: item._id.year,
      count: item.count,
    }));
    yearData.sort((a, b) => a.year - b.year);
    //ของ sale

    const sale = await Quotation.aggregate([
      {
        $group: {
          _id: "$user_id",
          yearquotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstname: "$userDetails.firstname",
          lastname: "$userDetails.lastname",
          yearquotations: 1,
        },
      },
    ]);

    /////////////////
    const currentMonth = new Date().getMonth() + 1; // หาเดือนปัจจุบัน
    const currentQuarter = Math.ceil(currentMonth / 3); // หาไตรมาสปัจจุบัน
    const currentYear = new Date().getFullYear(); // หาปีปัจจุบัน

    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0); // 0 คือวันสุดท้ายของเดือนก่อนหน้า
    const sale_month = await Quotation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfMonth,
            $lt: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$user_id",
          yearquotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstname: "$userDetails.firstname",
          lastname: "$userDetails.lastname",
          yearquotations: 1,
        },
      },
    ]);
    sale_month.sort((a, b) => a.yearquotations - b.yearquotations);
    const firstDayOfQuarter = new Date(
      currentYear,
      (currentQuarter - 1) * 3,
      1
    );
    const lastDayOfQuarter = new Date(currentYear, currentQuarter * 3, 0);
    const sale_quarter = await Quotation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfQuarter,
            $lt: lastDayOfQuarter,
          },
        },
      },
      {
        $group: {
          _id: "$user_id",
          yearquotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstname: "$userDetails.firstname",
          lastname: "$userDetails.lastname",
          yearquotations: 1,
        },
      },
    ]);
    sale_quarter.sort((a, b) => a.yearquotations - b.yearquotations);
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const lastDayOfYear = new Date(currentYear, 11, 31);
    const sale_year = await Quotation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfYear,
            $lt: lastDayOfYear,
          },
        },
      },
      {
        $group: {
          _id: "$user_id",
          yearquotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstname: "$userDetails.firstname",
          lastname: "$userDetails.lastname",
          yearquotations: 1,
        },
      },
    ]);
    sale_year.sort((a, b) => a.yearquotations - b.yearquotations);
    return res.status(200).json({
      status: true,
      month: monthData,
      quarterly: quarterlyData,
      year: yearData,
      sale: sale,
      sale_month: sale_month,
      sale_quarter: sale_quarter,
      sale_year: sale_year,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.reportquotation = async (req, res) => {
  try {
    const yearquotation = [];
    const quarterquotation = [];
    const monthquotation = [];

    const quotationdata = await Quotation.find().populate("user_id").populate("customer_id");
    quotationdata.forEach((items) => {
      // ส่วนของรายปี แต่ละปี
      const year = new Date(items.createdAt).getFullYear();
      const find = yearquotation.findIndex((item) => item.year == year);
      if (find != -1) {
        yearquotation[find].count += 1;
        yearquotation[find].totalprofit += items.alltotal;

        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status == "ดีลงานผ่าน") {
          yearquotation[find].pass += 1;
        }
        
        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status =="ดีลงานไม่ผ่าน") {
          yearquotation[find].nopass += 1;
        }
      } else {
        yearquotation.push({
          year: year,
          count: 1,
          totalprofit: items.alltotal,
          pass:(items.statusdealdetail[items.statusdealdetail?.length - 1]?.status == "ดีลงานผ่าน"? 1: 0),
          nopass:(items.statusdealdetail[items.statusdealdetail?.length - 1]?.status == "ดีลงานไม่ผ่าน"? 1: 0)
        
        });
      }

      //ส่วนของรายไตรมาส
      const month = new Date(items.createdAt).getMonth() + 1; // เดือนเริ่มที่ 1
      const quarter = Math.ceil(month / 3);
    
      // หา index ของไตรมาสนั้น ๆ
      const findQuarter = quarterquotation.findIndex(item => item.year === year && item.quarter === quarter);

      if (findQuarter !== -1) {
        // ถ้ามีไตรมาสนั้น ๆ แล้ว
          quarterquotation[findQuarter].count += 1;
          quarterquotation[findQuarter].totalprofit += items.alltotal;

        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน") {
            quarterquotation[findQuarter].pass += 1;
        }

        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน") {
            quarterquotation[findQuarter].nopass += 1;
        }
    } else {
        // ถ้ายังไม่มีไตรมาสนั้น ๆ
        quarterquotation.push({
            year: year,
            quarter: quarter,
            count: 1,
            totalprofit: items.alltotal,
            pass: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน" ? 1 : 0),
            nopass: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน" ? 1 : 0),
        });

    }
            // ส่วนของรายเดือน 
            const findMonth = monthquotation.findIndex(item => item.year === year && item.month === month);
            if (findMonth !== -1) {
                // ถ้ามีรายเดือนนั้น ๆ แล้ว
                monthquotation[findMonth].count += 1;
                monthquotation[findMonth].totalprofit += items.alltotal;
    
            if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน") {
                monthquotation[findMonth].pass += 1;
              }
    
              if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน") {
                  monthquotation[findMonth].nopass += 1;
              }
        } else {
            // ถ้ายังไม่มีรายเดือนนั้น ๆ
            monthquotation.push({
                year: year,
                month: month,
                count: 1,
                totalprofit: items.alltotal,
                pass: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน" ? 1 : 0),
                nopass: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน" ? 1 : 0),
            });
          }
    });
    // เรียง yearquotation
    yearquotation.sort((a, b) => new Date(b.year, 0) - new Date(a.year, 0));

    // เรียง quarterquotation
    quarterquotation.sort((a, b) => {
      const aDate = new Date(`${a.year}-${a.quarter * 3 - 2}`);
      const bDate = new Date(`${b.year}-${b.quarter * 3 - 2}`);
      return bDate - aDate;
    });

    // เรียง monthquotation
    monthquotation.sort((a, b) => {
      const aDate = new Date(`${a.year}-${a.month}`);
      const bDate = new Date(`${b.year}-${b.month}`);
      return bDate - aDate;
    });

    //ส่วนของ report ตามเดือน
    // เดือนปัจจุบัน
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // กรองใบเสนอราคาในเดือนปัจจุบัน
    const currentMonthData = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);

    // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
    const totalquotation = currentMonthData.length;

    // ยอดรวมราคาของใบเสนอราคาในเดือนปัจจุบัน
    const pricequotation = currentMonthData.reduce((total, item) => total + calculatorrate(item.alltotal,item.rateprice), 0);

    // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
    const passedJobs = currentMonthData.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานผ่าน").length;

    // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
    const notPassedJobs = currentMonthData.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานไม่ผ่าน").length;

    const dashboard ={
      totalquotation:totalquotation,
      pricequotation:pricequotation,
      passedJobs:passedJobs,
      notPassedJobs:notPassedJobs
    }

    //รายงาน ใบเสนอราคาของ Sales Department
    const salequotation = [];
    currentMonthData.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.user_id?._id)) == JSON.parse(JSON.stringify(items.user_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.alltotal,items.rateprice);
    
        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน") {
          salequotation[find].passedJobs += 1;
        } else if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน") {
          salequotation[find].notPassedJobs += 1;
        }
      } else {
        salequotation.push({
          user_id: items.user_id?._id,
          firstname: items.user_id?.firstname,
          lastname:items.user_id?.lastname,
          nickname:items.user_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.alltotal,items.rateprice),
          passedJobs: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน" ? 1 : 0),
          notPassedJobs: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน" ? 1 : 0),
        });
      }

    })

    //รายงานรายละเอียดที่ขายไม่ผ่านใบเสนอราคา
    const nopassquotation = currentMonthData.filter(item=>item?.statusdealdetail[item.statusdealdetail?.length - 1]?.status == "ดีลงานไม่ผ่าน");


    const header = convertToThaiMonth(currentMonth)+" "+currentYear;
    return res.status(200).json({ status: true, header:header, yearquotation: yearquotation,quarter:quarterquotation,monthquotation:monthquotation ,dashboard:dashboard,
      salequotation:salequotation,nopassquotation:nopassquotation
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.reportquotationbyid = async (req,res)=>{
  try {
    const id = req.body.id
    const quotationdata = await Quotation.find().populate("user_id").populate("customer_id");
    let currentMonthData ='';
    let header = '';
    if(id =="month")
    {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      currentMonthData = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
      header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentMonthData = quotationdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentMonthData = quotationdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentMonthData = quotationdata.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        /// ตั้งหัว
        // Format header based on start and end date
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(startMonth)} ${startYear} ถึง ${endDay} ${convertToThaiMonth(endMonth)} ${endYear}`;
      }else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
  
    // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
    const totalquotation = currentMonthData.length;

    // ยอดรวมราคาของใบเสนอราคาในเดือนปัจจุบัน
    const pricequotation = ( currentMonthData.length >0 ? currentMonthData.reduce((total, item) => total + calculatorrate(item.alltotal,item.rateprice), 0):0);
    // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
    const passedJobs = currentMonthData.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานผ่าน").length;

    // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
    const notPassedJobs = currentMonthData.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานไม่ผ่าน").length;

    const dashboard ={
      totalquotation:totalquotation,
      pricequotation:pricequotation,
      passedJobs:passedJobs,
      notPassedJobs:notPassedJobs
    }

    //รายงาน ใบเสนอราคาของ Sales Department
    const salequotation = [];
    currentMonthData.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.user_id?._id)) == JSON.parse(JSON.stringify(items.user_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.alltotal,items.rateprice);
    
        if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน") {
          salequotation[find].passedJobs += 1;
        } else if (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน") {
          salequotation[find].notPassedJobs += 1;
        }
      } else {
        salequotation.push({
          user_id: items.user_id?._id,
          firstname: items.user_id?.firstname,
          lastname:items.user_id?.lastname,
          nickname:items.user_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.alltotal,items.rateprice),
          passedJobs: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน" ? 1 : 0),
          notPassedJobs: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานไม่ผ่าน" ? 1 : 0),
        });
      }

    })

    //รายงานรายละเอียดที่ขายไม่ผ่านใบเสนอราคา
    const nopassquotation = currentMonthData.filter(item=>item?.statusdealdetail[item.statusdealdetail?.length - 1]?.status == "ดีลงานไม่ผ่าน");
    return res.status(200).json({ status: true, header:header,dashboard:dashboard,salequotation:salequotation,nopassquotation:nopassquotation});
  }catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
  
  
}


module.exports.reportprice = async (req,res)=>{
  try{
      const id = req.body.id
      const quotationdata = await Quotation.find().populate('customer_id').populate('productdetail.product_id').populate('user_id'); 

      let currentdata = ''
      let header = ''

    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = quotationdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = quotationdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = quotationdata.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        /// ตั้งหัว
        // Format header based on start and end date
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(startMonth)} ${startYear} ถึง ${endDay} ${convertToThaiMonth(endMonth)} ${endYear}`;
      }else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= quotationdata
      header= "ทั้งหมด"
    }
    currentdata = currentdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");

    const reportcustomersale = []; 
    currentdata.forEach((items)=>{
      const find = reportcustomersale.findIndex((item) => JSON.parse(JSON.stringify(item.customer_id?._id)) == JSON.parse(JSON.stringify(items.customer_id?._id)));
      if (find !== -1) {
        reportcustomersale[find].count += (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? 1 :0);
        reportcustomersale[find].totalAmount += (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? calculatorrate(items.alltotal, items.rateprice) :0) ;
        reportcustomersale[find].totalprofit +=(items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? calculatorrate(items.totalprofit,items.rateprice) :0) ;
      } else {
        reportcustomersale.push({
          customer_id: items.customer_id?._id,
          name: items.customer_id?.name,
          count: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? 1 :0),
          totalAmount:(items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? calculatorrate(items.alltotal, items.rateprice) :0) ,
          totalprofit: (items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน"? calculatorrate(items.totalprofit,items.rateprice) :0) 
        });
      }
    })
    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.user_id?._id)) == JSON.parse(JSON.stringify(items.user_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.alltotal, items.rateprice);
        salequotation[find].totalprofit += calculatorrate(items.totalprofit, items.rateprice);
      } else {
        
        salequotation.push({
          user_id: items.user_id?._id,
          firstname: items.user_id?.firstname,
          lastname:items.user_id?.lastname,
          nickname:items.user_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.alltotal,items.rateprice),
          totalprofit:calculatorrate(items.totalprofit,items.rateprice)
        });
      }

    })

    //ยอดขายหมวดสินค้า
    const reportproducttype = [];
    const  producttypedata = await Producttype.find();
    producttypedata.map((items)=>{
        reportproducttype.push({
        producttype_id: items._id,
        producttypename: items.name,
        quantity: 0,
        totalAmount: 0,
        totalprofit:0
      });
    })
    currentdata.forEach((items)=>{
        items.productdetail.forEach((element)=>{
          const find = reportproducttype.findIndex((item) => JSON.parse(JSON.stringify(item.producttype_id)) == JSON.parse(JSON.stringify(element.product_id?.producttype)));
          if(find !== -1){
            reportproducttype[find].quantity += element.quantity;
            reportproducttype[find].totalAmount +=  calculatorrate(element.total, element.rate_rateprice)
            reportproducttype[find].totalprofit += calculatorrate((((element.priceprofit-element.price)*element.quantity)-element.numdiscount), element.rate_rateprice)
          } 
        })
      
    })

    //report กำไรที่ได้ของงาน /เดือน กำไรหาจาก priceprofit
    const ReportProfits = [];
    const dataprofits = quotationdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
    dataprofits.forEach((item)=>{
      if(id == "month"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
      
        // ค้นหาข้อมูลรายเดือน
        const monthlyProfitIndex = ReportProfits.findIndex(
          (monthly) => monthly.year === year && monthly.month === month
        );
      
        if (monthlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
          ReportProfits[monthlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
          ReportProfits[monthlyProfitIndex].jobCount += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          ReportProfits.push({
            year: year,
            month: month,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            totalProfit: calculatorrate(item.totalprofit, item.rateprice),
            jobCount: 1,
          });
        }
      }
      else if(id =="quarter"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const quarter = getQuarter(createdAt);
    
        // ค้นหาข้อมูลรายไตรมาส
        const quarterlyProfitIndex = ReportProfits.findIndex(
          (quarterly) => quarterly.year === year && quarterly.quarter === quarter
        );
    
        if (quarterlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายไตรมาสแล้ว
          ReportProfits[quarterlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice)
          ReportProfits[quarterlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
          ReportProfits[quarterlyProfitIndex].jobCount += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายไตรมาส
          ReportProfits.push({
            year: year,
            quarter: quarter,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            totalProfit: calculatorrate(item.totalprofit, item.rateprice),
            jobCount: 1,
          });
        }

      }else{
        //รายปี
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();

        // ค้นหาข้อมูลรายปี
        const yearlyProfitIndex = ReportProfits.findIndex(
        (yearly) => yearly.year === year);

        if (yearlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายปีแล้ว
          ReportProfits[yearlyProfitIndex].totalall +=  calculatorrate(item.alltotal, item.rateprice);
          ReportProfits[yearlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
          ReportProfits[yearlyProfitIndex].jobCount += 1;
          } else {
          // ถ้ายังไม่มีข้อมูลรายปี
          ReportProfits.push({
            year: year,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            totalProfit: calculatorrate(item.totalprofit, item.rateprice),
            jobCount: 1,
          });
    }
      }
    })
    // คำนวณยอดขายทั้งหมด
    const totalSales = currentdata.reduce((sum, item) => sum + calculatorrate(item.alltotal, item.rateprice), 0);
    
    // คำนวณกำไรทั้งหมด
    const totalProfit = currentdata.reduce((sum, item) => sum + calculatorrate(item.totalprofit, item.rateprice), 0);

    // คำนวณเฉลี่ยกำไร
    const averageProfitPercentage = (totalProfit / totalSales) * 100;
    const dashboard = {
      totalSales:totalSales,
      totalProfit:totalProfit,
      averageProfitPercentage:averageProfitPercentage
    }

    return res.status(200).json({ status: true, header:header,dashboard:dashboard,reportcustomersale:reportcustomersale ,salequotation:salequotation
    ,reportproducttype:reportproducttype , ReportProfits:ReportProfits});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  } 
}

module.exports.reportpriceyear = async (req,res)=>{
  try{
    const quotationdata = await Quotation.find().populate('customer_id').populate('productdetail.product_id'); 
    currentdata = quotationdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
    
    const yearlyData = {};
    currentdata.forEach((item) => {
  const createdAt = new Date(item.createdAt);
  const year = createdAt.getFullYear();

  if (!yearlyData[year]) {
    yearlyData[year] = {
      totalSales: 0,
      totalProfit: 0,
      jobCount: 0,
    };
  }

  yearlyData[year].totalSales += calculatorrate(item.alltotal, item.rateprice);
  yearlyData[year].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
  yearlyData[year].jobCount += 1;
    });
    // คำนวณ % เฉลี่ยกำไร / ยอดขาย / ปี
    const reportpriceprofityear = [];

    for (const year in yearlyData) {
      const averageProfitPercentage = (yearlyData[year].totalProfit / yearlyData[year].totalSales) * 100;

    reportpriceprofityear.push({
    year: parseInt(year),
    averageProfitPercentage: isNaN(averageProfitPercentage) ? 0 : averageProfitPercentage,
    totalSales: yearlyData[year].totalSales,
    totalProfit: yearlyData[year].totalProfit,
    jobCount: yearlyData[year].jobCount,
  });
  }
  //ข้อมูลหมวดหมู่สินค้า
  const producttype = await Producttype.find();
  //ในใบเสนอราคา  currentdata.productdetail.product_id.producttype
  //เขียนให้หน่อย report กราฟแท่ง ของหมวดสินค้า/ ปี
  const yearlyProductSales = {};

currentdata.forEach((item) => {
  const createdAt = new Date(item.createdAt);
  const year = createdAt.getFullYear();

  if (!yearlyProductSales[year]) {
    yearlyProductSales[year] = {};
  }

  item.productdetail.forEach((product) => {
    const productType = product.product_id.producttype;
    const quantity = product.quantity;

    const totalAmount = calculatorrate(product.total, product.rate_rateprice);

    if (!yearlyProductSales[year][productType]) {
      yearlyProductSales[year][productType] = {
        quantity: 0,
        totalAmount: 0,
      };
    }

    yearlyProductSales[year][productType].quantity += quantity;
    yearlyProductSales[year][productType].totalAmount += totalAmount;
  });
});

const reportProductTypeYearly = [];

const productTypeIds = producttype.map((type) => type._id.toString());

for (const year in yearlyProductSales) {
  const productTypeData = yearlyProductSales[year];
  productTypeIds.forEach((productTypeId) => {
    const productType = productTypeData[productTypeId];
    if (productType) {
      console.log(productType.unit)
      // ถ้ามีข้อมูลสำหรับประเภทสินค้านี้ในปีนี้
      reportProductTypeYearly.push({
        year: parseInt(year),
        productType: producttype.find((type) => type._id.toString() === productTypeId).name,
        quantity: productType.quantity,
       
        totalAmount: productType.totalAmount,
      });
    } else {
      // ถ้าไม่มีข้อมูลสำหรับประเภทสินค้านี้ในปีนี้
      reportProductTypeYearly.push({
        year: parseInt(year),
        productType: producttype.find((type) => type._id.toString() === productTypeId).name,
        quantity: 0,
      
        totalAmount: 0,
      });
    }
  });
}
  //Report กราฟเส้นยอดขายแต่ละเดือน ทั้งปี เขียนให้หน่อย
  // สร้างออบเจ็กต์ที่จะเก็บข้อมูลสำหรับกราฟเส้น
// สร้างออบเจ็กต์ที่จะเก็บข้อมูลสำหรับกราฟเส้น
const monthlySalesData = {};
const monthlyProfitsData = {};

// วนลูปผ่านข้อมูลที่ได้จากรายงาน
currentdata.forEach((item) => {
  const createdAt = new Date(item.createdAt);
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1

  // สร้าง key ในออบเจ็กต์ที่มีชื่อเป็นปี
  if (!monthlySalesData[year]) {
    monthlySalesData[year] = {};
  }

  // สร้าง key ในออบเจ็กต์ที่มีชื่อเป็นเดือน
  if (!monthlySalesData[year][month]) {
    monthlySalesData[year][month] = {
      totalSales: 0,
      totalProfit: 0,
      averageProfitPercentage: 0,
    };
  }

  // เพิ่มยอดขายในเดือนนั้นๆ
  monthlySalesData[year][month].totalSales += calculatorrate(item.alltotal, item.rateprice);
  monthlySalesData[year][month].totalProfit += calculatorrate(item.totalprofit, item.rateprice);

  // คำนวณ % เฉลี่ยกำไร / ยอดขาย
  const averageProfitPercentage = (monthlySalesData[year][month].totalProfit / monthlySalesData[year][month].totalSales) * 100;
  monthlySalesData[year][month].averageProfitPercentage = isNaN(averageProfitPercentage) ? 0 : averageProfitPercentage;
});

// แปลงข้อมูลในรูปแบบที่ต้องการ
const salesData = [];

// วนลูปผ่านข้อมูลปีและเดือน
for (const year in monthlySalesData) {
  for (const month in monthlySalesData[year]) {
    salesData.push({
      year: parseInt(year),
      month: parseInt(month),
      totalSales: monthlySalesData[year][month].totalSales,
      totalProfit: monthlySalesData[year][month].totalProfit,
      averageProfitPercentage: monthlySalesData[year][month].averageProfitPercentage,
    });
  }
}

return res.status(200).json({ status: true,reportpriceprofityear:reportpriceprofityear,reportProductTypeYearly:reportProductTypeYearly,salesData:salesData});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}

module.exports.reportsaleall = async (req,res)=>{
  try{
    const id = req.body.id
    const quotationdata = await Quotation.find().populate('user_id');
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = quotationdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = quotationdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = quotationdata.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        /// ตั้งหัว
        // Format header based on start and end date
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(startMonth)} ${startYear} ถึง ${endDay} ${convertToThaiMonth(endMonth)} ${endYear}`;
      }else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= quotationdata
      header= "ทั้งหมด"
    }
    currentdata = currentdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
      ////
      //report กำไรที่ได้ของงาน /เดือน กำไรหาจาก priceprofit
    const ReportProfits = [];
    const dataprofits = quotationdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
    dataprofits.forEach((item)=>{
      if(id == "month"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
      
        // ค้นหาข้อมูลรายเดือน
        const monthlyProfitIndex = ReportProfits.findIndex(
          (monthly) => monthly.year === year && monthly.month === month
        );
      
        if (monthlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
          ReportProfits[monthlyProfitIndex].commission += calculatorrate(item.alltotal*(item.commissionpercent/100),item.rateprice);
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          ReportProfits.push({
            year: year,
            month: month,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            commission: calculatorrate(item.alltotal*(item.commissionpercent/100),item.rateprice),
            
          });
        }
      }
      else if(id =="quarter"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const quarter = getQuarter(createdAt);
    
        // ค้นหาข้อมูลรายไตรมาส
        const quarterlyProfitIndex = ReportProfits.findIndex(
          (quarterly) => quarterly.year === year && quarterly.quarter === quarter
        );
    
        if (quarterlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายไตรมาสแล้ว
          ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
          ReportProfits[monthlyProfitIndex].commission += calculatorrate(item.alltotal*item.commissionpercent,item.rateprice);
        } else {
          // ถ้ายังไม่มีข้อมูลรายไตรมาส
          ReportProfits.push({
            year: year,
            quarter: quarter,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            commission: calculatorrate(item.alltotal*(item.commissionpercent/100),item.rateprice),
          });
        }

      }else{
        //รายปี
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();

        // ค้นหาข้อมูลรายปี
        const yearlyProfitIndex = ReportProfits.findIndex(
        (yearly) => yearly.year === year);

        if (yearlyProfitIndex !== -1) {
          // ถ้ามีข้อมูลรายปีแล้ว
          ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
          ReportProfits[monthlyProfitIndex].commission += calculatorrate(item.alltotal*(item.commissionpercent/100),item.rateprice);
          } else {
          // ถ้ายังไม่มีข้อมูลรายปี
          ReportProfits.push({
            year: year,
            totalall:calculatorrate(item.alltotal, item.rateprice),
            commission: calculatorrate(item.alltotal*(item.commissionpercent/100),item.rateprice),
          });
    }
      }
    })

    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.user_id?._id)) == JSON.parse(JSON.stringify(items.user_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.alltotal, items.rateprice);
        salequotation[find].commission += calculatorrate(items.alltotal*(items.commissionpercent/100),items.rateprice);;
      } else {
        
        salequotation.push({
          user_id: items.user_id?._id,
          firstname: items.user_id?.firstname,
          lastname:items.user_id?.lastname,
          nickname:items.user_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.alltotal,items.rateprice),
          commission:calculatorrate(items.alltotal*(items.commissionpercent/100),items.rateprice),
        });
      }

    })
    // คำนวณยอดขายทั้งหมด
    const totalSales = currentdata.reduce((sum, item) => sum + calculatorrate(item.alltotal, item.rateprice), 0);
    
    // 
    const totalcommission = currentdata.reduce((sum, item) => sum + calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice), 0);
    const dashboard = {
      totalSales:totalSales,
      totalProfit:totalcommission,
     
    }
    return res.status(200).json({ status: true,header:header,dashboard:dashboard, allsale:ReportProfits , sale:salequotation});

  } catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

module.exports.dashboardadmin = async (req,res)=>{
  try{
    const id = req.body.id
    const quotationdata = await Quotation.find().populate("user_id").populate("customer_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = quotationdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = quotationdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = quotationdata.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        /// ตั้งหัว
        // Format header based on start and end date
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(startMonth)} ${startYear} ถึง ${endDay} ${convertToThaiMonth(endMonth)} ${endYear}`;
      }else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= quotationdata
      header= "ทั้งหมด"
    }
    
     // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
     const totalquotation = currentdata.length;
     // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
     const passedJobs = currentdata.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานผ่าน").length;
     // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
     const notPassedJobs = currentdata.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานไม่ผ่าน").length;

      /////     
     currentdata = currentdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
     
     
     
     // คำนวณยอดขายทั้งหมด
      const totalSales = currentdata.reduce((sum, item) => sum + calculatorrate(item.alltotal, item.rateprice), 0);
      const totalcommission = currentdata.reduce((sum, item) => sum + calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice), 0);

      // คำนวณกำไรทั้งหมด
      const totalProfit = currentdata.reduce((sum, item) => sum + calculatorrate(item.totalprofit, item.rateprice), 0);

      // คำนวณเฉลี่ยกำไร
      const averageProfitPercentage = (totalProfit / totalSales) * 100;
      const dashboard ={
        // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
        totalquotation:totalquotation,
        // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
        passedJobs:passedJobs,
        // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
        notPassedJobs:notPassedJobs,
        //ยอดขายทั้งหมด
        totalSales:totalSales,
        //ค่าคอมมิสชั่น
        totalcommission:totalcommission,
        totalProfit:totalProfit,
        averageProfitPercentage:averageProfitPercentage
     }
     //////////////////////////
     
     const ReportProfits = [];
     const dataprofits = quotationdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
     dataprofits.forEach((item)=>{
     if(id == "month"){
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();
       const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
     
       // ค้นหาข้อมูลรายเดือน
       const monthlyProfitIndex = ReportProfits.findIndex(
         (monthly) => monthly.year === year && monthly.month === month
       );
     
       if (monthlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายเดือนแล้ว
         ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
         ReportProfits[monthlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
       
         ReportProfits[monthlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายเดือน
         ReportProfits.push({
           year: year,
           month: month,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item.totalprofit, item.rateprice),
           jobCount: 1,
         });
       }
     }
     else if(id =="quarter"){
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();
       const quarter = getQuarter(createdAt);
   
       // ค้นหาข้อมูลรายไตรมาส
       const quarterlyProfitIndex = ReportProfits.findIndex(
         (quarterly) => quarterly.year === year && quarterly.quarter === quarter
       );
   
       if (quarterlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายไตรมาสแล้ว
         ReportProfits[quarterlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice)
         ReportProfits[quarterlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
         ReportProfits[quarterlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายไตรมาส
         ReportProfits.push({
           year: year,
           quarter: quarter,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item.totalprofit, item.rateprice),
           jobCount: 1,
         });
       }

     }else{
       //รายปี
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();

       // ค้นหาข้อมูลรายปี
       const yearlyProfitIndex = ReportProfits.findIndex(
       (yearly) => yearly.year === year);

       if (yearlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายปีแล้ว
         ReportProfits[yearlyProfitIndex].totalall +=  calculatorrate(item.alltotal, item.rateprice);
         ReportProfits[yearlyProfitIndex].totalProfit += calculatorrate(item.totalprofit, item.rateprice);
         ReportProfits[yearlyProfitIndex].jobCount += 1;
         } else {
         // ถ้ายังไม่มีข้อมูลรายปี
         ReportProfits.push({
           year: year,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item.totalprofit, item.rateprice),
           jobCount: 1,
         });
   }
     }
    })
    /////////////////////////
    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.user_id?._id)) == JSON.parse(JSON.stringify(items.user_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.alltotal, items.rateprice);
        salequotation[find].commission += calculatorrate(items.alltotal*(items.commissionpercent/100),items.rateprice);;
      } else {
        
        salequotation.push({
          user_id: items.user_id?._id,
          firstname: items.user_id?.firstname,
          lastname:items.user_id?.lastname,
          nickname:items.user_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.alltotal,items.rateprice),
          commission:calculatorrate(items.alltotal*(items.commissionpercent/100),items.rateprice),
        });
      }

    })
    ////////////////
     return res.status(200).json({ status: true,header:header,dashboard:dashboard,ReportProfits:ReportProfits,salequotation:salequotation});
  } catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

module.exports.dashboardsale = async (req,res)=>{
  try{
      const id = req.body.id;
      const user_id = req.body.user_id;
      const user = await User.findById(user_id);
      const quotationdata = await Quotation.find({user_id:user_id});
      let header = ''
      let currentdata = ''
      if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = quotationdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
      else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = quotationdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
      }
      else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = quotationdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
      }
      else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = quotationdata.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });

        /// ตั้งหัว
        // Format header based on start and end date
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(startMonth)} ${startYear} ถึง ${endDay} ${convertToThaiMonth(endMonth)} ${endYear}`;
      }else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
      }
      else{
      currentdata= quotationdata
      header= "ทั้งหมด"
      }
      const passdata = currentdata.filter((item)=>item?.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานผ่าน")
      const totalSales = passdata.reduce((sum, item) => sum + calculatorrate(item.alltotal, item.rateprice), 0);
      const totalcommission = passdata.reduce((sum, item) => sum + calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice), 0);

      const pricequotation = currentdata.length
      const passedJobs = currentdata.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานผ่าน").length;
      const notPassedJobs = currentdata.filter(item => item.statusdealdetail[item.statusdealdetail.length - 1]?.status === "ดีลงานไม่ผ่าน").length;
      const dashboard ={
        totalSales:totalSales,
        totalcommission:totalcommission,
        pricequotation:pricequotation,
        passedJobs:passedJobs,
        notPassedJobs:notPassedJobs
      }
      const ReportProfits = [];
     const dataprofits = quotationdata.filter(items => items.statusdealdetail[items.statusdealdetail?.length - 1]?.status === "ดีลงานผ่าน");
      dataprofits.forEach((item)=>{
     if(id == "month"){
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();
       const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
     
       // ค้นหาข้อมูลรายเดือน
       const monthlyProfitIndex = ReportProfits.findIndex(
         (monthly) => monthly.year === year && monthly.month === month
       );
     
       if (monthlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายเดือนแล้ว
         ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice);
         ReportProfits[monthlyProfitIndex].totalProfit += calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice);
       
         ReportProfits[monthlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายเดือน
         ReportProfits.push({
           year: year,
           month: month,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice),
           jobCount: 1,
         });
       }
     }
     else if(id =="quarter"){
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();
       const quarter = getQuarter(createdAt);
   
       // ค้นหาข้อมูลรายไตรมาส
       const quarterlyProfitIndex = ReportProfits.findIndex(
         (quarterly) => quarterly.year === year && quarterly.quarter === quarter
       );
   
       if (quarterlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายไตรมาสแล้ว
         ReportProfits[quarterlyProfitIndex].totalall += calculatorrate(item.alltotal, item.rateprice)
         ReportProfits[quarterlyProfitIndex].totalProfit += calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice);
         ReportProfits[quarterlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายไตรมาส
         ReportProfits.push({
           year: year,
           quarter: quarter,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice),
           jobCount: 1,
         });
       }

     }else{
       //รายปี
       const createdAt = new Date(item.createdAt);
       const year = createdAt.getFullYear();

       // ค้นหาข้อมูลรายปี
       const yearlyProfitIndex = ReportProfits.findIndex(
       (yearly) => yearly.year === year);

       if (yearlyProfitIndex !== -1) {
         // ถ้ามีข้อมูลรายปีแล้ว
         ReportProfits[yearlyProfitIndex].totalall +=  calculatorrate(item.alltotal, item.rateprice);
         ReportProfits[yearlyProfitIndex].totalProfit += calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice);
         ReportProfits[yearlyProfitIndex].jobCount += 1;
         } else {
         // ถ้ายังไม่มีข้อมูลรายปี
         ReportProfits.push({
           year: year,
           totalall:calculatorrate(item.alltotal, item.rateprice),
           totalProfit: calculatorrate(item?.alltotal*(item?.commissionpercent/100),item?.rateprice),
           jobCount: 1,
         });
   }
     }
      })
      return res.status(200).json({ status: true,header:header,dashboard:dashboard,user:user,ReportProfits:ReportProfits});
      
  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

//ฟังก์ชั่น

function getQuarter(date) {
  const month = date.getMonth() + 1;
  return Math.ceil(month / 3);
}
const convertToThaiMonth=(month)=>{
  // สร้างอาร์เรย์เดือนภาษาไทย
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม',
    'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน',
    'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // คืนค่าเดือนภาษาไทย
  return thaiMonths[month - 1];
}

const calculatorrate = (num,rate) =>{
  const ratetotal= (num*rate)
  return parseFloat(Math.ceil(ratetotal).toFixed(2))
}