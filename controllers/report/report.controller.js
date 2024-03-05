const Quotation = require("../../models/quotation/quotation.schema");
const Producttype = require("../../models/product/producttype.schema");
const User = require("../../models/user/user.schema");
const Order = require("../../models/order/order.schema");
const Supplier = require("../../models/supplier/supplier.schema");
const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema"); 
const Invoice = require("../../models/invoice/invoice.schema");
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
          _id: "$sale_id",
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
          _id: "$sale_id",
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
          _id: "$sale_id",
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
          _id: "$sale_id",
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

//เสร็จ
module.exports.reportquotation = async (req, res) => {
  try {
    const yearquotation = [];
    const quarterquotation = [];
    const monthquotation = [];

    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id");
    orderdata.forEach((items) => {
      
      // ส่วนของรายปี แต่ละปี
      const year = new Date(items.createdAt).getFullYear();
      const find = yearquotation.findIndex((item) => item.year == year);
      if (find != -1) {
        yearquotation[find].count += 1;
        yearquotation[find].totalprofit += (items?.quotation_id !=null? items?.quotation_id?.alltotal:0);

        if (items?.dealstatus == true) {
          yearquotation[find].pass += 1;
        }
        
        if (items?.dealstatus == false) {
          yearquotation[find].nopass += 1;
        }
      } else {
        yearquotation.push({
          year: year,
          count: 1,
          totalprofit: items.quotation_id?.alltotal,
          pass:(items.dealstatus == true? 1: 0),
          nopass:(items.dealstatus == false? 1: 0)
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
          quarterquotation[findQuarter].totalprofit += (items?.quotation_id !=null? items?.quotation_id?.alltotal:0);

        if (items.dealstatus == true) {
            quarterquotation[findQuarter].pass += 1;
        }

        if (items.dealstatus == false) {
            quarterquotation[findQuarter].nopass += 1;
        }
    } else {
        // ถ้ายังไม่มีไตรมาสนั้น ๆ
        quarterquotation.push({
            year: year,
            quarter: quarter,
            count: 1,
            totalprofit: (items?.quotation_id !=null? items?.quotation_id?.alltotal:0),
            pass: (items.dealstatus == true ? 1 : 0),
            nopass: (items.dealstatus == false ? 1 : 0),
        });

    }
   
            // ส่วนของรายเดือน 
            const findMonth = monthquotation.findIndex(item => item.year === year && item.month === month);
            if (findMonth !== -1) {
                // ถ้ามีรายเดือนนั้น ๆ แล้ว
                monthquotation[findMonth].count += 1;
                monthquotation[findMonth].totalprofit += (items?.quotation_id !=null? items?.quotation_id?.alltotal:0);
               
    
            if (items.dealstatus == true) {
                monthquotation[findMonth].pass += 1;
              }
    
              if (items.dealstatus == false) {
                  monthquotation[findMonth].nopass += 1;
              }
        } else {
            // ถ้ายังไม่มีรายเดือนนั้น ๆ
            monthquotation.push({
                year: year,
                month: month,
                count: 1,
                totalprofit: (items?.quotation_id !=null? (items?.quotation_id !=null? items?.quotation_id?.alltotal:0):0),
                pass: (items.dealstatus == true ? 1 : 0),
                nopass: (items.dealstatus == false ? 1 : 0),
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
    const currentMonthData = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);

    // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
    const totalquotation = currentMonthData.length;

    // ยอดรวมราคาของใบเสนอราคาในเดือนปัจจุบัน
    const pricequotation = currentMonthData.reduce((total, item) => total +  (item.quotation_id != null ? calculatorrate(item?.quotation_id?.alltotal,item?.quotation_id?.rateprice):0), 0);
   
    // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
    const passedJobs = currentMonthData.filter(item => item.dealstatus == true).length;

    // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
    const notPassedJobs = currentMonthData.filter(item => item.dealstatus == false).length;

    const dashboard ={
      totalquotation:totalquotation,
      pricequotation:pricequotation,
      passedJobs:passedJobs,
      notPassedJobs:notPassedJobs
    }

    //รายงาน ใบเสนอราคาของ Sales Department
    const salequotation = [];
    currentMonthData.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.sale_id?._id)) == JSON.parse(JSON.stringify(items.sale_id?._id)));
      
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += ( items.quotation_id != null ? calculatorrate((items?.quotation_id !=null? items?.quotation_id?.alltotal:0),items?.quotation_id?.rateprice):0);
    
        if (items.dealstatus == true) {
          salequotation[find].passedJobs += 1;
        } else if (items.dealstatus == false) {
          salequotation[find].notPassedJobs += 1;
        }
      } else {
        
        salequotation.push({
          sale_id: items.sale_id?._id,
          firstname: items.sale_id?.firstname,
          lastname:items.sale_id?.lastname,
          nickname:items.sale_id?.nickname,
          count: 1,
          totalAmount: ( items.quotation_id != null ? calculatorrate((items?.quotation_id !=null? items?.quotation_id?.alltotal:0),items?.quotation_id?.rateprice):0),
          passedJobs: (items.dealstatus === true ? 1 : 0),
          notPassedJobs: (items.dealstatus == false ? 1 : 0),
        });
        
      }
      
    })
    
    //รายงานรายละเอียดที่ขายไม่ผ่านใบเสนอราคา
    const nopassquotation = currentMonthData.filter(item=>item?.dealstatus == false);
   

    const header = convertToThaiMonth(currentMonth)+" "+currentYear;
    return res.status(200).json({ status: true, header:header, yearquotation: yearquotation,quarter:quarterquotation,monthquotation:monthquotation ,dashboard:dashboard,
      salequotation:salequotation,nopassquotation:nopassquotation
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//เสร็จ
module.exports.reportquotationbyid = async (req,res)=>{
  try {
    const id = req.body.id
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id");
    let currentMonthData ='';
    let header = '';
    if(id =="month")
    {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      currentMonthData = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
      header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentMonthData = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentMonthData = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentMonthData = orderdata.filter((item) => {
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
    const pricequotation = ( currentMonthData.length >0 ? currentMonthData.reduce((total, item) => total + calculatorrate(item?.quotation_id?.alltotal,item?.quotation_id?.rateprice), 0):0);
    // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
    const passedJobs = currentMonthData.filter(item => item?.dealstatus == true).length;

    // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
    const notPassedJobs = currentMonthData.filter(item => item.dealstatus == false).length;

    const dashboard ={
      totalquotation:totalquotation,
      pricequotation:pricequotation,
      passedJobs:passedJobs,
      notPassedJobs:notPassedJobs
    }

    //รายงาน ใบเสนอราคาของ Sales Department
    const salequotation = [];
    currentMonthData.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.sale_id?._id)) == JSON.parse(JSON.stringify(items.sale_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate((items?.quotation_id !=null? items?.quotation_id?.alltotal:0),items?.quotation_id?.rateprice);
    
        if (items.dealstatus == true) {
          salequotation[find].passedJobs += 1;
        } else if (items.dealstatus == false) {
          salequotation[find].notPassedJobs += 1;
        }
      } else {
        salequotation.push({
          sale_id: items.sale_id?._id,
          firstname: items.sale_id?.firstname,
          lastname:items.sale_id?.lastname,
          nickname:items.sale_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.quotation_id.alltotal,items.quotation_id.rateprice),
          passedJobs: (items.dealstatus == true? 1 : 0),
          notPassedJobs: (items.dealstatus == false ? 1 : 0),
        });
      }

    })

    //รายงานรายละเอียดที่ขายไม่ผ่านใบเสนอราคา
    const nopassquotation = currentMonthData.filter(item=>item?.dealstatus == false);
    return res.status(200).json({ status: true, header:header,dashboard:dashboard,salequotation:salequotation,nopassquotation:nopassquotation});
  }catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
  
  
}

//เสร็จ
module.exports.reportprice = async (req,res)=>{
  try{
      const id = req.body.id
      const orderdata = await Order.find().populate({
        path:'quotation_id',
        populate:[
          {path:'customer_id'},
          {path:'user_id'},
          {path:'productdetail.product_id'},
        ]
      }).populate("sale_id").populate("customer_id");

      let currentdata = ''
      let header = ''

    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    currentdata = currentdata.filter(items => items.dealstatus == true);

    const reportcustomersale = []; 
    currentdata.forEach((items)=>{
      const find = reportcustomersale.findIndex((item) => JSON.parse(JSON.stringify(item.customer_id?._id)) == JSON.parse(JSON.stringify(items.customer_id?._id)));
      if (find !== -1) {
        reportcustomersale[find].count += (items.dealstatus == true? 1 :0);
        reportcustomersale[find].totalAmount += (items.dealstatus == true? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice) :0) ;
        reportcustomersale[find].totalprofit +=(items.dealstatus == true? calculatorrate(items.quotation_id.totalprofit,items.quotation_id.rateprice) :0) ;
      } else {
        reportcustomersale.push({
          customer_id: items.customer_id?._id,
          name: items.customer_id?.name,
          count: (items.dealstatus == true? 1 :0),
          totalAmount:(items.dealstatus == true? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice) :0) ,
          totalprofit: (items.dealstatus == true ? calculatorrate(items.quotation_id.totalprofit,items.quotation_id.rateprice) :0) 
        });
      }
    })
    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.sale_id?._id)) == JSON.parse(JSON.stringify(items.sale_id?._id)));
      
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += ( items.quotation_id != null ? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice):0);
        salequotation[find].totalprofit +=  (items.quotation_id != null ? calculatorrate(items.quotation_id.totalprofit, items.quotation_id.rateprice):0) ;
      } else {
        
        salequotation.push({
          sale_id: items.sale_id?._id,
          firstname: items.sale_id?.firstname,
          lastname:items.sale_id?.lastname,
          nickname:items.sale_id?.nickname,
          count: 1,
          totalAmount: ( items.quotation_id != null ? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice):0),
          totalprofit:(items.quotation_id != null ? calculatorrate(items.quotation_id.totalprofit, items.quotation_id.rateprice):0)
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
    //น่าจะerror
    currentdata.forEach((items)=>{
      if(items?.quotation_id != null)
      {
        items?.quotation_id?.productdetail?.forEach((element)=>{
         
          const find = reportproducttype.findIndex((item) => JSON.parse(JSON.stringify(item.producttype_id)) == JSON.parse(JSON.stringify(element.product_id?.producttype)));
          
          if(find !== -1){
            reportproducttype[find].quantity += element.quantity;
            reportproducttype[find].totalAmount +=  calculatorrate(element.total, element.rate_rateprice)
            reportproducttype[find].totalprofit += calculatorrate((((element.priceprofit-element.price)*element.quantity)-element.numdiscount), element.rate_rateprice)
          } 
        })
      }
        
      
    })

    //report กำไรที่ได้ของงาน /เดือน กำไรหาจาก priceprofit
    const ReportProfits = [];
    const dataprofits = orderdata.filter(items => items.dealstatus == true);
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
          ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice);
          ReportProfits[monthlyProfitIndex].totalProfit += calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice);
          ReportProfits[monthlyProfitIndex].jobCount += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          ReportProfits.push({
            year: year,
            month: month,
            totalall:calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice),
            totalProfit: calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice),
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
          ReportProfits[quarterlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0)
          ReportProfits[quarterlyProfitIndex].totalProfit += (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0);
          ReportProfits[quarterlyProfitIndex].jobCount += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายไตรมาส
          ReportProfits.push({
            year: year,
            quarter: quarter,
            totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            totalProfit: (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0),
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
          ReportProfits[yearlyProfitIndex].totalall +=  (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
          ReportProfits[yearlyProfitIndex].totalProfit += (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0);
          ReportProfits[yearlyProfitIndex].jobCount += 1;
          } else {
          // ถ้ายังไม่มีข้อมูลรายปี
          ReportProfits.push({
            year: year,
            totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            totalProfit:  (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0),
            jobCount: 1,
          });
    }
      }
    })
    // คำนวณยอดขายทั้งหมด
    const totalSales = currentdata.reduce((sum, item) => sum + (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0), 0);
    
    // คำนวณกำไรทั้งหมด
    const totalProfit = currentdata.reduce((sum, item) => sum +  (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0), 0);

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

