const router = require('express').Router()


router.post('/', algoritmoController.create )
router.get('/', algoritmoController.findAll)
router.get('/slug/:slug', algoritmoController.findBySlug)
router.get('/:id', algoritmoController.findById)
router.put('/:id', algoritmoController.update)
router.delete('/:id', algoritmoController.remove)

module.exports = router