// An array of possible roles for user;
module.exports.roleMap = new Map([
    ["USER",0],
    ["ADMIN",1]
]);

// Enum array of possible statuses: 
module.exports.statusEnum = new Map ([
    ["PENDING", 0], 
    ["APPROVED", 1], 
    ["ACTIVE", 2], 
    ["INACTIVE", 3]
]);