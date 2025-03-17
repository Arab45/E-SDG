const { sendError } = require("../middleware");
const Library = require("../model/Library");


const createLibrary = async (req, res) => {

    if (!req.files) {
        return sendError(res, "library file is missing");
      };
      const rawFileArray = req?.files["diagram_image"];
      const namedFile = rawFileArray.map((a) => a.filename);
      const stringnifiedFile = JSON.stringify(namedFile);
      const formatedFile = stringnifiedFile.replace(/[^a-zA-Z0-9_.,]/g, "");
    console.log('my formated image', formatedFile);
    
        
    req.body.file = formatedFile;
   
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


module.exports = {
    createLibrary
}