const {Schema, model} = require("mongoose");
const { schema } = require("./parish_schema");


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
        localField: "ObjectId(parish)", // parish id in the addresses table
        foreignField: "ObjectId(_id)", // id in the parishes collection
        as: "parish" //the alias, what you want the property be called
    }).lookup({
        from: "users", //collection name
        localField: "ObjectId(user_id)", // parish id in the addresses table
        foreignField: "ObjectId(_id)", // id in the parishes collection
        as: "user_id", //the alias, what you want the property be called
        
    }).unwind("$user_id").unwind("$parish");

    // .project({
    //     parish: {
    //         _id: 0,
    //         __v: 0
    //     }
    // })
    
    // edit the pipeline to add the limit to the end of the pipeline
    // may be refactored to only let one limit remain in the pipeline
    let limit = this.pipeline().filter((stage)=> {
        return Object.keys(stage) == "$limit"})[0]
    this.pipeline().push(limit);
    
    next();
})


addressSchema.pre(/^find/, function(next) {


    this.populate({
        path: "parish",
        select: "parishName"      
    });

    this.populate({
        path: "user_id",
        select: "email"
    })
    next();
})





module.exports = model("Address", addressSchema);