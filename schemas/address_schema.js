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
    
    let limitIndex = 0;
    let skipIndex;
    let limit = this.pipeline().filter((stage, index)=>{
        if(Object.keys(stage)[0] == "$limit"){
            limitIndex = index;
            return true
        }
    })
    let skip = this.pipeline().filter((stage, index)=>{
        if(Object.keys(stage)[0] == "$skip"){
            skipIndex = index;
            return true
        }
    })

    this.pipeline().splice(limitIndex,1);
    this.pipeline().splice(skipIndex,1);

    this.facet({
        count:[{$count: "count"}],
        data:[
            {$lookup:{
                from: "parishes", //collection name
                localField: "parish", // parish id in the addresses table
                foreignField: "_id", // id in the parishes collection
                as: "parish" //the alias, what you want the property be called
            }},
            {$unwind:{path:"$parish"}},
            {$lookup:{
                from: "users", //collection name
                localField: "user_id", // parish id in the addresses table
                foreignField: "_id", // id in the parishes collection
                as: "user_id" //the alias, what you want the property be called
            }},
            {$unwind:{path:"$user_id"}},
            skip[0],
            limit[0]
        ]
    });



    

    
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