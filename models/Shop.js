const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Please add a name"
        ],
        trim: true,
        maxlength: [
            155,
            "Name can not be more than 155 characters"
        ]
    },
    address: {
        type: String,
        required: [
            true,
            "Please add a address"
        ]
    },
    phone: {
        type: String,
        required: [
            true,
            "Please add a phone"
        ],
        unique: true,
    },
    open_time: {
        type: String,
        required: [
            true,
            "Please add an open_time"
        ],
        match: [
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Please format time as HH:mm'
        ]
    },
    close_time: {
        type: String,
        required: [
            true,
            "Please add a close_time"
        ],
        match: [
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Please format time as HH:mm'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    toObject: {
        virtuals: true,
        getters: true
    },
    id: false,
    autoCreate: true,
});

ShopSchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'shop',
    justOne: false
});

module.exports = mongoose.model("Shop", ShopSchema)