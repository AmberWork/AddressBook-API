// ---------------
// Based Imports
// ---------------
const { default: mongoose } = require('mongoose');
const User = require('../../../schemas/user.schema');
const { JSONResponse } = require('../../../utilities/response.utility');
const JWTHelper = require('../../../utilities/token.utility');
// ---------------


/**
 * @description Gets all the users stored in the database.
 * @param {Request} req The request that has been sent to the server
 * @param {Response} res The response that the server should respond
 * @param {Next} next The next middleware in the sequence
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        let {page, limit} = req.query;

        page = (page) ? page : 1; // defaults  page to 1
        limit = (limit) ? limit : 10; // defaults limit to 10;
        limit = parseInt(limit); // ensures that limit is a number;
        let users = await User.find()
                                .select("-password")
                                .sort({first_name: 1}) // sorts by first_name in ascending order
                                .skip((page-1) * limit) // skips the results by a specified ammount 
                                .limit(limit); // sets the limit on the number of results to return
        
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
        if(!platform) throw new Error("No platform provided");
        platform = platform.toLowerCase();
        let {email, password} = req.body;
        if(Object.keys(req.body).length == 0) throw new Error("No data passed to login");
        const user = await User.findOne({email: email});
        if(!user) throw new Error("No user matches this email");
        let passCheck = await user.isCorrectPassword(password);
        if(!passCheck)throw new Error("Invalid password");
        user.password = undefined;
        user.role = (platform == "web") ? undefined : user.role;
        let token = JWTHelper.genToken({id: user._id, role: user.role, email: user.email}, "900");
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
        let user_id = req.params.user_id;
        if(!mongoose.isValidObjectId(user_id)) throw new Error("Invalid format of user_id");
        let user = await User.findById(user_id);
        if(!user) throw new Error("No user found with this ID");
        user.password = undefined;
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
        if(!platform) throw new Error("No platform provided");
        platform = platform.toLowerCase();
        let userData = req.body;
        userData.profile_image = (req.file) ? req.file.path: undefined;
        let user = new User(userData); // creates model from userdata
        let duplicated = await user.checkDupe();
        if(duplicated) throw new Error("A user with that email already exists");
        await user.save(); // saves model 
        user.password = undefined;
        user.role = (platform == "web") ? undefined : user.role;
        JSONResponse.success(res, 'Success.', user, 201);   
    } catch (error) {
        JSONResponse.error(res, "Failed to create user or address.", error, 404);
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
        let user_id = req.params.user_id;
        let userData = req.body;
        if(Object.keys(userData).length == 0) throw new Error("No data passed to update user")
        userData.profile_image = (req.file) ? req.file.path: undefined;
        userData.password = undefined;
        if(!mongoose.isValidObjectId(user_id)) throw new Error("Invalid format of user_id");
        let user = await User.findByIdAndUpdate(user_id,userData, {new:true});
        user.password = undefined;
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
        let user_id = req.params.user_id;
        if(!mongoose.isValidObjectId(user_id)) throw new Error("User ID passed is not valid")
        let user = await User.findById(user_id);
        if(!user) throw new Error("No user found with this ID");
        user.status = "INACTIVE";
        // sets the deleted at the a date string that matches the one generated by the database timestamp.
        user.deletedAt = new Date().toISOString(); // eg. '2023-02-17T12:11:15.175Z'
        await user.save();
        user.password = undefined;
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
        let {email, redirectLink} = req.body;
        let users = await User.find({email: email});
        if(users.length === 0) throw new Error("No user exists with that email");
        let user = users[0];
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
    let {password} = req.body;
    if(!password) throw new Error("No password to update");
    let {user_id} = req.query;
    // Ensures that only the password will be updated on this route.
     let user = await User.findOne({_id: user_id});
     if (!user) throw new Error("User not found with this id");
     user.password = password;
     await user.save();
     user.password = undefined;
     JSONResponse.success(res, "Retrieved user info", user, 200);
  } catch (error) {
     JSONResponse.error(res, "Unable to find user", error, 404);
  }

}


