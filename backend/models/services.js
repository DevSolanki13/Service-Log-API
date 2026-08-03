const mongoose = require('mongoose')

const ServiceLogSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: [true, 'Please provide service name'],
            trim: true,
            maxlength: [100, 'Service name cannot be more than 100 characters']
        },

        vehicleName: {
            type: String,
            required: [true, 'Please provide vehicle name'],
            trim: true,
            maxlength: [50, 'Vehicle name cannot be more than 50 characters']
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        items: [
            {
                description: {
                    type: String,
                    required: [true, 'Please provide item/task description'],
                    trim: true
                },
                price: {
                    type: Number,
                    required: [true, 'Please provide price for this item'],
                    min: [0, 'Price cannot be negative'],
                    default: 0
                }
            }
        ],

        totalPrice: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ['Scheduled', 'In Progress', 'Completed'],
            default: 'Completed'
        },

        nextServiceDate: {
            type: Date
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user']
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Pre-save hook to calculate the total price of all items
ServiceLogSchema.pre('save', function () {
    if (this.items && this.items.length > 0) {
        this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
    } else {
        this.totalPrice = 0;
    }
});

module.exports = mongoose.model('ServiceLog', ServiceLogSchema)