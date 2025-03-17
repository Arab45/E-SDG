const express = require('express');
const { createLibrary } = require('../controller/library-controller');
const router = express.Router();

router.post('/fileUpload', createLibrary)

module.exports = router;