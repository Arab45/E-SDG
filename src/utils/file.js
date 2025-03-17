const multer = require("multer");
const path = require("path");

const subjectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/subjects/pdf');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const fileUpload = multer({ storage: subjectStorage });
const subjectFileUpload = fileUpload.fields([
  { name: "subject_file", maxCount: 1 },
  //   { name: "images", maxCount: 5 },
]);