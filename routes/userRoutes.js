const router = require('express').Router()

const userController = require('../controllers/userController')

router.post('/', userController.create)
router.get('/', userController.findAll)
router.get('/:id', userController.findById)
router.put('/:id', userController.update)
router.delete('/:id', userController.remove)

module.exports = router