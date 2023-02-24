const {Schema, model} = require("mongoose");
const bcrypt = require("bcryptjs");
const htmlCompiler = require("../utilities/compile_html_utility");
const emailer = require("../utilities/nodemailer_utility");
const { roleMap, getKeyFromValue, statusEnum, statusMap } = require("../constants/constant_maps");



const userSchema = new Schema({
    first_name: {type: String, required:[true, "First Name is a required field"]},
    last_name: {type: String, required:[true, "Last Name is a required field"]},
    email: {type: String, required:[true, "Email is a required field"]},
    password: {type: String, required:[true, "Password is a required field"]},
    profile_image: {type: String},
    role: {type: Number, default: 0},

    // The cell number will be required if the home number is not provided and vice versa.
    mobile_number: {type: String, required: [function(){ return this.role != "ADMIN" && !this.home_number}, "A phone number needs to be on file"]},
    home_number: {type: String, required:[function(){ return this.role != "ADMIN" && !this.mobile_number}, "A phone number needs to be on file"]},
    status: {type: Number, default: 0},
    deletedAt: {type:Schema.Types.Date, default: null},

}, {timestamps:true});


//Here should contain any pre and post middlewares for schema.

// Middleware function to execute and hash password before saving user into the database.
userSchema.pre("save", async function(next){
    try{
        if(!this.isModified('password')) return next(); 
        this.password = await bcrypt.hash(this.password,10);       
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});

// Returns the correctFormat of of role


// Softdelete of user
userSchema.pre("deleteOne",(next)=>{
    console.log("deleted");
    this.deletedAt = new Date().toISOString();
    this.status = statusEnum.get("INACTIVE");
    
});

// Check for duplicate emails in the user table
userSchema.methods.checkDuplicate = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await model('User')
			.find({ email: this.email})
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    let isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}


/**
 * @description Sends email to request password link to the user that is attached.
 * @param {string} redirectLink This is the link to the webpage which has the password reset form;
 * @returns 
 */
userSchema.methods.requestPasswordReset = async function(redirectLink){
    console.log(this);
    const data = {
        user: {first_name: this.first_name, last_name: this.last_name},
        redirectLink
    }
    try{
        let html = htmlCompiler.compileHtml("password_reset",data);
        await emailer.sendMail(this.email, "Password Reset",`Hello ${this.first_name} ${this.last_name}`,html);
    }catch(error){
        return Promise.reject(new Error(error));
    }
}

// Creates a model from the schema created above;
module.exports = model("User", userSchema);