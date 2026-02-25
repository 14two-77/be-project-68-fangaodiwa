const mongoose = require("mongoose");

const ServiceShema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop',
        required: true
    },
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
    price: {
        type: Number,
        required: [
            true,
            "Please add a price"
        ],
        min: [
            0,
            'Price cannot be a negative number'
        ]
    },
    duration: {
        type: Number,
        required: [
            true,
            "Please add a duration"
        ],
        min: [
            0,
            'Duration cannot be a negative number'
        ]
    },
    description: {
        type: String,
        required: [
            true,
            "Please add a description"
        ],
    },
    tier: {
        type: String,
        enum: [
            'vip',
            'vvip_poseidon'
        ],
        default: 'vip'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Service", ServiceShema)