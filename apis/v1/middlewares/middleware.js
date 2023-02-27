const { JSONResponse } = require("../../../utilities/response_utility");
const JWT = require("jsonwebtoken");
const {getKeyFromValue, roleMap } = require("../../../constants/constant_maps");

class Middleware{

    // Selected route to test for;
    /**
     * @type {String[]}
     */
    selectedRoleList = [];

    /**
     * ### Description
     * Gets the requests then checks to ensure therer is a authorization header present. If there is it gets the token and assigns it to the request as a token property.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    protected = async (req, res, next) => {
        try{
            // gets the authorization property of the header
            const bearerHeader = req.headers['authorization'];
            
            if (bearerHeader) {
                // split the header by the space to only get the value of the token at position 1
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.locals.token = bearerToken;
                let decodedToken = JWT.verify(bearerToken, process.env.JWT_SECRET_KEY);
                req.locals.decoded = decodedToken;
                next();
            } else {
                // Forbidden
                JSONResponse.error(res, "Unauthorized Access Attempted","Access Denied", 403);        }
        }catch(error){
            JSONResponse.error(res, "Unauthorized Access Attempted",error, 403); 
        }
    }

    /**
     * @description Allow the caller to identify and array of roles to determine the authority allowed by the route.
     * @param {Array} roleArray 
     * @returns {Function} Function which accepts req, res, next to act as middleware to protect route.
     */
    protectedViaRole = (roleArray) =>{
        try{
            if(isValidAuthLevel(roleArray)){
                
                this.selectedRoleList = roleArray;
                return this.middleware;
            }
             
        }catch(error){
            throw new Error(error)
        }
        
    }
    middleware = (req, res,next) =>{
        try{
            let token = getTokenFromBearer(req);
            res.locals.token = token;
            res.locals.decoded = JWT.verify(token,process.env.JWT_SECRET_KEY);
            res.locals.user_role = res.locals.decoded.role;
            if(!this.selectedRoleList.includes(res.locals.user_role)) {
                return JSONResponse.error(res, "Unauthorized Access Attempted","Not the correct Auth Level", 403);
            }
            // compares the user id of the token to ensure that a user can only manage his data unless he is an admin.
            userMatchesAccount(req, res, next);
            next();
        }catch(error){
            return JSONResponse.error(res, "Unauthorized Access Attempt", error, 403);
        }
    }

}

function userMatchesAccount(req, res, next){

    if((req.params.user_id && req.params.user_id != res.locals.decoded.id) && res.locals.user_role != "ADMIN") throw new Error("User Does not have permission to view");
    return true
}

function getTokenFromBearer(req){
    try{
        // gets the authorization property of the header
        const bearerHeader = req.headers['authorization'];
        
        if (bearerHeader) {
            // split the header by the space to only get the value of the token at position 1
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            return bearerToken;
        } else {
            // Forbidden
            throw new Error("No Authorization Header")
            }
    }catch(error){
        throw new Error("Invalid Token Format") 
    }
}


function isValidAuthLevel(authLevelList){
    if(!authLevelList || authLevelList.length == 0) throw new Error("No auth level Provided")
    // loop through authLevelList provided and test it agains 
    authLevel = authLevelList.map((authLevel)=> {
        authLevel = authLevel.toUpperCase();
        if(!roleMap.has(authLevel)) throw new Error("Not a valid role");
        return authLevel;
    })
   
    return true;
}

module.exports = Middleware;