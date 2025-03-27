const express = require("express");
const { createStudentProfile, fetchAllStudent, updateStudentProfile } = require("../controller/studentProfile-controller");
const router = express.Router();
const upload = require('../utils/cloudFile');


router.post('/studentProfile',  upload.fields([
    {name: "student_img", maxCount: 1},
]), createStudentProfile);
router.get('/fetchStudentData', fetchAllStudent);
router.put('/updatedProfile/:id',  upload.fields([
    {name: "student_img", maxCount: 1},
]),  updateStudentProfile);

module.exports = router