// ---------------
// Based Imports
// ---------------
const { default: mongoose, Model, Document } = require('mongoose');
const { getKeyFromValue, roleMap, statusMap } = require('../../../constants/constantMaps');
const User = require('../../../schemas/user.schema');
const { JSONResponse } = require('../../../utilities/response.utility');
const JWTHelper = require('../../../utilities/token.utility');
// ---------------





exports.getAllUsers = async (req, res) => {
    try {
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let role = req.query.role;
        let status = req.query.status;
        status = (status) ? status.toUpperCase() : undefined;
        status = (statusMap.has(status)) ? statusMap.get(status) : undefined;
        role = (role) ? role.toUpperCase() : undefined
        role = (roleMap.has(role)) ? roleMap.get(role): undefined;
      // declare the format of the query params
      const searchQuery = {
        first_name: req.query.firstName,
        last_name: req.query.lastName,
        email: req.query.email,
        role: role,
        status: status,
      };
      
      var searchResult = [];
      // remove the params that are undefined or have empty field request
      Object.keys(searchQuery).forEach((search) => {
        if (searchQuery[search] == undefined || (searchQuery[search] == "" && searchQuery[search]!=0)) {
            if(search !== "role" || search !== "status") 
          delete searchQuery[search];
        }
        // boolean cannot do regex operations, hence the need to format is differently
        if (searchQuery[search] == "true" || searchQuery[search] == "false") {
          searchResult.push({ [search]: searchQuery[search] });
          delete searchQuery[search];
        }
      });
  
      // pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
  
      // format the query for partial search in the database
      Object.keys(searchQuery).forEach((search) => {
        if(search == "role") {
            searchResult.push({"role": {$eq: searchQuery[search]}});
        }else if(search == "status"){
            searchResult.push({"status": {$eq: searchQuery[search]}});
        }else
        searchResult.push({
          [search]: { $regex: searchQuery[search], $options: "i" },
        });
      });
  
      // sorting by order
      const sortField = req.query.sortField || "_id";
      const sortOrder = req.query.sortOrder || "des";
      const sortObj = {};
      sortObj[sortField] = sortOrder === "asc" ? 1 : -1;
  
      let users = await User.aggregate(
          searchResult.length ?
             searchResult.map((result) => {
                  return {$match: result};
              })
          :
          []
      )
      .append([
        {$sort : sortObj},
        {$skip : startIndex},
        {$limit : limit},
    ]).match({status : {$ne: statusMap.get("INACTIVE")}}).project({password: 0}); // removes documents that are inactive
      users = this.makeUserReadable(users);
      JSONResponse.success(
        res,
        "Success",
        {
          users: removeForAdmin(users),
          page: page,
          limit: limit,
        },
        200
      );
    } catch (error) {
      JSONResponse.error(res, "Failure handling user model.", error, 500);
    }
  };


