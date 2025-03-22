const { sendError, sendSuccess } = require("../middleware");
const Library = require("../model/Library");
// const fs = require('fs').promises; 
// const path = require('path');



const createLibrary = async (req, res) => {

    if (!req.files || !req.files["subject_file"]) {
        return sendError(res, "library file is missing");
      };
      const rawFileArray = req?.files["subject_file"];
      const namedFile = rawFileArray.map((a) => a.filename);
      const stringnifiedFile = JSON.stringify(namedFile);
      const formatedFile = stringnifiedFile.replace(/[^a-zA-Z0-9_.,]/g, "");
    // console.log('my formated image', formatedFile);
    
        
    req.body.subject_file = formatedFile;
   
    const newLibrary = new Library({
        ...req.body
    });


    try {
       const createLibrary = await newLibrary.save();
       return sendSuccess(res, 'successfully create new answer', createLibrary)
    } catch (error) {
       console.log(error);
       return sendError(res, 'Unable to perform the operation, something went wrong', 500); 
    }
};



// const updatedLibrary = async (req, res) => {
//     const { id } = req.params;
  
//     if (req.files) {
//       const rawFileArray = req?.files["subject_file"];
//       console.log(rawFileArray);
//       if (rawFileArray) {
//         const namedFile = rawFileArray.map((a) => a.filename);
//         const stringnifiedFile = JSON.stringify(namedFile);
//         const formatedFile = stringnifiedFile.replace(/[^a-zA-Z0-9_.,]/g, "");
//         req.body.subject_file = formatedFile;


//         const currentFileUpload = await Library.findById(req.params.id);
//         if (currentFileUpload) {
//           const fileToDelete = currentFileUpload.subject_file;
//           const filePath = path.join('public/files/subjects/pdf', fileToDelete);
//           await fs.unlink(filePath);
//           console.log("file deleted successfully", filePath);
//           }

//       }
//     }
  
//     try {
//       const updatedItem = await Library.findByIdAndUpdate(
//         id,
//         { $set: req.body },
//         { new: true }
//       );
//       if (!updatedItem) {
//         return sendError(res, "Data does not exist");
//       }
//       return sendSuccess(res, "Successfully updated the data", updatedItem);
//     } catch (error) {
//       console.log(error);
//       return sendError(res, 'something went wrong', 500);
//     }
//   };


const updatedLibrary = async (req, res) => {
  const { id } = req.params;

  if (req.files && req.files["subject_file"]) {
    const rawFileArray = req.files["subject_file"];
    const namedFile = rawFileArray[0].filename; // Get the first file's filename
    req.body.subject_file = namedFile; // Update the request body with the new filename

    // Fetch the current file from the database
    const currentFileUpload = await Library.findById(id);
    if (currentFileUpload && currentFileUpload.subject_file) {
      try {
        // Construct the file path for the old file
        const fileToDelete = currentFileUpload.subject_file;
        const filePath = path.join("public/files/subjects/pdf", fileToDelete);

        // Delete the old file
        await fs.unlink(filePath);
        console.log("File deleted successfully:", filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  }

  try {
    // Update the database with the new file name
    const updatedItem = await Library.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedItem) {
      return sendError(res, "Data does not exist");
    }
    return sendSuccess(res, "Successfully updated the data", updatedItem);
  } catch (error) {
    console.log(error);
    return sendError(res, "Something went wrong", 500);
  }
};




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
                metadata: { totalCount: allLibrary[0].metadata[0].totalCount, page, pageSize },
                data: allLibrary[0].data,
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
        if(!libraryDeleted){
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