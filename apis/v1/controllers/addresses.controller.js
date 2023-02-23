// ---------------
// Based Imports
// ---------------
const Address = require('../../../schemas/address.schema');
const Parish = require('../../../schemas/parish.schema');
const { JSONResponse } = require('../../../utilities/response.utility');

const User = require('../../../schemas/user.schema');

const mongoose = require('mongoose');
// ---------------



// get all Address
exports.getAllAddresses = async (req, res, next) => {
    try {

        // pagination
        let { page, limit } = req.query;

        page = (page) ? page : 1; // defaults  page to 1
        limit = (limit) ? limit : 10; // defaults limit to 10;
        limit = parseInt(limit); // ensures that limit is a number;
        let skip = (page - 1) * limit; // skips the results by a specified ammount 
        
        const addresses = await Address.find()
        .skip(skip) //call the skip variable
        .limit(limit); // sets the limit on the number of results to return
        
        JSONResponse.success(res, 'Success.', addresses, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}


// get address by id
exports.getAddressById = async (req, res, next) => {
    try {
        const address = await Address.findById(req.params.id);

        if(!address) throw new Error('Address not found');

        JSONResponse.success(res, 'Success.', address, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}


// get all address by user id
exports.getAllAddressByUserId = async (req, res, next) => {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
            throw new Error('Address not found');
        }

        // if(!mongoose.Types.ObjectId.isValid(req.params.user_id)) throw new Error('Invalid format of user_id');
        // const user = await User.findById(req.params.user_id);
        // if(!user) throw new Error('User not found');
        // const addresses = await Address.find({user_id: req.params.user_id});
        
        JSONResponse.success(res, 'Success.', addresses, 200);
        const address = await Address.find({user_id: req.params.user_id});
        JSONResponse.success(res, 'Success.', address, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}



// create address
exports.createAddress = async (req, res, next) => {
    try {
        const address = await Address.create(req.body)
        
        if(!address) throw new Error('Address not created');

        // check if the user_id is of the ObjectID type
         if(!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
            throw new Error('User id is not valid');
         }
         

        JSONResponse.success(res, 'Success.', address, 201);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}




// update address
exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true})

        if(!address) throw new Error('Address not updated');
        
        JSONResponse.success(res, 'Success.', address, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}



// soft delete address
exports.softDeleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, {
            status: 'INACTIVE',
            deletedAt: new Date().toIsoString()
            
        })
        

        if(!address) throw new Error('Address not deleted');

        JSONResponse.success(res, 'Success.', address, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}





// destroy address
exports.destroyAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);

        if(!address) throw new Error('Address not destroyed');

        JSONResponse.success(res, 'Success.', address, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}






// get all Parish
exports.getAllParish = async (req, res, next) => {
    try {
        const parishes = await Parish.find();
        
        JSONResponse.success(res, 'Success.', parishes, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}

// get Parish by id
exports.getParishById = async (req, res, next) => {
    try {
        const parish = await Parish.findById(req.params.id);
        JSONResponse.success(res, 'Success.', parish, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}

// create Parish
exports.createParish = async (req, res, next) => {
    try {
        const parish = await Parish.create(req.body)
        
        if(!parish) throw new Error('Parish not created');
        JSONResponse.success(res, 'Success.', parish, 201);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}

// update Parish
exports.updateParish = async (req, res) => {
    try {
        const parish = await Parish.findByIdAndUpdate(req.params.id, req.body, { new: true})
        if (!parish) throw new Error('Parish not updated');
        JSONResponse.success(res, 'Success.', parish, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}


// delete Parish
exports.deleteParish = async (req, res) => {
    try {
        const parish = await Parish.findByIdAndDelete(req.params.id);
        if (!parish) throw new Error('Parish not deleted');
        JSONResponse.success(res, 'Success.', parish, 200);
    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
}















