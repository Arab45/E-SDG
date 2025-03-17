const { sendError, sendSuccess } = require("../middleware/index");
const TeacherProfile = require("../model/StudentProfile");


const createTeacherProfile = async (req, res) => {
    try {
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
    try {
        const teacherProfile = await TeacherProfile.findByIdAndUpdate(id, {$set: req.body}, {now: true});
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

          return sendSuccess(res, 'succcessfully fetch teacher data', data, allStudentProfile);
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