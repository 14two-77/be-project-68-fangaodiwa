const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true
    },
    appointment_date: {
        type: String,
        required: [
            true,
            "Please add an appointment_date"
        ],
        match: [
            /^\d{4}-\d{2}-\d{2}$/,
            'Please format date as YYYY-MM-DD'
        ]
    },
    appointment_time: {
        type: String,
        required: [
            true,
            "Please add an appointment_time"
        ],
        match: [
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Please format time as HH:mm'
        ]
    },
    status: {
        type: String,
        enum: [
            'reserve',
            'in_progress',
            'completed'
        ],
        default: 'reserve'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    autoCreate: true,
});

module.exports = mongoose.model('Reservation', ReservationSchema);