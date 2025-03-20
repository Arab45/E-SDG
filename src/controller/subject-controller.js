const { sendError, sendSuccess } = require("../middleware/index");
const { create } = require("../model/Library");
const Subject = require("../model/Subject");


const createSubject = async (req, res) => {
    try {
        const newSubject = await new Subject({
            ...req.body
        })

        const createdSubject = await newSubject.save();
        return sendSuccess(res, "Successfully create subject", createdSubject);
    } catch (error) {
        console.error(error);
        return sendError(res, "Something went wrong", 500);
    }
};

const searchSubject = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};
        
        // Check if search parameter exists in the query (not req.search)
        if (search) {
            filter = {
                $or: [
                    { subjectName: { $regex: search, $options: "i" } }
                ]
            };
        }

        const subjects = await Subject.find(filter);
        return sendSuccess(res, "Successfully filtered data", subjects);
    } catch (error) {
        console.error(error);
        return sendError(res, "Something went wrong", 500);
    }
};

const updateSubject = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findByIdAndUpdate(id, {$set: req.body}, {new: true});
        if(!subject){
            return sendError(res, 'Unable to update subject');
        };
        return sendSuccess(res, 'successfully update subject', subject);
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform this action, something went wrong', 500); 
    }
};

const fetchAllSubject = async (req, res) => {
    let { page, pageSize } = req.query;


    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 5;


    try {
        const allSubjects = await Subject.aggregate([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);

          const data = {
            allSubjects: {
                metadata: { totalCount: allSubjects[0].metadata[0].totalCount, page, pageSize },
                data: allSubjects[0].data,
              },
          };

          return sendSuccess(res, 'succcessfully fetch student data', data, allSubjects);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Unable to perform this action, something went wrong', 500);
    }
};

  const deletedSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const subjectDeleted = await Subject.findByIdAndDelete(id);
        if(!subjectDeleted){
            return sendError(res, 'unable to delete subject');
        };
        return sendSuccess(res, 'successfully delete subject from the database');
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to perform the operation, something went wrong', 500);
    }
}




module.exports = {
    createSubject,
    searchSubject,
    deletedSubject,
    fetchAllSubject,
    updateSubject,
}