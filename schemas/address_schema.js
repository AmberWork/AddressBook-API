const {Schema, model} = require("mongoose");


const addressSchema = new Schema({
    address_1: {type: String, required: [true, "Line 1 of address is required"]},
    address_2: {type: String},
    user_id: {type: Schema.Types.ObjectId, ref: "User", required:[true, "An address must be linked to a user"] }, 
    city: {type: String, required: [true, "City of address is required"]},
    parish: {type: Schema.Types.ObjectId, ref: "Parish", required: [true, "Parish of address is required"]},
    status: {type: Number, default:0},
    deletedAt: {type: Schema.Types.Date, default: null}
}, {timestamps: true});

addressSchema.pre("aggregate", function(next) {
    this.lookup({
        from: "parishes", //collection name
        localField: "parish", // parish id in the addresses table
        foreignField: "_id", // id in the parishes collection
        as: "parish" //the alias, what you want the property be called
    })
    
    .unwind("$parish")


    // .project({
    //     parish: {
    //         _id: 0,
    //         __v: 0
    //     }
    // })
    
    next();
})


module.exports = model("Address", addressSchema);