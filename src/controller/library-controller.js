const { sendError, sendSuccess } = require("../middleware");
const Library = require("../model/Library");
const { cloudinary } = require("../../service/cloudinary")


const createLibrary = async (req, res) => {
  try {
    const subjectFile = req.files["subject_file"] ? req.files["subject_file"][0].path : null;
    const avatarImage = req.files["avater_image"] ? req.files["avater_image"][0].path : null;

    if (!subjectFile) return sendError(res, "Subject file is required");

    // Define file size limit (5MB in bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Check file size limit
    if (subjectFile.size > MAX_FILE_SIZE) {
      return sendError(res, "Subject file size exceeds the 5MB limit");
    }

    if (avatarImage && avatarImage.size > MAX_FILE_SIZE) {
      return sendError(res, "Avatar image size exceeds the 5MB limit");
    }

    const subjectUpload = await cloudinary.uploader.upload(subjectFile, {
      resource_type: "auto",
      upload_preset: "SDG-Reach"
    });

    const avatarUpload = avatarImage ? await cloudinary.uploader.upload(avatarImage, {
      resource_type: "auto",
      upload_preset: "SDG-Reach"
    }) : null;


    req.body.subject_file = subjectUpload.secure_url
    req.body.avater_image = avatarUpload ? avatarUpload.secure_url : null
    req.body.subject_fileId = subjectUpload.public_id
    req.body.avater_imageId = avatarUpload ? avatarUpload.public_id : null

    const newLibrary = new Library({
      ...req.body
    })

    if (newLibrary) {
      const libraryDoc = await newLibrary.save();
      return sendSuccess(res, "successfully uploaded resources file", libraryDoc)
    }

  } catch (error) {
    console.log(error);
    return sendError(res, 'Unable to perform the operation, something went wrong', 500);
  }
}


const updatedLibrary = async (req, res) => {
  const { id } = req.params;

  const user = await Library.findById(id);
  if (!user) {
    sendError(res, "cannot find user with id");
  };

  try {
    console.log(req.files);
    if (req.files) {
      if (req.files.avater_image) {
        if (user.avater_imageId) {
          await cloudinary.uploader.destroy(user.avater_imageId)
        }

        const directUpload = await cloudinary.uploader.upload(
          req.files.avater_image[0].path,
          {
            resource_type: "auto",
            upload_preset: "SDG-Reach"
          }
        );
        user.avater_image = directUpload.secure_url
        user.avater_imageId = directUpload.public_id
        console.log('direct upload', directUpload);

      }


      if (req.files.subject_file) {
        if (user.subject_fileId) {
          await cloudinary.uploader.destroy(user.subject_fileId)
        }

        const directUpload = await cloudinary.uploader.upload(
          req.files.subject_file[0].path,
          {
            resource_type: "auto",
            upload_preset: "SDG-Reach"
          }
        );
        user.subject_file = directUpload.secure_url;
        user.subject_fileId = directUpload.public_id

        console.log('direct upload', directUpload);
      }
    }
    const updatedItem = await Library.findByIdAndUpdate(
      id,
      user,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(res, "updated successfully", updatedItem);
  } catch (error) {
    console.log(error);
    return sendError(res, "Something went wrong", 500);
  }
}





const fetchAllLibrary = async (req, res) => {
  let { page, pageSize } = req.query;


  page = parseInt(page, 10) || 1;
  pageSize = parseInt(pageSize, 10) || 5;


  try {
    const allLibrary = await Library.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    const data = {
      allLibrary: {
        metadata: { totalCount: allLibrary[0]?.metadata[0]?.totalCount, page, pageSize },
        data: allLibrary[0]?.data,
      },
    };

    return sendSuccess(res, 'succcessfully fetch data', data, allLibrary);
  } catch (error) {
    console.log(error);
    return sendError(res, 'Unable to perform this action, something went wrong', 500);
  }
};


const deletedLibrary = async (req, res) => {
  const { id } = req.params;

  try {
    const libraryDeleted = await Library.findByIdAndDelete(id);
    if (!libraryDeleted) {
      return sendError(res, 'unable to delete library');
    };
    return sendSuccess(res, 'successfully delete library from the database');
  } catch (error) {
    console.log(error);
    return sendError(res, 'Unable to perform the operation, something went wrong', 500);
  }
}


module.exports = {
  createLibrary,
  updatedLibrary,
  deletedLibrary,
  fetchAllLibrary
}