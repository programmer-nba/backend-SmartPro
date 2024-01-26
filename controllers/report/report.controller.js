const Quotation = require("../../models/quotation/quotation.schema");

module.exports.reportquotationprice = async (req, res) => {
    try {
        //รายเดือน 
        const monthlyQuotationCount = await Quotation.aggregate([
            {
              $group: {
                _id: {
                  month: { $month: '$createdAt' }, // ใช้ $month เพื่อรวมตามเดือน
                  year: { $year: '$createdAt' },   // ใช้ $year เพื่อรวมตามปี
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
          monthData .sort((a, b) => {
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
                      if: { $lte: [{ $month: '$createdAt' }, 3] }, // ไตรมาส 1
                      then: 1,
                      else: {
                        $cond: {
                          if: { $lte: [{ $month: '$createdAt' }, 6] }, // ไตรมาส 2
                          then: 2,
                          else: {
                            $cond: {
                              if: { $lte: [{ $month: '$createdAt' }, 9] }, // ไตรมาส 3
                              then: 3,
                              else: 4, // ไตรมาส 4
                            },
                          },
                        },
                      },
                    },
                  },
                  year: { $year: '$createdAt' }, // ใช้ $year เพื่อรวมตามปี
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
                  year: { $year: '$createdAt' }, // ใช้ $year เพื่อรวมตามปี
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
                _id: '$user_id',
                totalQuotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails',
              },
            },
            {
              $unwind: '$userDetails',
            },
            {
              $project: {
                _id: 0,
                userId: '$_id',
                firstname: '$userDetails.firstname',
                lastname: '$userDetails.lastname',
                totalQuotations: 1,
              },
            },
          ]);

          /////////////////
          const currentMonth = new Date().getMonth() + 1; // หาเดือนปัจจุบัน
          const currentQuarter = Math.ceil(currentMonth / 3); // หาไตรมาสปัจจุบัน
          const currentYear = new Date().getFullYear(); // หาปีปัจจุบัน

          const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
          const lastDayOfMonth = new Date(currentYear, currentMonth, 0); // 0 คือวันสุดท้ายของเดือนก่อนหน้า
          const sale_month =  await Quotation.aggregate([
            {
                $match: {
                  'createdAt': {
                    $gte: firstDayOfMonth,
                    $lt: lastDayOfMonth,
                  },
                },
            },
            {
                $group: {
                  _id: '$user_id',
                  totalQuotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'userDetails',
                },
              },
              {
                $unwind: '$userDetails',
              },
              {
                $project: {
                  _id: 0,
                  userId: '$_id',
                  firstname: '$userDetails.firstname',
                  lastname: '$userDetails.lastname',
                  totalQuotations: 1,
                },
              },

          ])
          sale_month.sort((a, b) => a.totalQuotations - b.totalQuotations);
          const firstDayOfQuarter = new Date(currentYear, (currentQuarter - 1) * 3, 1);
          const lastDayOfQuarter = new Date(currentYear, currentQuarter * 3, 0); 
          const sale_quarter =  await Quotation.aggregate([
            {
                $match: {
                  'createdAt': {
                    $gte: firstDayOfQuarter,
                    $lt: lastDayOfQuarter,
                  },
                },
            },
            {
                $group: {
                  _id: '$user_id',
                  totalQuotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'userDetails',
                },
              },
              {
                $unwind: '$userDetails',
              },
              {
                $project: {
                  _id: 0,
                  userId: '$_id',
                  firstname: '$userDetails.firstname',
                  lastname: '$userDetails.lastname',
                  totalQuotations: 1,
                },
              },

          ])
          sale_quarter.sort((a, b) => a.totalQuotations - b.totalQuotations);
          const firstDayOfYear = new Date(currentYear, 0, 1);
          const lastDayOfYear = new Date(currentYear, 11, 31);
          const sale_year =  await Quotation.aggregate([
            {
                $match: {
                  'createdAt': {
                    $gte: firstDayOfYear,
                    $lt: lastDayOfYear,
                  },
                },
            },
            {
                $group: {
                  _id: '$user_id',
                  totalQuotations: { $sum: 1 }, // นับจำนวนใบเสนอราคาทั้งหมด
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'userDetails',
                },
              },
              {
                $unwind: '$userDetails',
              },
              {
                $project: {
                  _id: 0,
                  userId: '$_id',
                  firstname: '$userDetails.firstname',
                  lastname: '$userDetails.lastname',
                  totalQuotations: 1,
                },
              },

          ])
          sale_year.sort((a, b) => a.totalQuotations - b.totalQuotations);
          return res.status(200).json({ status: true, month: monthData ,quarterly:quarterlyData ,year:yearData
            ,sale:sale
            ,sale_month:sale_month
            ,sale_quarter:sale_quarter
            ,sale_year:sale_year
            });
      
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };

module.exports.reportquotation = async (req,res)=>{
    try {
        const totalquotation =[];
        const quotationdata = await Quotation.find();
        quotationdata.forEach(items => {
            const year = new Date(items.createdAt).getFullYear();   
            const find = totalquotation.findIndex(item=>item.year == year)
            console.log(items?.statusdealdetail[items.statusdealdetail?.length-1]?.status)
            if(find!=-1){
                totalquotation[find].count += 1
                totalquotation[find].totalprofit += items.alltotal
                
                // if(items.statusdealdetail[items.statusdealdetail.length-1].status =="ดีลงานผ่าน")
                // {
                //     totalquotation[find].pass +=1;
                // }
                // if(items.statusdealdetail.length<=0 || items.statusdealdetail[items.statusdealdetail.length-1]?.status =="อยู่ระหว่างการดีลงานกับลูกค้า")
                // {
                //     totalquotation[find].dealwork +=1;
                // }
                // if(items.statusdealdetail[items.statusdealdetail.length-1].status =="ดีลงานไม่ผ่าน")
                // {
                //     totalquotation[find].nopass +=1;
                // }
            }else{
                totalquotation.push({
                    year: year,
                    count:1,
                    totalprofit: items.alltotal,
                    // pass:(items.statusdealdetail[items.statusdealdetail.length-1].status =="ดีลงานผ่าน"? 1:0),
                    // dealwork:( items.statusdealdetail.length<=0 || items?.statusdealdetail[items.statusdealdetail.length-1]?.status =="อยู่ระหว่างการดีลงานกับลูกค้า"? 1:0),
                    // nopass:(items.statusdealdetail[items.statusdealdetail.length-1].status =="ดีลงานไม่ผ่าน"? 1:0),
                })
            }
        });

        return res.status(200).json({ status: true, totalquotation:totalquotation });

    }catch (error) {
        return res.status(500).send({ status: false, error: error.message });
      }

}