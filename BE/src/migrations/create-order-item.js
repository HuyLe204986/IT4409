'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      image: { type: Sequelize.TEXT, allowNull: false },
      price: { type: Sequelize.FLOAT, allowNull: false },
      discount: { type: Sequelize.FLOAT },
      orderId: { type: Sequelize.INTEGER, allowNull: false },
      productId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  }
};