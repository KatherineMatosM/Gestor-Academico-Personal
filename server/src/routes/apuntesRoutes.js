const express = require('express');
const router = express.Router();
const apuntesController = require('../controllers/apuntesController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateApunte } = require('../middlewares/validator');

router.use(authMiddleware);

router.get('/', apuntesController.getAll);
router.get('/:id', apuntesController.getById);
router.post('/', validateApunte, apuntesController.create);
router.put('/:id', validateApunte, apuntesController.update);
router.delete('/:id', apuntesController.delete);

module.exports = router;