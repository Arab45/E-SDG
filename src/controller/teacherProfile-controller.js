const { sendError, sendSuccess } = require("../middleware/index");
const TeacherProfile = require("../model/TeacherProfile");
const { cloudinary } = require("../../service/cloudinary")


const createTeacherProfile = async (req, res) => {
    try {

        const teacherImg = req.files["teacher_img"] ? req.files["teacher_img"][0].path : null;

        if (!teacherImg) return sendError(res, "teacher image is required");


        // Define file size limit (5MB in bytes)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        // Check file size limit
        if (teacherImg.size > MAX_FILE_SIZE) {
            return sendError(res, "teacher image size exceeds the 5MB limit");
        }

        const subjectUpload = await cloudinary.uploader.upload(teacherImg, {
            resource_type: "auto",
            upload_preset: "SDG-Reach"
        });

        req.body.teacher_img = subjectUpload.secure_url
        req.body.teacher_imgId = subjectUpload.public_id

        const newProfile = new TeacherProfile({ ...req.body });
       const profile = await newProfile.save()
        return sendSuccess(res, "Student Profile created successfully", profile)
    } catch (error) {
       console.error(error);
       return sendError(res, "Something went wrong", 500) 
    }
};

const updateTeacherProfile = async (req, res) => {
    const { id } = req.params;

            const teacher = await TeacherProfile.findById(id);
            if (!teacher) {
                sendError(res, "cannot find teacher with id");
            };

    try {

        if (req.files) {
            if (req.files.teacher_img) {
                if (teacher.teacher_imgId) {
                    await cloudinary.uploader.destroy(teacher.student_img)
                }

                const directUpload = await cloudinary.uploader.upload(
                    req.files.teacher_img[0].path,
                    {
                        resource_type: "auto",
                        upload_preset: "SDG-Reach"
                    }
                );
                teacher.teacher_img = directUpload.secure_url
                teacher.teacher_imgId = directUpload.public_id
            }
        }

        const teacherProfile = await TeacherProfile.findByIdAndUpdate(id, teacher, {$set: req.body}, {new: true});
        if(!teacherProfile){
            return sendError(res, 'Unable to update teacher profile');
        };
        return sendSuccess(res, 'successfully update teacher profile', teacherProfile);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

const fetchAllTeacher = async (req, res) => {
    let { page, pageSize } = req.query;


    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 5;


    try {
        const allTeacherProfiles = await TeacherProfile.aggregate([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);

          const data = {
            allTeacherProfiles: {
                metadata: { totalCount: allTeacherProfiles[0].metadata[0].totalCount, page, pageSize },
                data: allTeacherProfiles[0].data,
              },
          };

          return sendSuccess(res, 'succcessfully fetch teacher data', data, allTeacherProfiles);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
}

module.exports = {
    createTeacherProfile,
    updateTeacherProfile,
    fetchAllTeacher
}