//เสร็๋จ
module.exports.reportpriceyear = async (req,res)=>{
  try{
    const orderdata = await Order.find().populate({
      path:'quotation_id',
      populate:[
        {path:'customer_id'},
        {path:'user_id'},
        {path:'productdetail.product_id'},
      ]
    }).populate("sale_id").populate("customer_id");

    currentdata = orderdata.filter(items => items.dealstatus == true);
    
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

  yearlyData[year].totalSales += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
  yearlyData[year].totalProfit += (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0);
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
  
  item?.quotation_id?.productdetail.forEach((product) => {
    const productType = product.product_id.producttype;
    const quantity = product.quantity;
    
    const totalAmount = (item.quotation_id != null? calculatorrate(product.total, product.rate_rateprice):0);

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
  monthlySalesData[year][month].totalSales += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
  monthlySalesData[year][month].totalProfit += (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0);

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
//
module.exports.reportsaleall = async (req,res)=>{
  try{
    const id = req.body.id
    const orderdata = await Order.find().populate({
      path:'quotation_id',
      populate:[
        {path:'customer_id'},
        {path:'user_id'},
        {path:'productdetail.product_id'},
      ]
    }).populate("sale_id").populate("customer_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    currentdata = currentdata.filter(items => items.dealstatus == true);
      //report กำไรที่ได้ของงาน /เดือน กำไรหาจาก priceprofit
    const ReportProfits = [];
    const dataprofits = orderdata.filter(items => items.dealstatus == true);
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
          ReportProfits[monthlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
          ReportProfits[monthlyProfitIndex].commission += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0);
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          ReportProfits.push({
            year: year,
            month: month,
            totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            commission: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0),
            
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
          ReportProfits[quarterlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
          ReportProfits[quarterlyProfitIndex].commission += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0);
        } else {
          // ถ้ายังไม่มีข้อมูลรายไตรมาส
          ReportProfits.push({
            year: year,
            quarter: quarter,
            totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            commission: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0),
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
          ReportProfits[yearlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
          ReportProfits[yearlyProfitIndex].commission += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0);
          } else {
          // ถ้ายังไม่มีข้อมูลรายปี
          ReportProfits.push({
            year: year,
            totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            commission: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal*(item.commissionpercent/100),item.quotation_id.rateprice):0),
          });
    }
      }
    })

    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.sale_id?._id)) == JSON.parse(JSON.stringify(items.sale_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += (items.quotation_id != null? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice):0);
        salequotation[find].commission += (items.quotation_id != null?calculatorrate(items.quotation_id.alltotal*(items.commissionpercent/100),items.quotation_id.rateprice):0);
      } else {
        
        salequotation.push({
          sale_id: items.sale_id?._id,
          firstname: items.sale_id?.firstname,
          lastname:items.sale_id?.lastname,
          nickname:items.sale_id?.nickname,
          count: 1,
          totalAmount:  (items.quotation_id != null? calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice):0),
          commission:(items.quotation_id != null?calculatorrate(items.quotation_id.alltotal*(items.commissionpercent/100),items.quotation_id.rateprice):0),
        });
      }

    })
    // คำนวณยอดขายทั้งหมด
    const totalSales = currentdata.reduce((sum, item) => sum + (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0), 0);
    
    // 
    const totalcommission = currentdata.reduce((sum, item) => sum + (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0), 0);
    const dashboard = {
      totalSales:totalSales,
      totalProfit:totalcommission,
     
    }
    return res.status(200).json({ status: true,header:header,dashboard:dashboard, allsale:ReportProfits , sale:salequotation});

  } catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

