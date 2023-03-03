const Parish = require("../../../schemas/parish_schema");
const { JSONResponse } = require("../../../utilities/response_utility");



// get all Parish
exports.getAllParish = async (req, res, next) => {
    try {
      const parishes = await Parish.find();
      if(req.query.parishName){
        next();
      }else JSONResponse.success(res, "Successfully retrieved all parishes", parishes, 200);
    } catch (error) {
      JSONResponse.error(res, "Failed to retrieve parishes", error, 404);
    }
  };
  
  // get Parish by id
  exports.getParishById = async (req, res, next) => {
    try {
      const parish = await Parish.findById(req.params.id);
      JSONResponse.success(res, "Successfully retrieved Parish", parish, 200);
    } catch (error) {
      JSONResponse.error(res, "Unable to find parish with this id", error, 404);
    }
  };
  

  exports.getParishByName= async (req, res, next) => {
    try {
      const parish = await Parish.findOne({parishName: req.query.parishName});
      if(!parish) throw new Error("No parish found with this Name")
      JSONResponse.success(res, "Successfully retrieved Parish", parish, 200);
    } catch (error) {
      JSONResponse.error(res, "Unable to find parish with this id", error, 404);
    }
  };
  // create Parish
  exports.createParish = async (req, res, next) => {
    try {
      const parish = await Parish.create(req.body);
  
      if (!parish) throw new Error("Parish not created");
      JSONResponse.success(res, "Successfully created Parish", parish, 201);
    } catch (error) {
      JSONResponse.error(res, "Unable to create parish", error, 404);
    }
  };
  
  // update Parish
  exports.updateParish = async (req, res) => {
    try {
      const parish = await Parish.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!parish) throw new Error("Parish not updated");
      JSONResponse.success(res, "Successfully updated parish", {}, 200);
    } catch (error) {
      JSONResponse.error(res, "Unable to update parish", error, 404);
    }
  };
  
  // delete Parish
  exports.deleteParish = async (req, res) => {
    try {
      const parish = await Parish.findByIdAndDelete(req.params.id);
      if (!parish) throw new Error("Parish not deleted");
      JSONResponse.success(res, "Successfully deleted parish", {}, 200);
    } catch (error) {
      JSONResponse.error(res, "Unable to deleted", {}, 404);
    }
  };

  