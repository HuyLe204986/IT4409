const commentService = require('../services/CommentService')
const jwtService = require('../services/JwtService')

const commentController = {
    addComment: async (req, res) => {
        try {
            console.log(req.body);
            const { productId, email, content } = req.body;
            if (!email || !productId || !content) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'Vui lòng nhập đầy đủ thông tin'
                })
            }
            const response = await commentService.createComment(req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },
    getComment: async (req, res) => {
        try {
            const productId = req.params.id;
            const response = await commentService.getComment(productId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(404).json({ message: error?.message });
        }
    },

}
module.exports = commentController
