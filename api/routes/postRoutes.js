const express = require('express');
const { 
    createPost, 
    feed, 
    getPost, 
    getUserPosts, 
    updatePost, 
    deletePost, 
    likingToggle, 
    comment, 
    getPostComments,
    updateComment, 
    deleteComment 
} = require('../controllers/postController');
// const authorize = require('../middleware/Authorize');

const router = express.Router();

router.post('/create', createPost);
router.get('/getFeed', feed)
router.get('/getPost/:id', getPost);
router.get('/getUserPosts/:username', getUserPosts);
router.put('/updatePost/:id', updatePost);
router.delete('/deletePost/:id', deletePost);
router.put('/like/:id', likingToggle);
router.put('/comment/:id', comment);
router.get('/getPostComments/:id', getPostComments);
router.put('/updateComment/:postId/:commentId', updateComment);
router.delete('/deleteComment/:postId/:commentId', deleteComment);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: Post text
 *         likes:
 *           type: string
 *           description: Array of id's
 *         replies:
 *           type: string
 *           description: Array of reply objects
 * 
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: Post text
 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Managing Posts in the API
 * /create:
 *   post:
 *     summary: Client creates a new Post
 *     tags: [Post]
 *     requestBody:
 *       requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Posts in the API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * 
 * /getFeed:
 *   get:
 *     summary: Get feed of all Posts in the API
 *     tags: [Post]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Feed of all the posts posted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * 
 * /getPost/{id}:
 *   get:
 *     summary: Get particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular post
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: One post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /getUserPosts/{username}:
 *   get:
 *     summary: Get feed of all Posts of a particular user
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular user
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: One users posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /deletePost/{id}:
 *   delete:
 *     summary: Delete a particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular post
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Clients post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /like/{id}:
 *   put:
 *     summary: Like a particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular post
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Clients post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /comment/{id}:
 *   put:
 *     summary: Comment on a particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Clients or other users post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /getPostComments/{id}:
 *   get:
 *     summary: Get comments of a particular Posts in the API
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of one particular post
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Comments of one post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * 
 * /updateComment/{postId}/{commentId}:
 *   put:
 *     summary: Comment on a particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post in question
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment in question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Clients or other users post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error
 * 
 * /deleteComment/{postId}/{commentId}:
 *   delete:
 *     summary: Comment on a particular post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the post in question
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the comment in question
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Clients or other users post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Some server error

 */