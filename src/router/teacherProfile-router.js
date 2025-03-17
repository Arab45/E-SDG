const express = require("express");
const { createTeacherProfile, fetchAllTeacher, updateTeacherProfile } = require("../controller/teacherProfile-controller");
const router = express();

router.post('/teacherProfile', createTeacherProfile);
router.get('/fetchTeacherData', fetchAllTeacher);
router.put('/updatedProfile/:id', updateTeacherProfile)

module.exports = router