// เสร็จแล้ว
module.exports.dashboardadmin = async (req,res)=>{
  try{
    const id = req.body.id
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      currentdata= orderdata
      header= "ทั้งหมด"
    }
   
     // ยอดรวมใบเสนอราคาในเดือนปัจจุบัน
     const totalquotation = currentdata?.length;
    
     // ยอดรวมงานที่ผ่านในเดือนปัจจุบัน
     const passedJobs = currentdata?.filter(item => item?.dealstatus == true)?.length;
     // ยอดรวมงานที่ไม่ผ่านในเดือนปัจจุบัน
     const notPassedJobs =currentdata?.filter(item => item?.dealstatus != true)?.length;
      /////     
     currentdata = currentdata?.filter(item => item?.dealstatus == true)

   
     
     // คำนวณยอดขายทั้งหมด
      const totalSales = currentdata?.reduce((sum, item) => sum + calculatorrate(item.quotation_id?.alltotal, item.quotation_id?.rateprice), 0);
      const totalcommission = currentdata?.reduce((sum, item) => sum + calculatorrate(item.quotation_id?.alltotal*(item?.commissionpercent/100),item?.quotation_id?.rateprice), 0);

   
      // คำนวณกำไรทั้งหมด
      const totalProfit = currentdata?.reduce((sum, item) => sum + calculatorrate(item.quotation_id?.totalprofit, item.quotation_id?.rateprice), 0);
     
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
     const dataprofits = orderdata.filter(items => items?.dealstatus == true);
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
         ReportProfits[monthlyProfitIndex].totalall += calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice);
         ReportProfits[monthlyProfitIndex].totalProfit += calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice);
       
         ReportProfits[monthlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายเดือน
         ReportProfits.push({
           year: year,
           month: month,
           totalall:calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice),
           totalProfit: (item.quotation_id != null ? calculatorrate(item.quotation_id.totalprofit, item.quotation_id.rateprice):0),
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
         ReportProfits[quarterlyProfitIndex].totalall += calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice)
         ReportProfits[quarterlyProfitIndex].totalProfit += calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice);
         ReportProfits[quarterlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายไตรมาส
         ReportProfits.push({
           year: year,
           quarter: quarter,
           totalall:calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice),
           totalProfit: calculatorrate(item?.quotation_id?.totalprofit,item?.quotation_id?.rateprice),
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
         ReportProfits[yearlyProfitIndex].totalall +=  calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice);
         ReportProfits[yearlyProfitIndex].totalProfit += calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice);
         ReportProfits[yearlyProfitIndex].jobCount += 1;
         } else {
         // ถ้ายังไม่มีข้อมูลรายปี
         ReportProfits.push({
           year: year,
           totalall:calculatorrate(item?.quotation_id?.alltotal, item?.quotation_id?.rateprice),
           totalProfit: calculatorrate(item?.quotation_id?.totalprofit, item?.quotation_id?.rateprice),
           jobCount: 1,
         });
   }
     }
    })
    /////////////////////////
    //ยอดขาย sale
    const salequotation = [];
    currentdata.forEach((items)=>{
      const find = salequotation.findIndex((item) => JSON.parse(JSON.stringify(item.sale_id?._id)) == JSON.parse(JSON.stringify(items.sale_id?._id)));
      if (find !== -1) {
        salequotation[find].count += 1;
        salequotation[find].totalAmount += calculatorrate(items.quotation_id.alltotal, items.quotation_id.rateprice);
        salequotation[find].commission += calculatorrate(items.quotation_id.alltotal*(items.commissionpercent/100),items.quotation_id.rateprice);;
      } else {
        
        salequotation.push({
          sale_id: items.sale_id?._id,
          firstname: items.sale_id?.firstname,
          lastname:items.sale_id?.lastname,
          nickname:items.sale_id?.nickname,
          count: 1,
          totalAmount: calculatorrate(items.quotation_id.alltotal,items.quotation_id.rateprice),
          commission:calculatorrate(items.quotation_id.alltotal*(items.commissionpercent/100),items.quotation_id.rateprice),
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
      const sale_id = req.body.user_id;
      const user = await User.findById(sale_id);
      const orderdata = await Order.find({sale_id:sale_id}).populate("quotation_id").populate("sale_id").populate("customer_id");;
      let header = ''
      let currentdata = ''
      if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
      else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
      }
      else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
      }
      else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      currentdata= orderdata
      header= "ทั้งหมด"
      }
     
      const passdata = currentdata.filter((item)=>item?.dealstatus == true)
      
      const totalSales = passdata.reduce((sum, item) => sum + (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0), 0);
      const totalcommission = passdata.reduce((sum, item) => sum + (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0), 0);
   
      
      
      const pricequotation = currentdata.length
      const passedJobs = currentdata.filter(item => item.dealstatus == true).length;
      const notPassedJobs = currentdata.filter(item => item.dealstatus == false).length;
      
      const dashboard ={
        totalSales:totalSales,
        totalcommission:totalcommission,
        pricequotation:pricequotation,
        passedJobs:passedJobs,
        notPassedJobs:notPassedJobs
      }
      
      const ReportProfits = [];
      const dataprofits = orderdata.filter(items => items.dealstatus == true);      
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
         ReportProfits[monthlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
         ReportProfits[monthlyProfitIndex].totalProfit += (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0);
       
         ReportProfits[monthlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายเดือน
         ReportProfits.push({
           year: year,
           month: month,
           totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
           totalProfit: (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0),
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
         ReportProfits[quarterlyProfitIndex].totalall += (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0)
         ReportProfits[quarterlyProfitIndex].totalProfit += (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0);
         ReportProfits[quarterlyProfitIndex].jobCount += 1;
       } else {
         // ถ้ายังไม่มีข้อมูลรายไตรมาส
         ReportProfits.push({
           year: year,
           quarter: quarter,
           totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
           totalProfit:(item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0),
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
         ReportProfits[yearlyProfitIndex].totalall +=  (item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
         ReportProfits[yearlyProfitIndex].totalProfit += (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0);
         ReportProfits[yearlyProfitIndex].jobCount += 1;
         } else {
         // ถ้ายังไม่มีข้อมูลรายปี
         ReportProfits.push({
           year: year,
           totalall:(item.quotation_id != null ? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
           totalProfit: (item.quotation_id != null ? calculatorrate(item?.quotation_id.alltotal*(item?.commissionpercent/100),item?.quotation_id.rateprice):0),
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
//report การส่งของ
module.exports.reportdelivery = async (req,res)=>{
  try{
    const id = req.body.id;
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id").populate("procurement_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      currentdata= orderdata
      header= "ทั้งหมด"
    }

    //report ระยะเวลาส่งของ และ ติดตามได้ แต่ละออเดอร์
    const delivery = [];
    currentdata = currentdata.filter((item)=>item?.dealstatus == true)
    currentdata.forEach((item)=>{
      let deliverydate = 0;
      if(item?.date_customer_delivery == null ){
        deliverydate = caltime(Date.now(),item?.deliverydate);
      }else{
        if(item?.date_customer_delivery != null && item?.date_customer_delivery <= item?.deliverydate){
          deliverydate = caltime(item?.date_customer_delivery,item?.dealenddate);
        }else{
          deliverydate = caltime(item?.deliverydate,item?.date_customer_delivery);
        }
      }

      //ถ้าdate_customer_delivery น้อยกว่า dealenddate แสดงว่าส่งเร็ว
      let status= "";
      if(item?.date_customer_delivery == null ){
        status = "ยังจัดส่งอยู่";
      }
      else if(item?.date_customer_delivery != null && item?.date_customer_delivery <= item?.deliverydate){
        status = "จัดส่งให้ลูกค้าตามดีล";
      }else{
        status = "จัดส่งของช้าไป "+caltime(item?.deliverydate,item?.date_customer_delivery)+" วัน";
      }
   
      delivery.push({
        order_id: item._id,
        reforder: item.reforder,
        customer: item?.customer_id?.name,
        sale: item?.sale_id?.firstname + " " + item?.sale_id?.lastname,
        procurement: (item.procurement_id != null?item?.procurement_id?.firstname + " " + item?.procurement_id?.lastname:"ยังไม่มีผู้จัดซื้อ"),
        deliverydate: deliverydate,
        status: status

      });
    })
    //report จัดส่งสินค้าตามดีลช้า
    const datasuccess  = currentdata.filter((item)=>item.status =="จัดส่งสมบูรณ์");
    const deliverydeal = datasuccess.filter((item)=>item?.date_customer_delivery != null && item?.date_customer_delivery <= item?.deliverydate);
    const deliveryslow = datasuccess.filter((item)=>item?.date_customer_delivery != null && item?.date_customer_delivery >= item?.deliverydate);
    const deliveryslowdata = [];
    deliveryslow.forEach((item)=>{
      let deliverydate = caltime(item?.deliverydate,item?.date_customer_delivery);
      deliveryslowdata.push({
        order_id: item._id,
        reforder: item.reforder,
        customer: item?.customer_id?.name,
        sale: item?.sale_id?.firstname + " " + item?.sale_id?.lastname,
        procurement: (item.procurement_id != null?item?.procurement_id?.firstname + " " + item?.procurement_id?.lastname:"ยังไม่มีผู้จัดซื้อ"),
        deliverydate: deliverydate,
      });
    })

    const dashboard = {
      totalorder:currentdata.length,
      totaldelivery:deliverydeal.length,
      totaldeliveryslow:deliveryslow.length
    }
    return res.status(200).json({ status: true,header:header,dashboard:dashboard,delivery:delivery,deliveryslowdata:deliveryslowdata});

    

  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

//report สินค้าค้างสต็อก
module.exports.reportstock = async (req,res)=>{
  try{
    const id = req.body.id;
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id").populate("procurement_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      }
      else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    const datastock = orderdata.filter((item)=>item?.status == "รอจัดส่งให้ลูกค้า")
    const stock = [];

    datastock.forEach((item)=>{
      if(id == "month"){
        //คำนวณสินค้า ค้างสต็อก รายเดือน
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
        const monthlyStockIndex = stock.findIndex(
          (monthly) => monthly.year === year && monthly.month === month
        );
        if (monthlyStockIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          stock[monthlyStockIndex].count += 1;
          stock[monthlyStockIndex].totalprice += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0) ;
          stock[monthlyStockIndex].amount += (item.quotation_id != null? item.quotation_id.amount:0);
          stock[monthlyStockIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          stock.push({
            year: year,
            month: month,
            count: 1,
            totalprice: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            amount: (item.quotation_id != null? item.quotation_id.amount:0),
            orderlength: 1,
          });
        }
        
      }else if(id =="quarter"){
         //คำนวณสินค้า ค้างสต็อก รายเดือน
          const createdAt = new Date(item.createdAt);
          const year = createdAt.getFullYear();
          const quarter = getQuarter(createdAt);
          const quarterlyStockIndex = stock.findIndex(
            (quarterly) => quarterly.year === year && quarterly.quarter === quarter
          );
          if (quarterlyStockIndex !== -1) {
            // ถ้ามีข้อมูลรายเดือนแล้ว
            stock[quarterlyStockIndex].totalprice += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
            stock[quarterlyStockIndex].amount += (item.quotation_id != null? item.quotation_id.amount:0);
            stock[quarterlyStockIndex].orderlength += 1;
          } else {
            // ถ้ายังไม่มีข้อมูลรายเดือน
            stock.push({
              year: year,
              quarter: quarter,
              totalprice: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
              amount: (item.quotation_id != null? item.quotation_id.amount:0),
              orderlength: 1,
            });
          }


      }
      else{
        //คำนวณสินค้า ค้างสต็อก รายปี
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const yearlyStockIndex = stock.findIndex(
          (yearly) => yearly.year === year
        );
        if (yearlyStockIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          stock[yearlyStockIndex].totalprice += (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0);
          stock[yearlyStockIndex].amount += (item.quotation_id != null? item.quotation_id.amount:0);
          stock[yearlyStockIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          stock.push({
            year: year,
            totalprice: (item.quotation_id != null? calculatorrate(item.quotation_id.alltotal, item.quotation_id.rateprice):0),
            amount: (item.quotation_id != null? item.quotation_id.amount:0),
            orderlength: 1,
          });
        }

      }
    })
    const dashboard = {
      totalorder:datastock.length,  
      pricevalue:stock.reduce((sum, item) => sum + item.totalprice, 0),
    }
    return res.status(200).json({ status: true,header:header,dashboard:dashboard,stock:stock});
  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}


//report supplier
module.exports.reportsupplier = async (req,res)=>{
  try{
    const id = req.body.id;
    const purchaseorderdata = await Purchaseorder.find().populate("quotation_id").populate("sale_id").populate("procurement_id").populate("supplier_id");
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = purchaseorderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = purchaseorderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = purchaseorderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = purchaseorderdata.filter((item) => {
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
      }
      else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= purchaseorderdata
      header= "ทั้งหมด"
    }
    const supplierdata = await Supplier.find();
    //
    const supplier = [];
    supplierdata.forEach((item)=>{
      supplier.push({
        supplier_id: item._id,
        name: item.name,
        totalprice:0,
        count:0,
      });
    })

    currentdata.forEach((item)=>{
      const id = item?.supplier_id?._id;  
      const find = supplier.findIndex((item) => JSON.parse(JSON.stringify(item.supplier_id)) == JSON.parse(JSON.stringify(id)));
      if (find !== -1) {
        supplier[find].totalprice += calculatorrate(item.alltotal, item.rateprice);
        supplier[find].count += 1;
      }
    })


    const deliberysucces =  [];
    const deliverysuccesdata =  purchaseorderdata.filter((item)=>item.deliverystatus =="ส่งของตามดิว");
    deliverysuccesdata.forEach((item)=>{
      const find = deliberysucces.findIndex((items) => JSON.parse(JSON.stringify(items.supplier_id)) == JSON.parse(JSON.stringify(item?.supplier_id?._id)));
      if (find != -1) {
        deliberysucces[find].totalprice += calculatorrate(item.alltotal, item.rateprice);
        deliberysucces[find].count += 1;
        deliberysucces[find].purchaseorders.push(item);
      }else{
        const po = [item];
        deliberysucces.push({
          supplier_id: item?.supplier_id?._id,
          name: item?.supplier_id?.name,
          totalprice:calculatorrate(item.alltotal, item.rateprice),
          count:1,
          purchaseorders:po
        });
      }
    })

    
    const deliveryslow = [];
    const deliveryslowdata = purchaseorderdata.filter((item)=>item.deliverystatus =="ส่งของล่าช้า");
    deliveryslowdata.forEach((item)=>{
      const find = deliveryslow.findIndex((items) => JSON.parse(JSON.stringify(items.supplier_id)) == JSON.parse(JSON.stringify(item?.supplier_id?._id)));
      if (find != -1) {
        deliveryslow[find].totalprice += calculatorrate(item.alltotal, item.rateprice);
        deliveryslow[find].count += 1;
        deliveryslow[find].purchaseorders.push(item);
      }else{
        const po = [item];
        deliveryslow.push({
          supplier_id: item?.supplier_id?._id,
          name: item?.supplier_id?.name,
          totalprice:calculatorrate(item.alltotal, item.rateprice),
          count:1,
          purchaseorders:po
        });
      }
    })

    const dashboard = {
      totalorder:currentdata.length,
      totalprice:supplier.reduce((sum, item) => sum + item.totalprice, 0),
    }

    return res.status(200).json({ status: true,header:header,dashboard:dashboard,supplier:supplier,deliberysucces:deliberysucces,deliveryslow:deliveryslow});


  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

//report กำไรและค่าใช้จ่าย
module.exports.reportprofit = async (req,res)=>{
  try{
    const id = req.body.id;
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id").populate("procurement_id")
    .populate("purchaseorder._id");
    let currentdata = ''
    let header = ''
    if(id =="month")
    {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      }
      else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    const ReportProfits = [];
    const dataprofits = currentdata.filter(items => items.status == "จัดส่งสมบูรณ์");
    dataprofits.forEach((item)=>{
      let cost = 0;
      let importtax = 0;
      let shippingcost = 0;
      let operationcost = 0;
      let purchaseorder =item?.purchaseorder
      purchaseorder.forEach((item2)=>{  
        cost += item2?._id?.alltotal;
        importtax += item2?._id?.importtax;
        shippingcost += item2?._id?.shippingcost;
        operationcost += item2?._id?.operationcost;
      })
      const data = {
        order_id: item._id,
        date: item.createdAt,
        reforder: item.reforder,
        customer: item?.customer_id?.name,
        sale: item?.sale_id?.firstname + " " + item?.sale_id?.lastname,
        procurement: (item.procurement_id != null?item?.procurement_id?.firstname + " " + item?.procurement_id?.lastname:"ยังไม่มีผู้จัดซื้อ"),
        totalall: (item?.quotation_id != null? calculatorrate(item?.quotation_id?.alltotal,item?.quotation_id?.rateprice) :0),
        cost: cost,
        importtax: importtax,
        shippingcost: shippingcost,
        operationcost: operationcost,
        profit: (item?.quotation_id != null? calculatorrate(item?.quotation_id?.alltotal-cost-importtax-shippingcost-operationcost,item?.quotation_id?.rateprice):0),
      }
      ReportProfits.push(data);
    })
    //report ค่าขนส่งใน ประเทศ และต่างประเทศ /เดือน /ปี
    const shippingcost = [];
    const shippingdata = orderdata.filter((item)=>item?.status == "จัดส่งสมบูรณ์");
    shippingdata.forEach((item)=>{
        let shippingprice = 0;
        item.purchaseorder.forEach((item2)=>{ 
          shippingprice += item2?._id?.shippingcost;  
        })
      if(id == "month"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
        const monthlyShippingIndex = shippingcost.findIndex(
          (monthly) => monthly.year === year && monthly.month === month
        );
          
        if (monthlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว

          shippingcost[monthlyShippingIndex].shippingcost += shippingprice;
        
          shippingcost[monthlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            month: month,
            orderlength: 1,
            shippingcost: shippingprice,
            
          });
        }
      }else if(id =="quarter"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const quarter = getQuarter(createdAt);
        const quarterlyShippingIndex = shippingcost.findIndex(
          (quarterly) => quarterly.year === year && quarterly.quarter === quarter
        );
        if (quarterlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          shippingcost[quarterlyShippingIndex].shippingcost += shippingprice;
          shippingcost[quarterlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            quarter: quarter,
            shippingcost: shippingprice,
            orderlength: 1,
          });
        }
      }
      else{
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const yearlyShippingIndex = shippingcost.findIndex(
          (yearly) => yearly.year === year
        );
        if (yearlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          
          shippingcost[yearlyShippingIndex].shippingcost += shippingprice;
          shippingcost[yearlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            shippingcost: shippingprice,
            orderlength: 1,
          });
        }
      }
    })

    const dashboard = {
      totalorder:dataprofits.length,  
      totalprofit:ReportProfits.reduce((sum, item) => sum + item.profit, 0),
    }


    return res.status(200).json({ status: true,header:header,dashboard:dashboard,reportprofits:ReportProfits,shippingcost:shippingcost});
  }
  catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

//report สรุปยอดขายวางบิล
module.exports.reportinvoice = async (req,res)=>{
  try{
    const id = req.body.id;
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id")
    .populate("customer_id").populate("procurement_id").populate("purchaseorder._id")
    .populate({
      path:'invoiceid',
      populate:[
        {path:'account_id'}
      ]
    });
    let currentdata = ''
    let header = ''
    if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      }
      else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    //report สรุปยอดขายที่วางบิลไปแล้ว/เดือน/ปี เก็บเงินได้เมื่อไหร่
    const invoice = [];
    const invoicedata = currentdata.filter((item)=>item?.invoiceid != null && item?.invoiceid?.stauts == "ชำระเงินแล้ว");
    invoicedata.forEach((item)=>{
      invoice.push({
        order_id: item._id,
        reforder: item.reforder,
        accountname: item?.invoiceid?.account_id?.firstname + " " + item?.invoiceid?.account_id?.lastname,
        invoicedate: item?.invoiceid?.invoicedate,
        total: calculatorrate(item?.invoiceid?.total,item?.invoiceid?.rateprice),
        status: item?.invoiceid?.stauts,
        dateofpayment: item?.invoiceid?.dateofpayment,
      });   
    })

    //report สรุปยอดขายที่วางบิล/เดือน/ปี ที่ยังไม่เก็บเงินไม่ได้
    const invoiceunpaid = [];
    const invoiceunpaiddata = orderdata.filter((item)=>item?.invoiceid != null && item?.invoiceid?.stauts == "รอชำระเงิน");
    invoiceunpaiddata.forEach((item)=>{
      invoiceunpaid.push({
        order_id: item._id,
        reforder: item.reforder,
        accountname: item?.invoiceid?.account_id?.firstname + " " + item?.invoiceid?.account_id?.lastname,
        invoicedate: item?.invoiceid?.invoicedate,
        total: calculatorrate(item?.invoiceid?.total,item?.invoiceid?.rateprice),
        status: item?.invoiceid?.stauts,
        dateofpayment: item?.invoiceid?.dateofpayment,
      });   
    })
    //report สรุปยอดขายที่ยังไม่ได้วางบิล/เดือน/ปี
    const notinvoice = [];
    const notinvoicedata = orderdata.filter((item)=> item?.invoiceid == null && item?.dealstatus == true);
    notinvoicedata.forEach((item)=>{
      notinvoice.push({
        order_id: item._id,
        reforder: item.reforder,
        accountname: "ยังไม่มีบิล",
        invoicedate: "ยังไม่มีบิล",
        total: (item?.quotation_id != null? calculatorrate(item?.quotation_id?.alltotal,item?.quotation_id?.rateprice) :0),
        status: "ยังไม่มีบิล",
        dateofpayment: "ยังไม่มีบิล",
      });   
    })
	  //report สรุปยอดลงทุนงานไปแล้วกี่บาท แต่ยังไม่ได้วางบิล/เดือน/ปี
    const notinvoicecost = [];
    const notinvoicecostdata = orderdata.filter((item)=>item?.invoiceid == null && item?.dealstatus == true && item?.purchaseorder != null);
    notinvoicecostdata.forEach((item)=>{
      let cost = 0;
      item.purchaseorder.forEach((item2)=>{

        if(item2?._id?.statusapprove == true)
       {
            cost += item2?._id?.alltotal;
        }
      });
      if (cost != 0){
        notinvoicecost.push({
          order_id: item._id,
          reforder: item.reforder,
          total: cost,
          status: "ยังไม่มีบิล",
        });
      }
      

    })
     const dashboard = {
      //report สรุปยอดขายที่วางบิลไปแล้ว/เดือน/ปี เก็บเงินได้เมื่อไหร่
      totalinvoice:invoice.length, // จำนวนวางบิลไปแล้ว
      totalinvoicepaid:invoice.reduce((sum, item) => sum + item.total, 0),  //ยอดขายไปวางบิล และเก็บเงิน

      //report สรุปยอดขายที่วางบิล/เดือน/ปี ที่ยังไม่เก็บเงินไม่ได้
      totalinvoiceunpaid:invoiceunpaid.length, // จำนวนวางบิลที่ยังไม่ได้เก็บเงิน
      totalinvoiceunpaidprice:invoiceunpaid.reduce((sum, item) => sum + item.total, 0), //ยอดขายที่ยังไม่ได้เก็บเงิน

      //report สรุปยอดขายที่ยังไม่ได้วางบิล/เดือน/ปี
      totalnotinvoice:notinvoice.length, // จำนวนยังไม่ได้วางบิล
      totalnotinvoiceprice:notinvoice.reduce((sum, item) => sum + item.total, 0), //ยอดขายที่ยังไม่ได้วางบิล
      //report สรุปยอดลงทุนงานไปแล้วกี่บาท แต่ยังไม่ได้วางบิล/เดือน/ปี
      totalnotinvoicecost:notinvoicecost.length, // จำนวนยังไม่ได้วางบิล
      totalnotinvoicecostprice:notinvoicecost.reduce((sum, item) => sum + item.total, 0), //ยอดขายที่ยังไม่ได้วางบิล
      

    }
    return res.status(200).json({ status: true,header:header,dashboard:dashboard,invoice:invoice,invoiceunpaid:invoiceunpaid,notinvoice:notinvoice,notinvoicecost:notinvoicecost});
  }
  catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}
//report  Cash Flow
module.exports.reportcashflow = async (req,res)=>{
  try{
    const id = req.body.id;
    let date = req.body.date;
    //รายรับ
    const invoicedata= await Invoice.find().populate("account_id").populate("order_id");
    //ข้อมูลรายจ่าย
    const purchaseorderdata = await Purchaseorder.find().populate("quotation_id").populate("sale_id").populate("procurement_id").populate("supplier_id");
    let header = ''
    let currentMonth = ''
    let currentYear = ''
    if(date ==null)
    {
      currentMonth = new Date().getMonth() + 1;
      currentYear = new Date().getFullYear(); 
    }else
    {
     const currentDate =  new Date(req.body.date)
     currentDate.setDate(currentDate.getDate() + 1);

      currentMonth =currentDate.getMonth() + 1;
      currentYear = currentDate.getFullYear();
    }
    
    if(id =="cashflow"){
      header = "report cashflow เดือน"+convertToThaiMonth(currentMonth)+" "+currentYear;
    }else{
      header = "report cashflow แบบคาดการณ์ เดือน"+convertToThaiMonth(currentMonth)+" "+currentYear;
    }

     //report รายการรับเงิน - รับจ่าย
     const cashflow = [];
      //ดึงข้อมูลรายจ่าย

      const purchaseorder = purchaseorderdata.filter((item)=>item?.statusapprove == true &&   new Date(item.approvedetail[item?.approvedetail.length-1]?.date).getMonth() + 1 == currentMonth && new Date(item.approvedetail[item?.approvedetail.length-1]?.date).getFullYear() == currentYear);
      purchaseorder.forEach((item)=>{
      
        const createdAt = new Date(item?.approvedetail[item?.approvedetail.length-1]?.date);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1

        const weekNumber = getWeek(createdAt);
        const { startDate, endDate } = getWeekStartAndEndDates(weekNumber);
        const weeklyflowIndex = cashflow.findIndex(
          (weekly) => weekly.year === year && weekly.startDate.getTime() === startDate.getTime() && weekly.endDate.getTime() === endDate.getTime()
        );
        if (weeklyflowIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          cashflow[weeklyflowIndex].totalcost += calculatorrate(item?.alltotal,item?.rateprice);
          cashflow[weeklyflowIndex].ordercost.push(item);
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          cashflow.push({
            year: year,
            month: month,
            weekNumber: weekNumber,
            startDate: startDate,
            endDate: endDate,
            //รายจ่าย
            totalcost:calculatorrate(item?.alltotal,item?.rateprice),
            ordercost:[item],
            //รายรับ
            totalincome:0,
            orderincome:[],
          });
        }

      })


      //ดึงข้อมูลรายรับ
      if(id !="cashflow"){
        // console.log("คาดการณ์การวางบิล");
        const predict  = invoicedata.filter((item)=>item?.stauts == "คาดการณ์การวางบิล" && new Date(item?.datepredictpaybill).getMonth() + 1 == currentMonth && new Date(item?.datepredictpaybill).getFullYear() == currentYear);
        predict.forEach((item)=>{
          const createdAt = new Date(item?.datepredictpaybill);
          const year = createdAt.getFullYear();
          const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1

          const weekNumber = getWeek(createdAt);
          const { startDate, endDate } = getWeekStartAndEndDates(weekNumber);
          const weeklyflowIndex = cashflow.findIndex(
            (weekly) => weekly.year === year && weekly.startDate.getTime() === startDate.getTime() && weekly.endDate.getTime() === endDate.getTime()
          );
          if (weeklyflowIndex !== -1) {
            // ถ้ามีข้อมูลรายเดือนแล้ว
            cashflow[weeklyflowIndex].totalincome += calculatorrate(item?.total,item?.rateprice);
            cashflow[weeklyflowIndex].orderincome.push(item);
          } else {
            // ถ้ายังไม่มีข้อมูลรายเดือน
            cashflow.push({
              year: year,
              month: month,
              weekNumber: weekNumber,
              startDate: startDate,
              endDate: endDate,
              //รายจ่าย
              totalcost:0,
              ordercost:[],
              //รายรับ
              totalincome:calculatorrate(item?.total,item?.rateprice),
              orderincome:[item],
            });
          }
        })  
      }

      const invoice = invoicedata.filter((item)=>item?.stauts == "ชำระเงินแล้ว" && new Date(item?.dateofpayment).getMonth() + 1 == currentMonth && new Date(item?.dateofpayment).getFullYear() == currentYear);
      invoice.forEach((item)=>{
        const createdAt = new Date(item?.dateofpayment);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1

        const weekNumber = getWeek(createdAt);
        const { startDate, endDate } = getWeekStartAndEndDates(weekNumber);
        const weeklyflowIndex = cashflow.findIndex(
          (weekly) => weekly.year === year && weekly.startDate.getTime() === startDate.getTime() && weekly.endDate.getTime() === endDate.getTime()
        );
        if (weeklyflowIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          cashflow[weeklyflowIndex].totalincome += calculatorrate(item?.alltotal,item?.rateprice);
          cashflow[weeklyflowIndex].orderincome.push(item);
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          cashflow.push({
            year: year,
            month: month,
            weekNumber: weekNumber,
            startDate: startDate,
            endDate: endDate,
            //รายจ่าย
            totalcost:0,
            ordercost:[],
            //รายรับ
            totalincome:calculatorrate(item?.total,item?.rateprice),
            orderincome:[item],
          });
        }
      })

      return res.status(200).json({ status: true,header:header,cashflow:cashflow});
    // const cashflowdata = currentdata.filter((item)=>item.);

  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }

}

//report กำไร -ขาดทุน  และ ค่าภาษีนำเข้า
module.exports.reportprofitandloss = async (req,res)=>{
  try{
    const id = req.body.id;
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id").populate("customer_id").populate("procurement_id")
    .populate("purchaseorder._id");
    let currentdata = ''
    let header = ''
    if(id =="month")
    {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata = orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata = orderdata.filter((item) => {
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
      }
      else{
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    }
    else{
      currentdata= orderdata
      header= "ทั้งหมด"
    }
    const ReportProfits = [];
    const dataprofits = currentdata.filter(items => items.status == "จัดส่งสมบูรณ์");
    dataprofits.forEach((item)=>{
      let cost = 0;
      let importtax = 0;
      let shippingcost = 0;
      let operationcost = 0;
      let purchaseorder =item?.purchaseorder
      purchaseorder.forEach((item2)=>{  
        cost += item2?._id?.alltotal;
        importtax += item2?._id?.importtax;
        shippingcost += item2?._id?.shippingcost;
        operationcost += item2?._id?.operationcost;
      })
      const data = {
        order_id: item._id,
        date: item.createdAt,
        reforder: item.reforder,
        customer: item?.customer_id?.name,
        sale: item?.sale_id?.firstname + " " + item?.sale_id?.lastname,
        procurement: (item.procurement_id != null?item?.procurement_id?.firstname + " " + item?.procurement_id?.lastname:"ยังไม่มีผู้จัดซื้อ"),
        totalall: (item?.quotation_id != null? calculatorrate(item?.quotation_id?.alltotal,item?.quotation_id?.rateprice) :0),
        cost: cost,
        importtax: importtax,
        shippingcost: shippingcost,
        operationcost: operationcost,
        profit: (item?.quotation_id != null? calculatorrate(item?.quotation_id?.alltotal-cost-importtax-shippingcost-operationcost,item?.quotation_id?.rateprice):0),
      }
      ReportProfits.push(data);
    })
    //report ค่าขนส่งใน ประเทศ และต่างประเทศ /เดือน /ปี
    const shippingcost = [];
    const shippingdata = orderdata.filter((item)=>item?.status == "จัดส่งสมบูรณ์");
    shippingdata.forEach((item)=>{
        let importtax = 0;
        item.purchaseorder.forEach((item2)=>{ 
          importtax += item2?._id?.importtax;  
        })
        let vat = 0;
        vat = item.quotation_id.tax 
      
      if(id == "month"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // เดือนเริ่มที่ 1
        const monthlyShippingIndex = shippingcost.findIndex(
          (monthly) => monthly.year === year && monthly.month === month
        );
          
        if (monthlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว

          shippingcost[monthlyShippingIndex].importtax += importtax;
          shippingcost[monthlyShippingIndex].vat += vat;
        
          shippingcost[monthlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            month: month,
            orderlength: 1,
            importtax: importtax,
            vat: vat,
            
          });
        }
      }else if(id =="quarter"){
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const quarter = getQuarter(createdAt);
        const quarterlyShippingIndex = shippingcost.findIndex(
          (quarterly) => quarterly.year === year && quarterly.quarter === quarter
        );
        if (quarterlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          shippingcost[quarterlyShippingIndex].importtax += importtax;
          shippingcost[quarterlyShippingIndex].vat += vat;
          shippingcost[quarterlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            quarter: quarter,
            importtax: importtax,
            vat: vat,
            orderlength: 1,
          });
        }
      }
      else{
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const yearlyShippingIndex = shippingcost.findIndex(
          (yearly) => yearly.year === year
        );
        if (yearlyShippingIndex !== -1) {
          // ถ้ามีข้อมูลรายเดือนแล้ว
          
          shippingcost[yearlyShippingIndex].importtax += importtax;
          shippingcost[yearlyShippingIndex].vat += vat;
          shippingcost[yearlyShippingIndex].orderlength += 1;
        } else {
          // ถ้ายังไม่มีข้อมูลรายเดือน
          shippingcost.push({
            year: year,
            importtax: importtax,
            vat: vat,
            orderlength: 1,
          });
        }
      }
    })

    const dashboard = {
      totalorder:dataprofits.length,  
      totalprofit:ReportProfits.reduce((sum, item) => sum + item.profit, 0),
    }


    return res.status(200).json({ status: true,header:header,dashboard:dashboard,reportprofits:ReportProfits,shippingcost:shippingcost});
  }
  catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}


//dashboard  Procurement Department
module.exports.dashboardprocurement = async (req,res)=>{
    try{
      const id = req.body.id;
      const procurement_id = req.body.user_id;
      const procurement = await User.findById(procurement_id);
      const purchaseorder = await Purchaseorder.find({procurement_id:procurement_id}).populate("quotation_id").populate("sale_id").populate("procurement_id");
      let header = ''
      let currentdata = ''
      if(id =="month")
      {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        currentdata =  purchaseorder.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
        header = convertToThaiMonth(currentMonth)+" "+currentYear;
      }
      else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata =  purchaseorder.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
      }
      else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata =  purchaseorder.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
      header = `ปี ${currentYear}`;
      }
      else if(id =="other"){
      const date = req.body.date
      if(date.length ==2){
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        currentdata =  purchaseorder.filter((item) => {
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
      currentdata=  purchaseorder
      header= "ทั้งหมด"
      }
      //เปิดใบสั่งซื้อไปเท่าไหร่
      const openpurchaseorder = currentdata.length;
      
      //อนุมัติไปกี่ใบ
      const approvepurchaseorder = currentdata.filter((item)=>item?.statusapprove == true).length;
      //สินค้าสั่งซื้อถึงเราแล้วไปกี่่ออเดอร์
      const orderreceive = currentdata.filter((item)=>item?.statusshipping ==true).length;

     
      
      const dashboard ={
        //เปิดใบสั่งซื้อไปเท่าไหร่
        openpurchaseorder:openpurchaseorder,
        //อนุมัติไปกี่ใบ
        approvepurchaseorder:approvepurchaseorder,
        //สินค้าสั่งซื้อถึงเราแล้วไปกี่่ออเดอร์
        orderreceive:orderreceive,
      }
      
     
      return res.status(200).json({ status: true,header:header,dashboard:dashboard,user:procurement});

    }catch(error){
      return res.status(500).send({status:false,error:error.message});
    }
}

//dashboard  Logistic & Shipping Department
module.exports.dashboardlogistic = async (req,res)=>{
  try{
    const id = req.body.id;
    const logistic_id = req.body.user_id;
    const logistic = await User.findById(logistic_id);
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id")
    .populate("customer_id").populate("procurement_id").populate("purchaseorder._id")
    .populate({
      path:'invoiceid',
      populate:[
        {path:'account_id'}
      ]
    });
    let header = ''
    let currentdata = ''
    if(id =="month")
    {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      currentdata =  orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
      header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    else if (id === "quarter") {
    // กรณีเลือก "quarter"
    const currentQuarter = getQuarter(new Date());
    currentdata =  orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
    header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
    // กรณีเลือก "year"
    const currentYear = new Date().getFullYear();
    currentdata =  orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
    header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
    const date = req.body.date
    if(date.length ==2){
      const startDate = new Date(date[0]);
      const endDate = new Date(date[1]);
      currentdata =  orderdata.filter((item) => {
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
    currentdata=  orderdata
    header= "ทั้งหมด"
    }
    //จัดส่งไปแล้วกี่งาน
    const delivery = currentdata.filter((item)=>item?.date_delivery != null).length;
		//ลูกค้าตรวจรับแล้วกี่งาน
    const customercheck = currentdata.filter((item)=>item?.deliverycustomerstatus == true).length;    
    const dashboard ={
      //จัดส่งไปแล้วกี่งาน
      delivery:delivery,
      //ลูกค้าตรวจรับแล้วกี่งาน
      customercheck:customercheck,
    }
    
   
    return res.status(200).json({ status: true,header:header,dashboard:dashboard,user:logistic});

  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
}

//dashboard  Account Department
module.exports.dashboardaccount = async (req,res)=>{
  try{
    const id = req.body.id;
    const account_id = req.body.user_id;
    const account = await User.findById(account_id);
    const orderdata = await Order.find().populate("quotation_id").populate("sale_id")
    .populate("customer_id").populate("procurement_id").populate("purchaseorder._id")
    .populate({
      path:'invoiceid',
      populate:[
        {path:'account_id'}
      ]
    });
    let header = ''
    let currentdata = ''
    if(id =="month")
    {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      currentdata =  orderdata.filter(items => new Date(items.createdAt).getMonth() + 1 == currentMonth && new Date(items.createdAt).getFullYear() == currentYear);
      header = convertToThaiMonth(currentMonth)+" "+currentYear;
    }
    else if (id === "quarter") {
    // กรณีเลือก "quarter"
    const currentQuarter = getQuarter(new Date());
    currentdata =  orderdata.filter(items => getQuarter(new Date(items.createdAt)) === currentQuarter);
    header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    }
    else if (id === "year") {
    // กรณีเลือก "year"
    const currentYear = new Date().getFullYear();
    currentdata =  orderdata.filter(items => new Date(items.createdAt).getFullYear() == currentYear);
    header = `ปี ${currentYear}`;
    }
    else if(id =="other"){
    const date = req.body.date
    if(date.length ==2){
      const startDate = new Date(date[0]);
      const endDate = new Date(date[1]);
      currentdata =  orderdata.filter((item) => {
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
    currentdata=  orderdata
    header= "ทั้งหมด"
    }

    //มีออเดอร์ที่ยังไม่ได้วางบิลกี่งาน
    const notinvoice = currentdata.filter((item)=>item?.invoiceid == null && item?.dealstatus == true).length;
    //วางบิลแล้วกี่ออเดอร์
    const invoice = currentdata.filter((item)=>item?.invoiceid != null).length;
    //ยังไม่ได้ชำระเงินกี่ออเดอร์
    const notpayment = currentdata.filter((item)=>item?.invoiceid != null && item?.invoiceid?.stauts == "รอชำระเงิน").length;
    //ชำระเงินกี่้ออเดอร์
    const payment = currentdata.filter((item)=>item?.invoiceid != null && item?.invoiceid?.stauts == "ชำระเงินแล้ว").length;

    const dashboard ={
      //มีออเดอ์ที่ยังไม่ได้วางบิลกี่งาน
      notinvoice:notinvoice,
      //วางบิลแล้วกี่ออเดอร์
      invoice:invoice,
      //ยังไม่ได้ชำระเงินกี่ออเดอร์
      notpayment:notpayment,
      //ชำระเงินกี่้ออเดอร์
      payment:payment,
    }
    
   
    return res.status(200).json({ status: true,header:header,dashboard:dashboard,user:account});

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


  // ฟังก์ชั่นคำนวณเวลาที่ใช้ในการดีล
  const caltime = (startdate,enddate) => {
    const date1 = new Date(startdate);
    const date2 = new Date(enddate);
    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }; 


  // Function สำหรับหาสัปดาห์
function getWeek(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return week;
}

// Function สำหรับหาวันแรกและวันสุดท้ายของสัปดาห์
function getWeekStartAndEndDates(weekNumber) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const onejan = new Date(currentYear, 0, 1);
  const firstDayOfYear = onejan.getDay();
  const dayOfWeek = firstDayOfYear > 0 ? firstDayOfYear - 1 : 6; // ตั้งแต่ 0 (วันอาทิตย์) ถึง 6 (วันเสาร์)

  const startDate = new Date(currentYear, 0, 1 + ((weekNumber - 1) * 7) - dayOfWeek);
  const endDate = new Date(currentYear, 0, 1 + ((weekNumber - 1) * 7) - dayOfWeek + 6);
  
  return { startDate, endDate };
}