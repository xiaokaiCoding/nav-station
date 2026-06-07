const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { adminOnly } = require('../middleware/auth');

router.get('/', bookmarkController.getAll);
router.post('/', adminOnly, bookmarkController.create);
router.put('/:id', adminOnly, bookmarkController.update);
router.delete('/:id', adminOnly, bookmarkController.remove);

module.exports = router;
