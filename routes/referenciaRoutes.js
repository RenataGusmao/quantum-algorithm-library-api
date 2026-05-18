const router = require('express').Router()

const referenciaController = require('../controllers/referenciaController')

router.post('/', referenciaController.create )
router.get('/', referenciaController.findAll )
router.get('/:id', referenciaController.findById )
router.put('/:id', referenciaController.update )
router.delete('/:id', referenciaController.remove )

module.exports = router