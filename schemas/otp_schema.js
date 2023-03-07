const {Schema, model} = require("mongoose");
const htmlCompiler = require("../utilities/compile_html_utility");
const emailer = require("../utilities/nodemailer_utility");
const otpGenerator = require('otp-generator');



const otpSchema = new Schema({
   email: {type: String, required:[true, "Email is a required field"]},
   otp: {type: String, default: () => otpGenerator.generate(6, { 
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true, 
   })}, 

   user_id: {type: Schema.Types.ObjectId, ref: "User", required:[true, "User ID is a required field"]},
   createdAt: {type: Schema.Types.Date, default: Date.now},
   updatedAt: {type: Schema.Types.Date, default: Date.now},
   expiresAt: {type: Schema.Types.Date, default: () => {
      return new Date(new Date().getTime() + (5 * 60 * 1000));
   }},
})


otpSchema.pre("save", async function(next) {
   await this.populate("user_id")
   console.log(this)
   if (this.isNew) {
      let data = {
         user: {first_name: this.user_id.first_name},
         attempted_date: new Date().toDateString(),
         verification_code: this.otp
      }
      console.log(this.user_id)
      
      let html = htmlCompiler.compileHtml("otp_verification", data);
      await emailer.sendMail(this.email, "Please verify you account", `${this.email}`, html)
   }
   next()
})


module.exports = model("Otp", otpSchema);