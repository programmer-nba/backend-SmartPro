const Admin = require('../models/admin.schema')
const Employee = require('../models/employee.schema')
//สร้าง function เช็คชื่อซ้ำ2 ตาราง

async function Checkusername(username){
    const checkAdmin = await Admin.findOne({username:username})
    if(checkAdmin) return true
    const checkEmployee = await Employee.findOne({username:username})
    if(checkEmployee) return true    
    return false
}

const checkalluse = {
    Checkusername
};
module.exports = checkalluse