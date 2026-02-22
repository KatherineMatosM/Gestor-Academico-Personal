const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materiasController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateMateria } = require('../middlewares/validator');

router.use(authMiddleware);

router.get('/', materiasController.getAll);
router.get('/:id', materiasController.getById);
router.post('/', validateMateria, materiasController.create);
router.put('/:id', validateMateria, materiasController.update);
router.delete('/:id', materiasController.delete);

module.exports = router;