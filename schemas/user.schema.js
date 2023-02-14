const {Schema, model} = require("mongoose");


const userSchema = new Schema({
    first_name: {type: String, required:[true, "First Name is a required field"]},
    last_name: {type: String, required:[true, "Last Name is a required field"]},
    email: {type: String, required:[true, "Email is a required field"]},
    password: {type: String, required:[true, "Password is a required field"]},
    profile: {type: String},
    isAdmin: {type: Boolean, default: false},
    isApproved: {type: Boolean, default: false},

    address: {type: [Schema.Types.ObjectId], ref:"Address"},
    // The cell number will be required if the home number is not provided and vice versa.
    cell_num: {type: String, required: [function(){ return !this.home_num}, "A phone number needs to be on file"]},
    home_num: {type: String, required:[function(){ return !this.cell_num}, "A phone number needs to be on file"]}
});


//Here should contain any pre and post middlewares for schema.


//


// Creates a model from the schema created above;
module.exports = model("User", userSchema);