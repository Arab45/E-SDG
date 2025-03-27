const { sendError, sendSuccess } = require("../middleware/index");
const StudentProfile = require("../model/StudentProfile");
const { cloudinary } = require("../../service/cloudinary")


const createStudentProfile = async (req, res) => {
    try {
    const studentImg = req.files["student_img"] ? req.files["student_img"][0].path : null;

    if (!studentImg) return sendError(res, "Student image is required");

        // Define file size limit (5MB in bytes)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        // Check file size limit
        if (studentImg.size > MAX_FILE_SIZE) {
          return sendError(res, "Student image size exceeds the 5MB limit");
        }

        const studentUpload = await cloudinary.uploader.upload(studentImg, {
            resource_type: "auto",
            upload_preset: "SDG-Reach"
          });

    req.body.student_img = studentUpload.secure_url
    req.body.student_imgId = studentUpload.public_id


        const newProfile = new StudentProfile({ ...req.body });
       const profile = await newProfile.save()
        return sendSuccess(res, "Student Profile created successfully", profile)
    } catch (error) {
       console.error(error);
       return sendError(res, "Something went wrong", 500) 
    }
};

const updateStudentProfile = async (req, res) => {
    const { id } = req.params;

        const student = await StudentProfile.findById(id);
        if (!student) {
            sendError(res, "cannot find user with id");
        };

    try {

        if (req.files) {
            if (req.files.student_img) {
                if (student.student_imgId) {
                    await cloudinary.uploader.destroy(student.student_img)
                }

                const directUpload = await cloudinary.uploader.upload(
                    req.files.student_img[0].path,
                    {
                        resource_type: "auto",
                        upload_preset: "SDG-Reach"
                    }
                );
                student.student_img = directUpload.secure_url
                student.student_imgId = directUpload.public_id
            }
        }


        const studentProfile = await StudentProfile.findByIdAndUpdate(id, student, {$set: req.body}, {new: true});
        return sendSuccess(res, 'successfully update student profile', studentProfile);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

const fetchAllStudent = async (req, res) => {
    let { page, pageSize } = req.query;


    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 5;


    try {
        const allStudentProfile = await StudentProfile.aggregate([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);

          const data = {
            allStudentProfile: {
                metadata: { totalCount: allStudentProfile[0].metadata[0].totalCount, page, pageSize },
                data: allStudentProfile[0].data,
              },
          };

          return sendSuccess(res, 'succcessfully fetch student data', data, allStudentProfile);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
}

module.exports = {
    createStudentProfile,
    updateStudentProfile,
    fetchAllStudent
}