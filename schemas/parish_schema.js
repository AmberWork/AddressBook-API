const {Schema, model} = require("mongoose");

const parishSchema = new Schema({
    parishName: {type: String, required:[true, "Parish name is a required field"]}
});



module.exports = model("Parish", parishSchema);