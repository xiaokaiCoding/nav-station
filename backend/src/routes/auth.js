const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.post('/change-password', auth, authCtrl.changePassword);
// 管理员专用
router.get('/users', adminOnly, authCtrl.getUsers);
router.put('/users/:id', adminOnly, authCtrl.updateUser);
router.delete('/users/:id', adminOnly, authCtrl.removeUser);

module.exports = router;
