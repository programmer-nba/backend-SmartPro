const Delivery = require('../../models/deliverynote/deliverynote.schema');
const Order = require('../../models/order/order.schema');

module.exports.accept = async (req, res) => {
    try {
        const id = req.params.id
        const deliverynote = await Delivery.findById(id)
        if (!deliverynote) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
        }
        const data = {
            status: true,
            statusdetail: [{
                status: "ออกใบส่งของสำเร็จ",
                date: Date.now()
            }]
        }
        const accept = await Delivery.findByIdAndUpdate(id, data, {new: true})
        const order = await Order.findById(deliverynote.order_id)
        if (!order) {
            return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
        }
        const orderStatus = {
            status: "รอจัดส่งให้ลูกค้า",
            deliverystatus:true
        }
        const updateOrder = await Order.findByIdAndUpdate(deliverynote.order_id, orderStatus, {new: true})
        return res.status(200).send({status: true, message: "คุณได้ออกใบส่งของเรียบร้อยแล้ว", data: accept,order:updateOrder});
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}