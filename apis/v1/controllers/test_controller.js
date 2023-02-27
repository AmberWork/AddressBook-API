const User = require("../../../schemas/user_schema");
const Address = require("../../../schemas/address_schema");
const Parish = require("../../../schemas/parish_schema");
const { JSONResponse } = require("../../../utilities/response_utility");
const userDump = require("../../../configs/user_generated.json")
const addressDump = require("../../../configs/address_generated.json")
const parishDump = require("../../../configs/parish_generated.json")



exports.generateTestData = async(req, res, next) =>{
    try{
        userDump.forEach((user)=>{
            user.createdAt = new Date(user.createdAt).toISOString();
            user.updatedAt = new Date(user.updatedAt).toISOString();
            user.deletedAt = user.deletedAt? new Date(user.deletedAt).toISOString(): null;
        });

        addressDump.forEach((address)=>{
            address.createdAt = new Date(address.createdAt).toISOString();
            address.updatedAt = new Date(address.updatedAt).toISOString();
            address.deletedAt = address.deletedAt? new Date(address.deletedAt).toISOString(): null;
        });
        await User.insertMany(userDump);
        await Parish.insertMany(parishDump);
        await Address.insertMany(addressDump);
        JSONResponse.success(res, "Test Data successfully dumped in Database", {}, 200)

    }catch(error){
        console.log(error.stack)
        JSONResponse.error(res, "Unable to Dump test data", error, 400 )
    }
}