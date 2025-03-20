const express = require('express');
const { createSubject, searchSubject, fetchAllSubject, deletedSubject, updateSubject } = require('../controller/subject-controller');
const router = express.Router();

router.post('/create-subject', createSubject);
router.get('/search-subject', searchSubject);
router.get('/fetch-all-subject', fetchAllSubject);
router.delete('/delete-subject/:id', deletedSubject);
router.put('/updated-subject/:id', updateSubject);

module.exports = router;
