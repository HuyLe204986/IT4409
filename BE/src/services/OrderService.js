const sequelize = require('sequelize');
const { Product, Order, OrderItem } = require("../models/index")

const orderService = {
    createOrder: (newOrder) => new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOne({
                    where: { id: order.product, countInStock: { [sequelize.Op.gte]: order.amount }, }
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
                            where: { id: order.product },
                        }
                    );

                    return {
                        status: 'OK',
                        message: 'CREATE ORDER SUCCESS',
                    };
                } else {
                    const product = await Product.findOne({
                        where: { id: order.product },
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
                        productId: order.product,
                    })
                })
                // console.log('OK');
                resolve({
                    status: 'OK',
                    message: 'create order success'
                })
            }
        } catch (e) {
            console.log('co loi xay ra');
            reject(e.message)
        }
    }),

    getAllOrderDetails: (id) => new Promise(async (resolve, reject) => {
        try {
            // console.log('userid', id);
            let orders = await Order.findAll({
                where: { userId: id },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            });

            // console.log('order sservice', orders);
            // console.log('order length', orders.length);
            if (orders === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            if(orders.length === 0) {
                resolve({
                    status: 'OK',
                    message: 'SUCESSS',
                    data: []
                })
            }
            orders.forEach(async (order, index) => {
                const orderItems = await OrderItem.findAll({
                    where: { orderId: order.id },
                    order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
                });
                // console.log('ỏderitems', orderItems);
                orders[index].dataValues.orderItems = orderItems;

                if (index + 1 == orders.length) {
                    // console.log('OK');
                    resolve({
                        status: 'OK',
                        message: 'SUCESSS',
                        data: orders
                    })
                }

            })

        } catch (e) {
            console.log('e', e)
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

            const promises = data.map(async (order) => {
                const productData = await Product.findOne({
                    where: { id: order.productId }
                })
                // console.log('productData', productData);
                if (productData) {
                    await Product.update(
                        {
                            countInStock: sequelize.literal(`countInStock + ${order.amount}`),
                            selled: sequelize.literal(`selled - ${order.amount}`),
                        },
                        {
                            where: { id: order.productId },
                        }
                    );
                }
                // console.log('id', order.id);
                await OrderItem.destroy({ where: { id: order.id } })

            })
            await Order.destroy({ where: { id: id } })

            resolve({
                status: 'OK',
                message: 'success',
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
    }),

    updateOrder: (orderId, isPaid, isDelivered) => new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findOne({where: {id: orderId}})
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'Order is not defined'
                })
            }

            await Order.update({isPaid, isDelivered},{ where: {id: orderId}});

            const updatedOrder = await Order.findOne({where: {id: orderId}});

            console.log('huyhuy333', orderId, updatedOrder);

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedOrder
            })
        } catch (e) {
            reject(e.message)
        }
    })
}

module.exports = orderService;


