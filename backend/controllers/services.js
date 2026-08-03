const Services = require('../models/services')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllServices = async (req, res) => {
    const services = await Services.find({ createdBy: req.user.userID }).sort('createdAt');
    const totalMoneySpent = services.reduce((sum, service) => sum + (service.totalPrice || 0), 0);
    res.status(StatusCodes.OK).json({ services, count: services.length, totalMoneySpent });
}

const getService = async (req, res) => {
    const { id: serviceId } = req.params;
    const { userID } = req.user;

    const service = await Services.findOne({
        _id: serviceId,
        createdBy: userID
    });

    if (!service) {
        throw new NotFoundError(`No service with id ${serviceId}`);
    }
    res.status(StatusCodes.OK).json(service);
}

const createService = async (req, res) => {
    req.body.createdBy = req.user.userID;
    const service = await Services.create(req.body);
    res.status(StatusCodes.CREATED).json(service);
}

const updateService = async (req, res) => {
    const { id: serviceId } = req.params;
    const { userID } = req.user;

    // Recalculate totalPrice if items are updated in the request body
    if (req.body.items) {
        req.body.totalPrice = req.body.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    const service = await Services.findOneAndUpdate(
        { _id: serviceId, createdBy: userID },
        req.body,
        { new: true, runValidators: true }
    );

    if (!service) {
        throw new NotFoundError(`No service with id ${serviceId}`);
    }
    res.status(StatusCodes.OK).json(service);
}

const deleteService = async (req, res) => {
    const { id: serviceId } = req.params;
    const { userID } = req.user;

    const service = await Services.findOneAndDelete({
        _id: serviceId,
        createdBy: userID
    });

    if (!service) {
        throw new NotFoundError(`No service with id ${serviceId}`);
    }
    res.status(StatusCodes.OK).json({ msg: 'Service deleted successfully' });
}

module.exports = {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService
}