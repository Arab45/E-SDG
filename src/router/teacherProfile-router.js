const express = require("express");
const { createTeacherProfile, fetchAllTeacher, updateTeacherProfile } = require("../controller/teacherProfile-controller");
const router = express.Router();
const upload = require('../utils/cloudFile');


router.post('/teacherProfile', upload.fields([
    {name: "teacher_img", maxCount: 1},
]), createTeacherProfile);
router.get('/fetchTeacherData', fetchAllTeacher);
router.put('/updatedProfile/:id', upload.fields([
    {name: "teacher_img", maxCount: 1},
]), updateTeacherProfile)

module.exports = router
