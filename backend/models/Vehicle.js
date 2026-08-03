const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide vehicle name'],
        trim: true,
        maxlength: [50, 'Vehicle name cannot be more than 50 characters']
    },
    type: {
        type: String,
        enum: ['2 Wheeler', '4 Wheeler'],
        required: [true, 'Please provide vehicle type']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true });

// Ensure unique vehicle names per user
VehicleSchema.index({ name: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
