const {Schema, model} = require("mongoose");
const addressSchema = require("./address.schema");

const roleEnum = [
    "ADMIN", "USER"
];
const statusEnum = [
    "PENDING", "APPROVED", "ACTIVE", "INACTIVE"
];
const userSchema = new Schema({
    first_name: {type: String, required:[true, "First Name is a required field"]},
    last_name: {type: String, required:[true, "Last Name is a required field"]},
    email: {type: String, required:[true, "Email is a required field"]},
    password: {type: String, required:[true, "Password is a required field"]},
    profile_image: {type: String},
    role: {type: String, enum:{values:["ADMIN", "USER"], message: `{VALUES} is not a valid role. roles: ${roleEnum}`},  default: "USER"},
    // The cell number will be required if the home number is not provided and vice versa.
    mobile_number: {type: String, required: [function(){ return this.role != "ADMIN" && !this.home_num}, "A phone number needs to be on file"]},
    home_number: {type: String, required:[function(){ return this.role != "ADMIN" && !this.cell_num}, "A phone number needs to be on file"]},
    status: {type: String, enum: {values: statusEnum, message:`{VALUES} is not a valid status. statuses: ${statusEnum}`}},
    deletedAt: {type:Schema.Types.Date, default: null},

}, {timestamps:true});


//Here should contain any pre and post middlewares for schema.



//


// Creates a model from the schema created above;
module.exports = model("User", userSchema);