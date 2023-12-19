'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
        }
    }
    Product.init({
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        image: { type: DataTypes.TEXT, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.NUMBER, allowNull: false },
        countInStock: { type: DataTypes.NUMBER, allowNull: false },
        rating: { type: DataTypes.NUMBER, allowNull: false },
        description: { type: DataTypes.TEXT },
        discount: { type: DataTypes.NUMBER },
        selled: { type: DataTypes.NUMBER }
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};