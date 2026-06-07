const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { adminOnly } = require('../middleware/auth');

router.get('/', categoryController.getAll);
router.post('/', adminOnly, categoryController.create);
router.put('/:id', adminOnly, categoryController.update);
router.delete('/:id', adminOnly, categoryController.remove);

module.exports = router;
