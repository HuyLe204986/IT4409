const ProductService = require('../services/ProductService')

const productController = {
    createProduct: async (req, res) => {
        try {
            const { name, image, type, countInStock, price, rating } = req.body
            if (!name || !image || !type || !countInStock || !price || !rating ) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'Input is required'
                })
            }
            const response = await ProductService.createProduct(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id
            const data = req.body
            console.log(productId)
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'ProductId is required'
                })
            }
            const response = await ProductService.updateProduct(productId, data)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    },
    getDetailProduct: async (req, res) => {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'ProductId is required'
                })
            }
            const response = await ProductService.getDetailsProduct(productId)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'ProductId is required'
                })
            }
            const response = await ProductService.deleteProduct(productId)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    },
    getAllProduct: async (req, res) => {
        try {
            const { limit, page, sort, filter } = req.query
            const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    },
    deleteMany: async (req, res) => {
        try {
            const ids = req.body.ids
            if (!ids) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The ids is required'
                })
            }
            const response = await ProductService.deleteManyProduct(ids)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    },
    getAllType: async (req, res) => {
        try {
            const response = await ProductService.getAllType()
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }
}

module.exports = productController