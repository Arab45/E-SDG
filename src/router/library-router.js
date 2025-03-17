const express = require('express');
const { createLibrary, updatedLibrary, fetchAllLibrary, deletedLibrary } = require('../controller/library-controller');
const { subjectFileUpload } = require('../utils/file');
const router = express.Router();

router.post('/fileUpload', subjectFileUpload,createLibrary)
router.put('/update-library/:id', subjectFileUpload, updatedLibrary);
router.get('/fetch-all', fetchAllLibrary);
router.delete('/deleted-library-file/:id', deletedLibrary);

module.exports = router;