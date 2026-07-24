const express = require('express')
const router = express.Router()

const {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/services')

router.route('/').post(createService).get(getAllServices)
router.route('/:id').get(getService).patch(updateService).delete(deleteService)

module.exports = router