/**
 * @description Gets all the users stored in the database.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.getAllUser = async (req, res, next) => {
    try {
        let {page, limit, role} = req.query;
        role = (role) ? role.toUpperCase() : 0;
        role = (roleMap.get(role) != undefined) ? roleMap.get(role) : 0;
        page = (page) ? page : 1; // defaults  page to 1
        limit = (limit) ? limit : 10; // defaults limit to 10;
        limit = parseInt(limit); // ensures that limit is a number;
        let users = await User.find({role: role})
                                .select("-password") // remove password from each record. 
                                .sort({first_name: 1}) // sorts by first_name in ascending order
                                .skip((page-1) * limit) // skips the results by a specified ammount 
                                .limit(limit); // sets the limit on the number of results to return

        users = removeForAdmin(users);
        JSONResponse.success(res, 'Success.', users, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to get all users.", error, 404);
    }
}


/**
 * @description Uses the email to search for a user that matches the email then confirms that password match. If they do it responds with the user as well as the token of authorization.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.loginUser = async(req, res, next)=>{
    try{
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let {email, password} = req.body;
        if(Object.keys(req.body).length == 0) throw new Error("No data passed to login");
        let user = await User.findOne({email: email}).ne("status", statusMap.get("INACTIVE")); // only finds users who's status is not INACTIVE.
        if(!user) throw new Error("No user matches this email");
        let passCheck = await user.isCorrectPassword(password);
        if(!passCheck)throw new Error("Invalid password");
        user = this.makeUserReadable(user);
        let token = JWTHelper.genToken({id: user._id, role: user.role, email: user.email}, "900");
        user = ModifyUserAgainstPlatform(platform, user);
        JSONResponse.success(res, "Successfully found user", {user, token}, 200);
    }catch(error){
        JSONResponse.error(res, "Unable to login", error, 404);
    }
}





/**
 * @description Gets the user that matches the user_id that is passed to the route as a route param.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.getUserById = async (req, res, next) => {
    try {
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let user_id = req.params.user_id;
        if(!mongoose.isValidObjectId(user_id)) throw new Error("Invalid format of user_id");
        let user = await User.findById(user_id).ne("status", statusMap.get("INACTIVE"));
        if(!user) throw new Error("No user found with this ID");
        user = this.makeUserReadable(user);
        user = ModifyUserAgainstPlatform(platform, user);

        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to get user by id.", error, 404);
    }
}


/**
 * @description Create a user with the data that is passed to the server in the body.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.createUser = async (req, res, next) => {
    try {
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let userData = req.body;
        userData.profile_image = (req.file) ? req.file.path: undefined;
        // if(!(Object.keys(userData).length == 0)) throw new Error("No data passed to the user")
        // update role if it is provided by the admin
        userData = checkRoleAndStatusAgainstPlatform(userData, platform);
        let user = new User(userData); // creates model from userdata
        let duplicated = await user.checkDuplicate();
        if(duplicated) throw new Error("A user with that email already exists");

        user = await user.save(); // saves model 
        user = this.makeUserReadable(user);
        user = ModifyUserAgainstPlatform(platform, user);

        JSONResponse.success(res, 'Success.', user, 201);   
    } catch (error) {
        JSONResponse.error(res, "Failed to create user.", error, 404);
    }
}


/**
 * @description Updates the user that matches the user_id that is passed to the route as a route param.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.updateUser = async (req, res) => {
    try {
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let user_id = req.params.user_id;
        let userData = req.body;
        if(Object.keys(userData).length == 0) throw new Error("No data passed to update user")
        userData.profile_image = (req.file) ? req.file.path: undefined;
        userData.password = undefined;
        userData = checkRoleAndStatusAgainstPlatform(userData, platform);
        if(!mongoose.isValidObjectId(user_id)) throw new Error("Invalid format of user_id");
        let user = await User.findByIdAndUpdate(user_id,userData, {new:true}).ne("status", statusMap.get("INACTIVE"));
        if(!user) throw new Error("No user found with this ID")
        user = this.makeUserReadable(user);
        user = ModifyUserAgainstPlatform(platform, user);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to update user.", error, 404);
    }
}


/**
 * @description Does a soft delete of a user that matches the user_id that is passed to the route as a route param.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.deleteUser = async (req, res) => {
    try {
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let user_id = req.params.user_id;
        if(!mongoose.isValidObjectId(user_id)) throw new Error("User ID passed is not valid")
        let user = await User.findById(user_id).ne("status", statusMap.get("INACTIVE"));
        if(!user) throw new Error("No user found with this ID");
        if(user.status === statusMap.get("INACTIVE")) throw new Error ("User is already Deleted")
        user.status = statusMap.get("INACTIVE"); // finds the value that we set for inactive user then updates status.
        // sets the deleted at the a date string that matches the one generated by the database timestamp.
        user.deletedAt = new Date().toISOString(); // eg. '2023-02-17T12:11:15.175Z'
        await user.save();
        user = this.makeUserReadable(user);
        user = ModifyUserAgainstPlatform(platform, user);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to delete user.", error, 404);
    }
}

/**
 * @description Route that sends a password reset email to the user whose email is in the body.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.requestPasswordReset = async (req, res, next) => {
    try{
        let {platform} = req.query;
        platform = checkForPlatform(platform);
        let {email, redirectLink} = req.body;
        let user = await User.findOne({email: email}).ne("status", statusMap.get("INACTIVE"));
        if(!user) throw new Error("No user exists with that email");
        await user.requestPasswordReset(redirectLink);
        JSONResponse.success(res, "Successfully sent password reset request", {},200);
    }catch(error){
        JSONResponse.error(res, "Unable to reset password", error,404)
    }
}
/**
 * @description Route that updates the password for password reset
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.resetPassword = async(req, res, next)=>{
 try{
    let {platform} = req.query;
    platform = checkForPlatform(platform);
    let {password} = req.body;
    if(!password) throw new Error("No password to update");
    let {user_id} = req.query;
    // Ensures that only the password will be updated on this route.
     let user = await User.findOne({_id: user_id}).ne("status", statusMap.get("INACTIVE"));
     if (!user) throw new Error("User not found with this id");
     user.password = password;
     await user.save();
     user = this.makeUserReadable(user);
     user = ModifyUserAgainstPlatform(platform, user);
     JSONResponse.success(res, "Retrieved user info", user, 200);
  } catch (error) {
     JSONResponse.error(res, "Unable to find user", error, 404);
  }

}

/**
 * 
 * @param {mongoose.Model<User> | Array<Model<User>>} user 
 * @returns 
 */
