const UserRouter = require('./UserRouter.js')
const ProductRouter = require('./ProductRouter.js')
const OrderRouter = require('./OrderRouter.js')
const CommentRouter = require('./CommentRouter.js')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/comment', CommentRouter)

}


module.exports = routes