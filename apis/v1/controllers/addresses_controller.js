// ---------------
// Based Imports
// ---------------
const Address = require("../../../schemas/address_schema");
const Parish = require("../../../schemas/parish_schema");
const { JSONResponse } = require("../../../utilities/response_utility");

const User = require("../../../schemas/user_schema");

const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;
const {
  statusMap,
  getKeyFromValue,
} = require("../../../constants/constant_maps");
// ---------------

// get all Address
exports.getAllAddresses = async (req, res, next) => {
  try {
    // pagination
    let { page, limit } = req.query;

    page = page ? page : 1; // defaults  page to 1
    limit = limit ? limit : 10; // defaults limit to 10;
    limit = parseInt(limit); // ensures that limit is a number;
    let skip = (page - 1) * limit; // skips the results by a specified ammount

    let status = req.query.status; //
    status = status ? status.toUpperCase() : undefined;
    status = statusMap.has(status) ? statusMap.get(status) : undefined;

    const searchQuery = {
      parishName: req.query.parishName,
      status: status,
      city: req.query.city,
      address_1: req.query.address_1,
    };

    let searchResult = [];
    // remove the params that are undefined or have empty field request
    Object.keys(searchQuery).forEach((search) => {
      if (
        searchQuery[search] == undefined ||
        (searchQuery[search] == "" && searchQuery[search] != 0)
      ) {
        if (
          search !== "status" ||
          (search == "status" && searchQuery[search] == undefined)
        )
          delete searchQuery[search];
      }

      // boolean cannot do regex operations, hence the need to format is differently
      if (searchQuery[search] == "true" || searchQuery[search] == "false") {
        searchResult.push({ [search]: searchQuery[search] });
        delete searchQuery[search];
      }
    });

    // addresses.forEach(address => address.status = address.status.toString())

    // format the query for partial search in the database
    Object.keys(searchQuery).forEach((search) => {
      console.log(searchQuery)
      if (search == "status") {
        searchResult.push({ status: { $eq: searchQuery[search] } });
      } else
        searchResult.push({
          [search]: { $regex: searchQuery[search], $options: "i" },
        });
    });

    // sorting by order
    const sortField = req.query.sortField || "_id";
    const sortOrder = req.query.sortOrder || "des";
    const sortObj = {};
    sortObj[sortField] = sortOrder === "asc" ? 1 : -1;
    let addressCount = await Address.find();
    let aggregateData = await Address.aggregate(
      searchResult.length
        ? [
          ...searchResult.map((result) => {
            return { $match: result };
          }),
          { $match: {status: { $ne: statusMap.get("INACTIVE") }}},
          { $skip: skip }, 
          
          { $sort: sortObj }, 
          { $limit: limit },

        ]
        : [{ $match: {status: { $ne: statusMap.get("INACTIVE") }}},{$sort: sortObj},{ $skip: skip },{ $limit: limit },]
    )
    .project({ deletedAt: 0, createdAt: 0, updatedAt: 0 });

    let addresses = this.makeAddressReadable(aggregateData[0]["data"]);
    JSONResponse.success(
      res,
      "success",
      {
        addresses,
        page: page,
        limit: limit,
        count: aggregateData[0]["count"][0]["count"]
      },
      200
    );
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

exports.makeAddressReadable = (addresses) => {
    
    let readableAddresses;
        if(Array.isArray(addresses)) {
            readableAddresses = addresses.map((doc) => {
                let statusKey = checkStatusAndMakeReadable(doc);
                doc = doc._doc ? doc._doc: doc
                let newAddress = {
                    ...doc,
                    status: statusKey,
                    parish: doc.parish.parishName,
                    user_id: doc.user_id.email,
                }
                return newAddress;
            })
          } else {
            
            addresses = addresses._doc ? addresses._doc: addresses
            let statusKey = checkStatusAndMakeReadable(addresses);
            readableAddresses = {
              // ...addresses._doc,
              ...addresses,
                status: statusKey,
                parish: addresses.parish.parishName,
                user_id: addresses.user_id.email,
                // parish: addresses._doc.parish.parishName
            }
        }
        return readableAddresses;
}


// get address by id
exports.getAddressById = async (req, res, next) => {
  try {
    let address = await Address.findById(req.params.id)
      .ne("status", statusMap.get("INACTIVE"))
      .select({ deletedAt: 0, createdAt: 0, updatedAt: 0 });

    if (!address) throw new Error("Address not found");

    address = this.makeAddressReadable(address);

    JSONResponse.success(res, "Success.", address, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// get all address by user id
exports.getAllAddressByUserId = async (req, res, next) => {
    try {
        let user_id = req.params.user_id;

        if(!mongoose.Types.ObjectId.isValid(user_id)) {
            throw new Error('Address not found');
        }
        console.log(user_id)
        // Find user that matches the user id that isn't INACTIVE
        let user = await User.findOne({_id: user_id, $ne : {status: statusMap.get("INACTIVE")}});
        if(user) {
            let address = await Address.find({user_id : user_id})
            .ne("status", statusMap.get("INACTIVE"))
            .select({ deletedAt: 0, createdAt: 0, updatedAt: 0 });
            console.log(address)
            address = this.makeAddressReadable(address);
    
            JSONResponse.success(res, 'Success.', address, 200);            
        } else {
            JSONResponse.success(res, 'Success.', [], 200);          
        }

    } catch (error) {
        JSONResponse.error(res, 'Error.', error, 404);
    }
};

// create address
exports.createAddress = async (req, res, next) => {
  try {
    let addressData = req.body;
    let address = await(await new Address(addressData).save()).populate("parish user_id")
    // address = address.populate("user_id parish");
    if (!address) throw new Error("Address not created");
    // check if the user_id is of the ObjectID type
    if (!mongoose.Types.ObjectId.isValid(addressData.user_id)) {
      throw new Error("User id is not valid");
    }


    address = this.makeAddressReadable(address);
    address = {
      ...address,
      deletedAt: undefined,
      updatedAt: undefined,
      createdAt: undefined,
    };

    JSONResponse.success(res, "Success.", address, 201);
  } catch (error) {
    console.log(error.stack);
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// update address
exports.updateAddress = async (req, res) => {
  try {
    let platform = req.query.platform;
    platform = checkForPlatform(platform);

    let addressData = req.body;
    addressData.status = statusMap.has(addressData.status)
      ? statusMap.get(addressData.status)
      : undefined;
    let address = await Address.findByIdAndUpdate(req.params.id, addressData, {
      new: true,
    })
      .ne("status", statusMap.get("INACTIVE"))
      .select({ deletedAt: 0, createdAt: 0, updatedAt: 0 });

    if (!address) throw new Error("Address not found");

    address = this.makeAddressReadable(address);

    JSONResponse.success(res, "Success.", address, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// soft delete address
exports.softDeleteAddress = async (req, res) => {
  try {
    let address = await Address.findByIdAndUpdate(req.params.id, {
      status: statusMap.get("INACTIVE"),
      deletedAt: new Date().toISOString(),
    })
      .ne("status", statusMap.get("INACTIVE"))
      .select({ deletedAt: 0, createdAt: 0, updatedAt: 0 });

    if (!address) throw new Error("Address not deleted");

    address = this.makeAddressReadable(address);

    JSONResponse.success(res, "Success.", address, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// destroy address
exports.destroyAddress = async (req, res) => {
  try {
    let address = await Address.findByIdAndDelete(req.params.id);

    if (!address) throw new Error("Address not destroyed");

    address = this.makeAddressReadable(address);

    JSONResponse.success(res, "Success.", address, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// get all Parish
exports.getAllParish = async (req, res, next) => {
  try {
    const parishes = await Parish.find();

    JSONResponse.success(res, "Success.", parishes, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// get Parish by id
exports.getParishById = async (req, res, next) => {
  try {
    const parish = await Parish.findById(req.params.id);
    JSONResponse.success(res, "Success.", parish, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// create Parish
exports.createParish = async (req, res, next) => {
  try {
    const parish = await Parish.create(req.body);

    if (!parish) throw new Error("Parish not created");
    JSONResponse.success(res, "Success.", parish, 201);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// update Parish
exports.updateParish = async (req, res) => {
  try {
    const parish = await Parish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!parish) throw new Error("Parish not updated");
    JSONResponse.success(res, "Success.", parish, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// delete Parish
exports.deleteParish = async (req, res) => {
  try {
    const parish = await Parish.findByIdAndDelete(req.params.id);
    if (!parish) throw new Error("Parish not deleted");
    JSONResponse.success(res, "Success.", parish, 200);
  } catch (error) {
    JSONResponse.error(res, "Error.", error, 404);
  }
};

// Checks if the platform is valid
function checkForPlatform(platform) {
  if (!platform) throw new Error("No platform provided");
  platform = platform.toLowerCase();
  if (platform != "web" && platform != "admin")
    throw new Error("Invalid platform");
  return platform;
}

function checkStatusAndMakeReadable(address) {
  let statusKey = getKeyFromValue(statusMap, address.status);
  if (!statusKey) throw new Error("Invalid status type on user");
  return statusKey;
}
