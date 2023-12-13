const sequelize = require('sequelize');
const { Product, Order, OrderItem } = require("../models/index")

const orderService = {
    createOrder: (newOrder) => new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {

            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOne({
                    where: { id: order.productId, countInStock: { [sequelize.Op.gte]: order.amount }, }
                })


                // const productData = await Product.find({
                //     where: { id: order.productId, countInStock: { [sequelize.Op.gte]: order.amount }, }
                // });
                if (productData) {

                    await Product.update(
                        {
                            countInStock: sequelize.literal(`countInStock - ${order.amount}`),
                            selled: sequelize.literal(`selled + ${order.amount}`),
                        },
                        {
                            where: { id: order.productId },
                        }
                    );

                    return {
                        status: 'OK',
                        message: 'CREATE ORDER SUCCESS',
                    };
                } else {
                    const product = await Product.findOne({
                        where: { id: order.productId },
                    });
                    return {
                        status: 'ERR',
                        message: 'ERR',
                        name: product.name
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.name)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.name)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    fullName,
                    address,
                    phone,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    userId: user,
                    isPaid, paidAt
                })

                orderItems.forEach(async (order) => {
                    await OrderItem.create({
                        name: order.name,
                        amount: order.amount,
                        image: 'a',
                        price: order.price,
                        discount: order.discount,
                        orderId: createdOrder.id,
                        productId: order.productId,
                    })
                })
                resolve({
                    status: 'OK',
                    message: 'create order success'
                })
            }
        } catch (e) {
            reject(e.message)
        }
    }),

    getAllOrderDetails: (id) => new Promise(async (resolve, reject) => {
        try {
            let orders = await Order.findAll({
                where: { userId: id },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

            if (orders === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            orders.forEach(async (order, index) => {
                const orderItems = await OrderItem.findAll({
                    where: { orderId: order.id },
                    order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
                });
                orders[index].dataValues.orderItems = orderItems;

                if (index + 1 == orders.length) {
                    resolve({
                        status: 'OK',
                        message: 'SUCESSS',
                        data: orders
                    })
                }

            })
        } catch (e) {
            // console.log('e', e)
            reject(e.message)
        }
    }),

    getOrderDetails: (id) => new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findOne({ where: { id: id }, });
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            const orderItems = await OrderItem.findAll({
                where: { orderId: order.id },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

            order.dataValues.orderItems = orderItems;

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    }),
    cancelOrderDetails: (id, data) => new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    }),

    getAllOrder: () => new Promise(async (resolve, reject) => {
        try {
            let orders = await Order.findAll({
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

            if (orders === null) {
                resolve({
                    status: 'OK',
                    message: 'SUCESSS',
                    data: orders
                })
            }

            orders.forEach(async (order, index) => {
                const orderItems = await OrderItem.findAll({
                    where: { orderId: order.id },
                    order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
                });
                orders[index].dataValues.orderItems = orderItems;

                if (index + 1 == orders.length) {
                    resolve({
                        status: 'OK',
                        message: 'SUCESSS',
                        data: orders
                    })
                }

            })
        } catch (e) {
            reject(e.message)
        }
    })
}

module.exports = orderService;


