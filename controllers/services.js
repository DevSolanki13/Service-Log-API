const Services = require('../models/services')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllServices = async (req, res) => {
    res.send("get all services")
}

const getService = async (req, res) => {
    res.send("get service")
}

const createService = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const service = await Services.create(req.body);
    res.status(StatusCodes.CREATED).json(service);
}

const updateService = async (req, res) => {
    res.send("update service")
}

const deleteService = async (req, res) => {
    res.send("delete service")
}

module.exports = {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService
}