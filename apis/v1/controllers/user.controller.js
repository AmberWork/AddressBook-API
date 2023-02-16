// ---------------
// Based Imports
// ---------------
const { default: mongoose } = require('mongoose');
const User = require('../../../schemas/user.schema');
const { JSONResponse } = require('../../../utilities/response.utility');
const JWTHelper = require('../../../utilities/token.utility');
// ---------------


// get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        JSONResponse.success(res, 'Success.', users, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to get all users.", error, 404);
    }
}

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


// get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to get user by id.", error, 404);
    }
}


// create address and user
exports.createUser = async (req, res, next) => {
    try {
        let {platform} = req.query;
        if(!platform) throw new Error("No platform provided");
        platform = platform.toLowerCase();
        let userData = req.body;
        console.log(req.file)
        userData.profile_image = (req.file) ? req.file.path: undefined;
        let user = new User(userData); // creates model from userdata
        let duplicated = await user.checkDupe();
        if(duplicated) throw new Error("A user with that email already exists");
        await user.save(); // saves model 
        user.password = undefined;
        user.role = (platform == "web") ? undefined : user.role;
        JSONResponse.success(res, 'Success.', {user}, 201);   
    } catch (error) {
        JSONResponse.error(res, "Failed to create user or address.", error, 404);
    }
}


// update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true});
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to update user.", error, 404);
    }
}


// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (error) {
        JSONResponse.error(res, "Failed to delete user.", error, 404);
    }
}

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
     console.log(user)
     user.password = undefined;
     JSONResponse.success(res, "Retrieved user info", {user}, 200);
  } catch (error) {
     JSONResponse.error(res, "Unable to find user", error, 404);
  }

}


