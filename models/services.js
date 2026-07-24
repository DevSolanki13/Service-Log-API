const mongoose = require('mongoose')

const ServiceLogSchema = new mongoose.Schema(
    {
        // 1. Vehicle Identification
        vehicleName: {
            type: String,
            required: [true, 'Please provide vehicle name'],
            trim: true,
            maxlength: [50, 'Vehicle name cannot be more than 50 characters']
        },

        // 2. Service Category / Type
        serviceType: {
            type: String,
            required: [true, 'Please specify service type'],
            enum: {
                values: [
                    'Oil Change',
                    'Tire Replacement/Rotation',
                    'Brake Service',
                    'General Maintenance',
                    'Engine Repair',
                    'Battery Replacement',
                    'Inspection',
                    'Other'
                ],
                message: '{VALUE} is not a supported service type'
            }
        },

        // 3. Status Tracking (Similar to 'pending'/'interview'/'declined' in Jobs API)
        status: {
            type: String,
            enum: ['Scheduled', 'In Progress', 'Completed'],
            default: 'Completed'
        },
        // 4. User Ownership (Essential for Auth)
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user']
        },

    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('ServiceLog', ServiceLogSchema)