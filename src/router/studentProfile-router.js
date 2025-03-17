const express = require("express");
const { createStudentProfile, fetchAllStudent, updateStudentProfile } = require("../controller/studentProfile-controller");
const router = express.Router();

router.post('/studentProfile', createStudentProfile);
router.get('/fetchStudentData', fetchAllStudent);
router.put('/updatedProfile/:id', updateStudentProfile)

module.exports = router