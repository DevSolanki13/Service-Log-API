const Vehicle = require('../models/Vehicle');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.find({ createdBy: req.user.userID }).sort('name');
    res.status(StatusCodes.OK).json({ vehicles, count: vehicles.length });
};

const createVehicle = async (req, res) => {
    req.body.createdBy = req.user.userID;
    
    // Check if a vehicle with the same name already exists for this user
    const existingVehicle = await Vehicle.findOne({
        name: req.body.name,
        createdBy: req.user.userID
    });

    if (existingVehicle) {
        throw new BadRequestError('You have already registered a vehicle with this name');
    }

    const vehicle = await Vehicle.create(req.body);
    res.status(StatusCodes.CREATED).json(vehicle);
};

const deleteVehicle = async (req, res) => {
    const { id: vehicleId } = req.params;
    const { userID } = req.user;

    const vehicle = await Vehicle.findOneAndDelete({
        _id: vehicleId,
        createdBy: userID
    });

    if (!vehicle) {
        throw new NotFoundError(`No vehicle with id ${vehicleId}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Vehicle deleted successfully' });
};

module.exports = {
    getAllVehicles,
    createVehicle,
    deleteVehicle
};
