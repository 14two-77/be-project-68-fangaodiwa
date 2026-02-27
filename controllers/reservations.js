const Reservation = require('../models/Reservation');

// @desc    Get all reservations (View)
// @route   GET /api/v1/reservations
// @access  Private
exports.getReservations = async (req, res, next) => {
    try {
        let query;

        // สร้างเงื่อนไข: ถ้าไม่ใช่ admin ให้หาเฉพาะของตัวเอง
        const reqQuery = req.user.role !== 'admin' ? { user: req.user.id } : {};

        // ดึง Reservation -> ดึง Service -> ดึง Shop ที่อยู่ใน Service
        query = Reservation.find(reqQuery).populate({
            path: 'service',
            select: 'name price duration tier shop',
            populate: {
                path: 'shop',
                select: 'name address phone open_time close_time'
            }
        });

        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot find reservations" });
    }
};

// @desc    Add reservation (Create - cho mockup)
// @route   POST /api/v1/reservations
// @access  Private
exports.addReservation = async (req, res, next) => {
    try {
        // 1. ระบุตัวผู้จอง โดยเอา ID มาจาก Token ที่ Login
        req.body.user = req.user.id;

        // 2. เช็คเงื่อนไข Requirement: ผู้ใช้จองได้สูงสุด 3 คิว (ยกเว้น admin)
        const existedReservations = await Reservation.find({ user: req.user.id });

        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        // 3. สร้างข้อมูลลง Database
        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot create reservation" });
    }
};

// @desc    Update single reservation (Edit)
// @route   PUT /api/v1/reservations/:id
// @access  Private
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with id ${req.params.id}` });
        }

        // เช็คสิทธิ์: ต้องเป็นเจ้าของ reservation หรือเป็น admin เท่านั้น
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this reservation` });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: reservation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot update reservation" });
    }
};

// @desc    Delete single reservation (Delete)
// @route   DELETE /api/v1/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with id ${req.params.id}` });
        }

        // เช็คสิทธิ์: ต้องเป็นเจ้าของ reservation หรือเป็น admin เท่านั้น
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this reservation` });
        }

        await reservation.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot delete reservation" });
    }
};