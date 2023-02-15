// ---------------
// Based Imports
// ---------------
const User = require('../../../schemas/user.schema');
const Address = require('../../../schemas/address.schema');
const { JSONResponse } = require('../../../utilities/response.utility');
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
        let {email, password} = req.body;
        if(Object.keys(req.body).length == 0) throw new Error("No data passed to login");
        const user = await User.findOne({email: email});
        if(!user) throw new Error("No user matches this email");
        let passCheck = await user.isCorrectPassword(password);
        if(!passCheck)throw new Error("Invalid password");
        JSONResponse.success(res, "Successfully found user", user, 200);
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
        const user = await User.create({...req.body});
        JSONResponse.success(res, 'Success.', user, 201);   
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





