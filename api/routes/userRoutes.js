const express = require('express');
const router = express.Router();
const { registerUser,
        loginUser,
        logoutUser,
        updateUserInfo,
        getUser,
} = require('../controllers/userController');
const authorize = require('../middleware/Authorize')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/updateUserInfo', authorize, updateUserInfo);
router.get('/getUser/:query',authorize, getUser)

module.exports = router;