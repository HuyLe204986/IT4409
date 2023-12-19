const { Product } = require("../models/index")
const { Op } = require('sequelize');

const { reject } = require("bcrypt/promises");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const productService = {
    createProduct: (newProduct) => new Promise(async (resolve, reject) => {
        const { name, image, type, countInStock, price, rating, description, discount } = newProduct

        try {
            const product = await Product.findOne({ where: { name: name } })
            if (product !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Tên của sản phẩm đã tồn tại'
                })
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                countInStock: Number(countInStock),
                price,
                rating,
                description,
                selled: 0,
                discount: Number(discount),
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'Thêm sản phẩm thành công',
                    data: newProduct
                })
            }
        } catch (error) {
            reject(error)
        }
    }),

    updateProduct: (id, data) => new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ where: { id } })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại'
                })
            }

            await Product.update(data, { where: { id: id } });

          
            const updatedProduct = await Product.findOne({where: {id}});


            resolve({
                status: 'OK',
                message: 'Sửa sản phẩm thành công',
                data: updatedProduct
            })
        } catch (error) {
            reject(error);
        }
    }),

    getDetailsProduct: (id) => new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ where: { id } })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại'
                })
            }

            resolve({
                status: 'OK',
                message: 'Lấy chi tiết sản phẩm thành công',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    }),

    deleteProduct: (id) => new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ where: { id } })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại'
                })
            }

            await Product.destroy({ where: { id: id } });
            resolve({
                status: 'OK',
                message: 'Xóa sản phẩm thành công',
            })
        } catch (e) {
            reject(e)
        }
    }),

    getAllProduct: (limit, page, sort, filter) => new Promise(async (resolve, reject) => {
        try {
            const options = {
                limit: limit || undefined,
                offset: limit && page ? page * limit : undefined,
                order: sort
                    ? [[sort[1], sort[0]]]
                    : [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            };
            if (filter) {
                const label = filter[0];
                const value = filter[1];
                console.log(label, value);
                options.where = {
                    [label]: { [Op.like]: `%${value}%` },
                };
            }

            const result = await Product.findAndCountAll(options);

            const totalProduct = result.count;
            const allProduct = result.rows;

            resolve({
                status: 'OK',
                message: 'Lấy sản phẩm thành công',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    }),

    deleteManyProduct: (ids) => new Promise(async (resolve, reject) => {
        try {
            await Product.destroy({ where: { id: ids } });
            resolve({
                status: 'OK',
                message: 'Xóa nhiều sản phẩm thành công',
            })
        } catch (e) {
            reject(e)
        }
    }),

    getAllType: () => new Promise(async (resolve, reject) => {
        try {
            const uniqueTypes = await Product.findAll({ group: ['type'] });

            const types = uniqueTypes.map((row) => row.type);

            resolve({
                status: 'OK',
                message: 'Lấy tất cả loại sản phẩm thành công',
                data: types,
            })
        } catch (e) {
            reject(e)
        }
    }),

}



module.exports = productService