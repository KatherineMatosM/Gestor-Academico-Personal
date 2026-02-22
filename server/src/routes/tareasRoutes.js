const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateTarea } = require('../middlewares/validator');

router.use(authMiddleware);

router.get('/', tareasController.getAll);
router.get('/:id', tareasController.getById);
router.post('/', validateTarea, tareasController.create);
router.put('/:id', validateTarea, tareasController.update);
router.delete('/:id', tareasController.delete);

module.exports = router;