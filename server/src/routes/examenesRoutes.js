const express = require('express');
const router = express.Router();
const examenesController = require('../controllers/examenesController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateExamen } = require('../middlewares/validator');

router.use(authMiddleware);

router.get('/', examenesController.getAll);
router.get('/:id', examenesController.getById);
router.post('/', validateExamen, examenesController.create);
router.put('/:id', validateExamen, examenesController.update);
router.delete('/:id', examenesController.delete);

module.exports = router;