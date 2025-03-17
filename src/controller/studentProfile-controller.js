const { sendError, sendSuccess } = require("../middleware/index");
const StudentProfile = require("../model/StudentProfile");


const createStudentProfile = async (req, res) => {
    try {
        const newProfile = new StudentProfile({ ...req.body });
        await newProfile.save()
        return sendSuccess(res, "Student Profile created successfully", newProfile)
    } catch (error) {
       console.error(error);
       return sendError(res, "Something went wrong", 500) 
    }
};

const updateStudentProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const studentProfile = await StudentProfile.findByIdAndUpdate(id, {$set: req.body}, {now: true});
        if(!studentProfile){
            return sendError(res, 'Unable to update student profile');
        };
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