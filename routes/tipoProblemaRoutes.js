const router = require('express').Router()

const tipoProblemaController = require('../controllers/tipoProblemaController')

router.post('/', tipoProblemaController.create )
router.get('/', tipoProblemaController.findAll )
router.get('/:id', tipoProblemaController.findById )
router.put('/:id', tipoProblemaController.update )
router.delete('/:id', tipoProblemaController.remove)

module.exports = router