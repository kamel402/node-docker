const express = require('express')
const postController = require('../controller/post.controller');
const protect = require('../middlewares/auth.middleware')
const router = express.Router();

router
    .route("/")
    .get(protect, postController.getAllPost)
    .post(protect, postController.createPost)

router
    .route("/:id")
    .get(protect, postController.getPost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost)

module.exports = router