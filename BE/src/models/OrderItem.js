'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
        }
    }
    OrderItem.init({
        name: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.TEXT, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        discount: { type: DataTypes.FLOAT },
        orderId: {type: DataTypes.INTEGER, allowNull: false},
        productId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'OrderItem',
    });
    return OrderItem;
};