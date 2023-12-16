const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authAdminMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]
    console.log('h',req.headers);
    console.log('huy', req.headers.token);
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user){
        if(err){
            return res.status(404).json({
                message: 'authentication',
                status: 'ERROR'
            })
        }
        if(user?.isAdmin) {
            next();
        }else{
            return res.status(404).json({
                message: 'authentication not is admin',
                status: 'ERROR'
            })
        }
    })
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1];
    // console.log('header middle', req.headers);
    // console.log('tokennn', token);
    const userId = Number(req.params.id);
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user){
        if(err){
            return res.status(404).json({
                message: 'authentication',
                status: 'ERROR'
            })
        }
        if(user?.isAdmin || user.id === userId) {
            next();
        }else{
            console.log('huy', user.id, userId);
            return res.status(404).json({
                message: 'authentication not is user',
                status: 'ERROR'
            })
        }
    })
}

module.exports = {
    authAdminMiddleWare,
    authUserMiddleWare
}