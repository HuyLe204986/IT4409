const OrderService = require('../services/OrderService')
const orderController = {
    createOrder: async (req, res) => {
        try {
            const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
            if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
            const response = await OrderService.createOrder(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    getAllOrderDetails: async (req, res) => {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The userId is required'
                })
            }
            const response = await OrderService.getAllOrderDetails(userId)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    getDetailsOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            if (!orderId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The userId is required'
                })
            }
            const response = await OrderService.getOrderDetails(orderId)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    cancelOrderDetails: async (req, res) => {
        try {
            // console.log('body', req.body);
            const data = req.body.orderItems
            const orderId = req.body.orderId
            if (!orderId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The orderId is required'
                })
            }
            const response = await OrderService.cancelOrderDetails(orderId, data)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    getAllOrder: async (req, res) => {
        try {
            const data = await OrderService.getAllOrder()
            return res.status(200).json(data)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    }


}
module.exports = orderController

