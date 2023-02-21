// An array of possible roles for user;
module.exports.roleMap = new Map([
    ["USER",0],
    ["ADMIN",1]
]);

// Enum array of possible statuses: 
module.exports.statusMap = new Map ([
    ["PENDING", 0], 
    ["APPROVED", 1], 
    ["ACTIVE", 2], 
    ["INACTIVE", 3]
]);


/**
 * Searches a map for a value then return the key that it is attached to. If no key is value is found it returns null
 * @param {Map} map the map to search
 * @param {Number} value value to search for in the map
 * @returns { String|null }
 */
module.exports.getKeyFromValue = (map, value)=>{
    for(let [key, val] of map.entries()){
        if(val === value){
            return key;
        }
    }
    return null;
}