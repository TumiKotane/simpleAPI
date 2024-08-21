const express = require('express');
const router = express.Router();
const { registerUser,
        loginUser,
        logoutUser,
        followToggle,
        updateUserInfo,
        getUser,
} = require('../controllers/userController');
const authorize = require('../middleware/Authorize')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', authorize, followToggle);
router.put('/updateUserInfo', authorize, updateUserInfo);
router.get('/getUser/:query',authorize, getUser)

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Name of user
 *         username:
 *           type: string
 *           description: Profiles Username
 *         email:
 *           type: string
 *           description: Users email
 *         password:
 *           type: string
 *           description: Security
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Profiles Username
 *         password:
 *           type: string
 *           description: Security
 *     
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       412:
 *         description: Fields missing
 *       500:
 *         description: Some server error
 * 
 * /login:
 *   post:
 *     summary: Login in as a created user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogin'
 *       412:
 *         description: Fields missing
 *       500:
 *         description: Some server error
 * 
 * /logout:
 *   post:
 *     summary: Login in as a created user
 *     tags: [User]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: User log out.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogin'
 *       500:
 *         description: Some server error
 * 
 * /follow/{id}:
 *   post:
 *     summary: Follow or Unfollow a particular user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The other users id
 *     responses:
 *       200:
 *         description: User followed or Unfollowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 * 
 * /updateUserInfo:
 *   put:
 *     summary: Update the info of a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Update current users information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       412:
 *         description: Fields missing
 *       500:
 *         description: Some server error
 * 
 * /getUser/{query}:
 *   get:
 *     summary: Get the information of a particular user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The clients id or other users id
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */