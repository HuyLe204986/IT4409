const { reject } = require("bcrypt/promises");
const { Comment } = require("../models/index");
const { User } = require("../models/index");


const commentService = {
    createComment: (newComment) => new Promise(async (resolve, reject) => {
        try {
            const { productId, email, content } = newComment;

            const data = await Comment.create({
                productId,
                email,
                content
            })
            resolve({
                status: 'OK',
                message: 'Tạo comment thành công',
                data
            })
        } catch (error) {
            reject(error);
        }
    }),
    getComment: (productId) => new Promise(async (resolve, reject) => {
        try {

            const comments = await Comment.findAll({
                where: { productId },
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            })

            if (comments.length === 0) {
                resolve({
                    status: 'OK',
                    message: 'Không có comment',
                    data: []
                })
            } else {
                comments.forEach(async (comment, index) => {
                    const user = await User.findOne({
                        where: { email: comment.email }
                    })

                    comments[index].dataValues.name = user.dataValues.name
                    comments[index].dataValues.avata = user.dataValues.avatar

                    if (index + 1 === comments.length) {
                        resolve({
                            status: 'OK',
                            message: 'Lấy tất cả comment thành công',
                            data: comments
                        })
                    }
                });
            }
        } catch (error) {
            reject(error);
        }
    })

}



module.exports = commentService