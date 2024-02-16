const Quotation = require("../../models/quotation/quotation.schema");
const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema");
const Producttype = require("../../models/product/producttype.schema");
const User = require("../../models/user/user.schema");
const Order = require("../../models/order/order.schema");

module.exports.ReportCost = async (req, res) => {
  try {
    const id = req.body.id;
    const orderdata = await Order.find()
      .populate({
        path: "quotation_id",
        populate: [
          { path: "customer_id" },
          { path: "user_id" },
          { path: "productdetail.product_id" },
        ],
      })
      .populate("purchaseorder._id")
      .populate("sale_id")
      .populate("customer_id");

    let currentdata = "";
    let header = "";

    if (id == "month") {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(
        (items) =>
          new Date(items.createdAt).getMonth() + 1 == currentMonth &&
          new Date(items.createdAt).getFullYear() == currentYear
      );
      header = convertToThaiMonth(currentMonth) + " " + currentYear;
    } else if (id === "quarter") {
      // กรณีเลือก "quarter"
      const currentQuarter = getQuarter(new Date());
      currentdata = orderdata.filter(
        (items) => getQuarter(new Date(items.createdAt)) === currentQuarter
      );
      header = `ไตรมาสที่ ${currentQuarter}  ปี ${new Date().getFullYear()}`;
    } else if (id === "year") {
      // กรณีเลือก "year"
      const currentYear = new Date().getFullYear();
      currentdata = orderdata.filter(
        (items) => new Date(items.createdAt).getFullYear() == currentYear
      );
      header = `ปี ${currentYear}`;
    } else if (id == "other") {
      const date = req.body.date;
      if (date.length == 2) {
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
        header = `ระหว่าง ${startDay} ${convertToThaiMonth(
          startMonth
        )} ${startYear} ถึง ${endDay} ${convertToThaiMonth(
          endMonth
        )} ${endYear}`;
      } else {
        return res.status(400).json("ส่งวันมาไม่ครบ");
      }
    } else {
      currentdata = orderdata;
      header = "ทั้งหมด";
    }

    return res
      .status(200)
      .json({ status: true, header: header, currentdata: currentdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ฟังก์ชั่น
function getQuarter(date) {
  const month = date.getMonth() + 1;
  return Math.ceil(month / 3);
}
const convertToThaiMonth = (month) => {
  // สร้างอาร์เรย์เดือนภาษาไทย
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // คืนค่าเดือนภาษาไทย
  return thaiMonths[month - 1];
};

const calculatorrate = (num, rate) => {
  const ratetotal = num * rate;
  return parseFloat(Math.ceil(ratetotal).toFixed(2));
};
