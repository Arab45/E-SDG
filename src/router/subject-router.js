const express = require('express');
const { createSubject, searchSubject, fetchAllSubject, deletedSubject, updateSubject } = require('../controller/subject-controller');
const router = express.Router();
const upload = require('../utils/cloudFile');


router.post('/create-subject', upload.fields([
    {name: "subject_img", maxCount: 1},
]), createSubject);
router.get('/search-subject', searchSubject);
router.get('/fetch-all-subject', fetchAllSubject);
router.delete('/delete-subject/:id', deletedSubject);
router.put('/updated-subject/:id', upload.fields([
    {name: "subject_img", maxCount: 1},
]), updateSubject);

module.exports = router;
