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
                message: 'CREATE SUCCESS ',
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


            comments.forEach(async (comment, index) => {
                const user = await User.findOne({
                    where: { email: comment.email }
                })

                comments[index].dataValues.name = user.dataValues.name
                comments[index].dataValues.avata = user.dataValues.avatar
                console.log('huyhuy1111', comments);

                if (index + 1 === comments.length) {
                    resolve({
                        status: 'OK',
                        message: 'GET ALL SUCCESS',
                        data: comments
                    })
                }
            });
        } catch (error) {
            reject(error);
        }
    })

    // createUser: (newUser) => new Promise(async (resolve, reject) => {
    //     try {
    //         const { email, password, confirmPassword } = newUser;
    //         const user = await User.findOne({ where: { email } });
    //         console.log(user)
    //         if (user) return resolve({
    //             status: 'ERR',
    //             message: 'Email is exit'
    //         });

    //         const hash = bcrypt.hashSync(password, 10)

    //         const data = await User.create({
    //             email: email,
    //             password: hash
    //         })
    //         resolve({
    //             status: 'OK',
    //             message: 'CREATE SUCCESS ',
    //             data
    //         })
    //     } catch (error) {
    //         reject(error);
    //     }
    // }),

    // loginUser: (userLogin) => new Promise(async (resolve, reject) => {
    //     const { email, password } = userLogin;
    //     try {
    //         const user = await User.findOne({ where: { email } });
    //         if (user === null) return resolve({
    //             status: 'ERR',
    //             message: 'Email is not exit'
    //         });

    //         const comparePassword = bcrypt.compareSync(password, user.password)

    //         if (!comparePassword) return resolve({
    //             status: 'ERR',
    //             message: 'Password is not correct'
    //         });


    //         const access_token = await generalAccessToken({
    //             id: user.id,
    //             isAdmin: user.isAdmin
    //         })

    //         console.log('access_token', access_token)

    //         const refresh_token = await generalRefreshToken({
    //             id: user.id,
    //             isAdmin: user.isAdmin
    //         })

    //         resolve({
    //             status: 'OK',
    //             message: 'SUCCESS',
    //             access_token,
    //             refresh_token
    //         })

    //     } catch (error) {
    //         reject(error);
    //     }
    // }),

    // updateUser: (id, data) => new Promise(async (resolve, reject) => {
    //     try {
    //         console.log('cap nhat ', id);
    //         const user = await User.findOne({ where: { id: id } });
    //         if(!data.email) {
    //             data.email = user.email;
    //         }
    //         if (user === null) return resolve({
    //             status: 'ERR',
    //             message: 'User is not exit'
    //         })

    //         const checkEmail = await User.findOne({ where: { email: data.email } });

    //         if (checkEmail != null && checkEmail.id != user.id) {
    //             resolve({
    //                 status: 'ERR',
    //                 message: 'Email is already use'
    //             })
    //         }

    //         if (data.password) {
    //             const password = data.password;
    //             data.password = bcrypt.hashSync(password, 10)
    //         }
    //         console.log('data nhan duoc', data);
    //         await User.update(data, { where: { id: id } });

    //         const updatedUser = await User.findOne({ where: { id } });
    //         console.log('udpate thanh cong', updatedUser);
    //         resolve({
    //             status: 'OK',
    //             message: 'SUCCESS',
    //             data: updatedUser
    //         })

    //     } catch (error) {
    //         reject(error);
    //     }
    // }),

    // deleteUser: (id) => new Promise(async (resolve, reject) => {
    //     try {
    //         const user = await User.findOne({ where: { id: id } });
    //         if (user === null) return resolve({
    //             status: 'ERR',
    //             message: 'Email is already use'
    //         })

    //         const deletedUser = await User.destroy({ where: { id: id } });

    //         resolve({
    //             status: 'OK',
    //             message: 'DELETE SUCCESS',
    //             deletedUser
    //         })

    //     } catch (error) {
    //         reject(error);
    //     }
    // }),
    // deleteManyUser: (id) => new Promise(async (resolve, reject) => {
    //     try {
    //         await User.destroy({ where: { id: ids } });
    //         resolve({
    //             status: 'OK',
    //             message: 'Delete users success',
    //         })

    //     } catch (error) {
    //         reject(error);
    //     }
    // }),

    // getAllUser: (id) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const allUsers = await User.findAll();
    //             resolve({
    //                 status: 'OK',
    //                 message: 'GET ALL SUCCESS',
    //                 data: allUsers
    //             })

    //         } catch (error) {
    //             reject(error);
    //         }
    //     })
    // },

    // getDetailUser: (id) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const user = await User.findOne({ where: { id: id } });

    //             if (user === null) {
    //                 resolve({
    //                     status: 'ERR',
    //                     message: 'User is not exist'
    //                 })
    //             }

    //             resolve({
    //                 status: 'OK',
    //                 message: 'GET USER SUCCESS',
    //                 data: user
    //             })

    //         } catch (error) {
    //             reject(error);
    //         }
    //     })
    // }

}



module.exports = commentService