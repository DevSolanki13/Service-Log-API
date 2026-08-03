const express = require('express')
const router = express.Router()

const {
    getAllVehicles,
    createVehicle,
    deleteVehicle
} = require('../controllers/vehicles')

router.route('/').post(createVehicle).get(getAllVehicles)
router.route('/:id').delete(deleteVehicle)

module.exports = router
