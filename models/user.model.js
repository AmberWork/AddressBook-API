// ---------------
// Based Veriables
// ---------------
const mongoose = require('mongoose');
// ---------------


// ---------------
// Schema
// ---------------
const userSchema = new mongoose.Schema({
    first_nm: {
        type: String,
        required: [true, 'First Name is required'],
    },

    last_nm: {
        type: String,
        required: [true, 'Last Name is required'],
    },

    email: {
        type: String
    },

    home_num: {
        type: String
    },

    cell_num: {
        type: String
    }
})

// ---------------



// ---------------
// Export Schema
// ---------------
// const User =mongoose.model('User', userSchema);
// module.exports = User;
// ---------------




