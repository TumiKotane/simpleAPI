const express = require('express');
const { 
    createPost, 
    feed, 
    getPost, 
    getUserPosts, 
    updatePost, 
    deletePost
} = require('../controllers/postController');
// const authorize = require('../middleware/Authorize');

const router = express.Router();

router.post('/create', createPost);
router.get('/getFeed', feed)
router.get('/getPost/:id', getPost);
router.get('/getUserPosts/:username', getUserPosts);
router.put('/updatePost/:id', updatePost);
router.delete('/deletePost/:id', deletePost);

module.exports = router;
