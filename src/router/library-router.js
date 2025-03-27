const express = require('express');
const { createLibrary, updatedLibrary, fetchAllLibrary, deletedLibrary } = require('../controller/library-controller');
const { subjectFileUpload } = require('../utils/file');
const router = express.Router();
const upload = require('../utils/cloudFile');

router.post('/fileUpload', upload.fields([
    {name: "subject_file", maxCount: 1},
    {name: "avater_image", maxCount: 1},
]), createLibrary)
router.put('/update-library/:id', upload.fields([
    {name: "subject_file", maxCount: 1},
    {name: "avater_image", maxCount: 1},
]), updatedLibrary);
router.get('/fetch-all', fetchAllLibrary);
router.delete('/deleted-library-file/:id', deletedLibrary);

module.exports = router;