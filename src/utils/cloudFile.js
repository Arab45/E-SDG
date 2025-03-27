const multer = require('multer');
const path = require('path');

//Multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".pdf" && ext != ".mp4") {
            cb(new Error("Unsopported file type!"), false);
            return
        }
        cb(null, true)
    }
})