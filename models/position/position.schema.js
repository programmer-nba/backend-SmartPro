const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    position:{type:String},//ตำแหน่ง:
    permissions :{type:{
        //admin
            dashboardadmin:{type:Boolean,default:false},//dashboardadmin
            createuser:{type:Boolean,default:false}, //สร้าง user
            setposition:{type:Boolean,default:false},//กำหนดสิทธิ์การเข้าถึงตำแหน่ง
            //หัวข้อข้อมูลพื้นฐาน
            information:{type:Boolean,default:false}, //ข้อมูลพื้นฐาน
            typeproduct:{type:Boolean,default:false}, //ประเภทสินค้า
            typebusiness:{type:Boolean,default:false},//ประเภทธุรกิจ
            typebusinesscustomer:{type:Boolean,default:false},//ประเภทธุรกิจลูกค้า
            typelndustry:{type:Boolean,default:false},//ประเภทอุสาหกรรมลูกค้า
        //Sales Department
            //ทำใบเสนอราคา
             dashboardsale:{type:Boolean,default:false},//dashboardsale
             openorder:{type:Boolean,default:false},//เปิดออเดอร์
             compareprice:{type:Boolean,default:false},//ใบเปรียบเทียบราคา
             quotation:{type:Boolean,default:false},   //ใบเสนอราคา
             dealwork:{type:Boolean,default:false},//ดีลงานกับลูกค้า
             produt:{type:Boolean,default:false},//สินค้า
             customer:{type:Boolean,default:false},//ลูกค้า
             supplier:{type:Boolean,default:false},//ซัพพลายเออร์
        //Procurement Department
             dashboardprocurement:{type:Boolean,default:false},//dashboardprocurement
             openpurchaseorder:{type:Boolean,default:false},//เปิดใบสั่งซื้อ
             
             insurance:{type:Boolean,default:false},//เคลมสินค้า
        //Logistic & Shipping Department
            dashboardlogistic:{type:Boolean,default:false},//dashboardlogistic
            delivery:{type:Boolean,default:false},//จัดส่งสินค้า
        //Account Department
             dashboardaccount:{type:Boolean,default:false},//dashboardaccount
             invoice:{type:Boolean,default:false},//ใบแจ้งหนี้และวางบิล
             loan:{type:Boolean,default:false},//เงินกู้
        //Report & Analysis
            dashboardreport:{type:Boolean,default:false},//dashboardreport
            //แผนก Sales
            reportquotation:{type:Boolean,default:false},//report ใบเสนอราคา
            reportprice:{type:Boolean,default:false},//report ยอดขาย 
            reportsale:{type:Boolean,default:false},//report ค่าคอมมิสชั่นของ Sales Department

            //แผนก Procurement
            reportdeliverycustomers:{type:Boolean,default:false},//report การส่งสินค้าให้ลูกค้า
            reportproductstock:{type:Boolean,default:false},//report สินค้าค้างสต็อก
            reportsupplier:{type:Boolean,default:false},//report ซัพพลายเออร์
            reportprofit:{type:Boolean,default:false},//report กำไรและค่าใช้จ่าย

            //แผนก Accounting
            reportbill:{type:Boolean,default:false},//report ยอดขายวางบิล
            reportcashflow:{type:Boolean,default:false},//report cashflow
            reportprofitlossaccount:{type:Boolean,default:false},//report กำไร - ขาดทุน ค่าภาษีนำเข้า และ vat แต่ละเดือน

        //Manager Department
            dashboardmanager:{type:Boolean,default:false},//dashboardmanager
            //อนุมัติ
                managerquotation:{type:Boolean,default:false},//ใบเสนอราคา
                managerpurchaseorder:{type:Boolean,default:false},//ใบสั่งซื้อ
                managerdeliverynote:{type:Boolean,default:false},//ใบส่งของ
                managerinvoice:{type:Boolean,default:false},// ใบวางบิลและใบแจ้งหนี้
            orderall:{type:Boolean,default:false},//ดูออเดอร์ทั้งหมด
            supplierall:{type:Boolean,default:false},//ซัพพลายเออร์ทั้งหมด
            customerall:{type:Boolean,default:false}//ลูกค้าทัั้งหมด
        
    },default:null},//สิทธิ์:
  },
  {timestamps: true}
);

const Position = mongoose.model("position", positionSchema);

module.exports = Position;