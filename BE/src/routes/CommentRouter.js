const express = require("express");
const router = express.Router();
const commentController = require('../controllers/CommentController');


// router.post('/add', authUserMiddleWare, commentController.addComment)
// router.get('/get/:id', authUserMiddleWare, commentController.getComment)


router.post('/add', commentController.addComment)
router.get('/get/:id', commentController.getComment)

module.exports = router