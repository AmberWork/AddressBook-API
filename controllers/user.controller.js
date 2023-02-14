// ---------------
// Based Imports
// ---------------
const Users = require('../schemas/user.schema');
const Address = require('../schemas/address.schema');
const { JSONResponse } = require('../utilities/response.utility');
// ---------------


// get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find();
        JSONResponse.success(res, 'Success.', users, 200);
    } catch (err) {
        JSONResponse.err(res, "Failed to get all users.", err, 500);
    }
}


// get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (err) {
        JSONResponse.err(res, "Failed to get user by id.", err, 404);
    }
}


// create address and user
exports.createUser = async (req, res, next) => {
    try {
        const address = await Address.create(req.body.address);

        const user = await Users.create({...req.body, address: [address._id]});
        JSONResponse.success(res, 'Success.', user, 201);   
    } catch (err) {
        JSONResponse.err(res, "Failed to create user or address.", err, 500);
    }
}


// update user
exports.updateUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, {new:true});
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (err) {
        JSONResponse.err(res, "Failed to update user.", err, 500);
    }
}


// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        JSONResponse.success(res, 'Success.', user, 200);
    } catch (err) {
        JSONResponse.err(res, "Failed to delete user.", err, 500);
    }
}





