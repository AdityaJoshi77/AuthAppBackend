
// getting jwt instance to read jwt_tokens...
const jwt = require('jsonwebtoken');

// loading process.env (for jwt_secret)
require('dotenv').config();

// Login Authenticator... PERFORMS AUTHENTICATION
// The login authenticator has three jobs : 
    // 1. To extract the token from the request.
    // 2. Decode the extracted token (using verify method)
    // 3. Store the decoded data back into the request.
const auth = (req,res,next) => {
    try{
        // fetch jwt token
        // PENDING: Examining multiple ways to extract jwt_token...

        const token = req.body.jwt_token;
        
        // Token not found error...
        if(!token){
            console.log('Token not found');
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }

        // decoding the token...
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // storing the data after decoding back into the request...
            req.user = payload
            console.log(payload);
        }catch(err){
            console.log('Could not decode token');
            return res.status(401).json({
                success: false,
                message: 'Could not decode the token'
            })
        }
    }catch(error){
        console.log('Internal Server error');
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

    // next call to invoke the next middleware...
    next();
}

// Role Validator : Student, PERFORMS AUTHORIZATION
// The job of this role validator is to verify whether the user is a student or not

const isStudent = (req,res,next) => {
    try{

        // Verifying Student role:
        if(req.user.role !== 'Student'){
            console.log('User is not a student');
            return res.status(401).json({
                success: false,
                message: 'This route is protected for Students'
            })
        }

        // next call for next middleware
        next();

    }catch(err){
        console.log('Internal Server error');
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

// Role Validator : Admin, PERFORMS AUTHORIZATION
const isAdmin = (req,res,next) => {
    try{

        // Verifying Admin role:
        if(req.user.role !== 'Admin'){
            console.log('User is not a Admin');
            return res.status(401).json({
                success: false,
                message: 'This route is protected for Admins'
            })
        }

        // next call for next middleware
        next();

    }catch(err){
        console.log('Internal Server error');
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {auth,isStudent,isAdmin};