const {Schema, model} = require("mongoose");



const addressSchema = new Schema({
    line_1: {type: String, required: [true, "Line 1 of address is required"]},
    line_2: {type: String},
    city: {type: String, required: [true, "City of address is required"]},
    parish: {type: String, required: [true, "Parish of address is required"]},
    isApproved: {type: Boolean, default: false, required: [true, "address status should be approved"]},
});




module.exports = model("Address", addressSchema);