exports.makeUserReadable = (user) =>{
    let readableUser;
    if(Array.isArray(user)){
        readableUser = user.map((doc)=>{
        let {roleKey, statusKey} = checkAndMakeReadableRoleAndStatus(doc)
        return {
            ...doc,  // used this destructuring method, tried set however it would not update the value, could be due to conflicting types number vs string.
            role: roleKey, 
            status: statusKey,
        }
    })
        
    }else{
        let {roleKey, statusKey} = checkAndMakeReadableRoleAndStatus(user);
        readableUser = {
            ...user._doc,  // used this destructuring method, tried set however it would not update the value, could be due to conflicting types number vs string.
            role: roleKey, 
            status: statusKey,
        }
    }
    return readableUser;

}

function checkAndMakeReadableRoleAndStatus(user){
    let roleKey = getKeyFromValue(roleMap, user.role);
    let statusKey = getKeyFromValue(statusMap, user.status)
    if(!roleKey) throw new Error("Invalid role type on user");
    if(!statusKey) throw new Error("Invalid status type on user");
    return {statusKey, roleKey}
}
/**
 * 
 * @param {Document<User>} user 
 * @returns {Partial<User>}
 */
function removeForWeb(user){

    modifiedUser = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile: user.profile_image,
        mobile_number: user.mobile_number,
        home_number: user.home_number

    }
    return modifiedUser;
}
/**
 * 
 * @param {Document<User>} user 
 * @returns {Partial<User>}
 */
function removeForAdmin(user){
    if(Array.isArray(user)){
        let modifiedUsers = user.map((user)=> {
            return {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    profile_image: user.profile_image,
                    mobile_number: user.mobile_number,
                    home_number: user.home_number,
                    status: user.status,
                }
            
            }).filter((user)=> user != null)
        return modifiedUsers;
    }else return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_image: user.profile_image,
        mobile_number: user.mobile_number,
        home_number: user.home_number,
        status: user.status,
    }

}

function filterInactive(documents){
    if(Array.isArray(documents)){
        return documents.filter((document)=> document.status !== "INACTIVE")
    }
    return null
}

/**
 * Checks for the platform if it is valid
 * @param {string} platform The platform the request is sent from.
 */
function checkForPlatform(platform){
    if(!platform) throw new Error("No platform provided");
    platform = platform.toLowerCase();
    if(platform != "web" && platform != "admin") throw new Error("Incorrect platform");
    return platform;
}


/**
 * Modify the user based on what the platform value is
 * @param {Model<User>} user 
 * @param {string} platform 
 */
function ModifyUserAgainstPlatform(platform, user){
    if(platform === "web"){
        user = removeForWeb(user);
    }else if(platform === "admin"){
        user = removeForAdmin(user);
    }
    return user;
}

/**
 * Checks if user is valid for status and role update
 * @param {Object} userData 
 * @param {string} platform 
 * @returns {Object} 
 */
function checkRoleAndStatusAgainstPlatform(userData, platform){
    if(platform == "admin"){
        validRole = userData.role ? roleMap.get(userData.role.toUpperCase()): false;
        validStatus = userData.status ? statusMap.get(userData.status.toUpperCase()) : false; 
        userData.role = (validRole) ? validRole : undefined;
        userData.status = (validStatus) ? validStatus : undefined; 
    }else{
        userData.role = undefined;
        userData.status = undefined;
    }
    return userData;
}