const express = require('express');
const {
    getReservations,
    addReservation, // ✅ เพิ่มเข้ามาแล้ว
    updateReservation,
    deleteReservation
} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });

// นำเข้า middleware สำหรับตรวจสอบ Token
const { protect } = require('../middleware/auth');

// ทุก Route ในนี้ต้องผ่านการ Login (protect) ก่อน
router.use(protect);

router.route('/')
    .get(getReservations)
    .post(addReservation); // ✅ เปิดช่องทางให้ POST สร้างการจองได้แล้ว

router.route('/:id')
    .put(updateReservation)
    .delete(deleteReservation);

module.exports = router;