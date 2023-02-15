const multer = require("multer");
class FileUploader{

    storage = multer.diskStorage({
        filename: function (req, file, cb) {
          cb(null, destination + file.originalname);
        }
    });
      
    /**
     * @description  Allows the function calling this method to pass in the folder name to upload the files in.
     * @param {String} folderName Folder or path name
     * @returns {multer.Multer} multer
     */
    static uploadFile = (folderName)=>{
        return multer({storage:multer.diskStorage({
            destination: function(req, file, cb){
            cb(null, `uploads/${folderName}/`)
            },
            filename: function (req, file, cb) {
              cb(null,file.originalname);
            }
        })});
    }
}

module.exports = FileUploader;