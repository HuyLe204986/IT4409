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
                    message: 'Input is required'
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

    // loginUser: async (req, res) => {
    //     try {
    //         console.log(req.body);
    //         const { email, password } = req.body;
    //         const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    //         const isCheckEmail = reg.test(email);
    //         if (!email || !password) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'The input is required'
    //             })
    //         } else if (!isCheckEmail) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'The input is email'
    //             })
    //         }
    //         const response = await userService.loginUser(req.body);
    //         const { refresh_token, ...newRespone } = response;
    //         res.cookie('refresh_token', refresh_token, {
    //             httpOnly: true,
    //             secure: false,
    //             samesite: 'strict'
    //         })
    //         return res.status(200).json(newRespone);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // },

    // updateUser: async (req, res) => {
    //     try {
    //         const userId = req.params.id;
    //         console.log('update',userId);
    //         const data = req.body;
    //         if (!userId) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'userId is requied'
    //             })
    //         }

    //         const response = await userService.updateUser(userId, data);
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // },

    // deleteUser: async (req, res) => {
    //     try {
    //         const userId = req.params.id;
    //         console.log(userId);
    //         const data = req.body;
    //         if (!userId) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'userId is requied'
    //             })
    //         }

    //         const response = await userService.deleteUser(userId);
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }

    // },

    // getAllUser: async (req, res) => {
    //     try {

    //         const response = await userService.getAllUser();
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }

    // },

    // getDetailUser: async (req, res) => {
    //     try {
    //         const userId = req.params.id;
    //         if (!userId) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'userId is requied'
    //             })
    //         }
    //         const response = await userService.getDetailUser(req.params.id);
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // },

    // refreshToken: async (req, res) => {
    //     try {
    //         const token = req.cookies.refresh_token;
    //         console.log(token)
    //         if (!token) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'token is requied'
    //             })
    //         }
    //         const response = await jwtService.refreshTokenService(token);
    //         return res.status(200).json(response);
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // },

    // logoutUser: async (req, res) => {
    //     try {
    //         res.clearCookie('refresh_token');
    //         return res.status(200).json({
    //             status: 'OK',
    //             message: 'Logout success'
    //         });
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // },

    // deleteMany: async (req, res) => {
    //     try {
    //         const ids = req.body.ids

    //         if (!ids) {
    //             return res.status(200).json({
    //                 status: 'ERR',
    //                 message: 'The ids is required'
    //             })
    //         }
    //         const response = await userService.deleteManyUser(ids)
    //         return res.status(200).json(response)
    //     } catch (error) {
    //         return res.status(404).json({ message: error?.message });
    //     }
    // }
}
module.exports = commentController
