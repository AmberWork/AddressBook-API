const Users = require('../models/user.model');

// get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}


// get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}


// create user
exports.createUser = async (req, res, next) => {
    try {
        const user = await Users.create(req.body); 
        res.status(200).json(user);   
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}


// update user
exports.updateUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json({user, status: 'Success'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}


// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        res.status(200).json({user, status: 'Success'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}





