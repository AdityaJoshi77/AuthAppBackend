
// importing mongoose Model to facilitate interaction with Database..
const Auth = require('../models/authModels.js');

// importing jwt instance...
const jwt = require('jsonwebtoken');

// importing argon2 instance...
const argon = require('argon2');

// initiating process.env; to acquire the jwt_secret key
require('dotenv').config();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HANDLER : LOGIN CONTROL
const login = async (req,res) => {
    try{
        const {email, password} = req.body;

        // check if the user with the email id specified exists..
        let existUser = await Auth.findOne({email});

        // if user doesn't exist ..
        if(!existUser){
            console.log(`User with email == ${email} not found`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // if user exists, match password...
        try{
            if( !await argon.verify(existUser.password,password)){
                console.log('Incorrect Password');
                return res.status(403).json({
                    success: false,
                    message: 'Incorrect Password'
                })
            }
        }catch(err){
            return res.status(500).json({
                success:false,
                message:'Server Crashed'
            })
        }


        /*
            if(password != existUser.password){
            console.log('Incorrect Password');
            return res.status(403).json({
                // error code 403 : Forbidden, denial of access permission from server.
                success:false,
                message:'Incorrect Password'
            })
        }
        */

        // Successful Login....
        // create jwt token....
        const payload = {
            email : existUser.email,
            id: existUser._id,
            role: existUser.role
        }

        const jwt_secret = process.env.JWT_SECRET; 
        const jwt_token = jwt.sign(payload,jwt_secret) // sign() method takes two parameters necessarily : payload, jwt_secret_key

        // converting mongoose object existUser to a plain js object...
        // WHY ???? ==> 
            /*
                -- existUser was an instantiation of a mongoose document
                -- such an object will only contain those fields which exist
                    in the original document stored in the mongoDB database.
                -- So, any field that is created seperately after the create method
                    will simply not be stored in the object.
                -- So, we need to use the toObject method to convert a mongoose object to 
                    a plain js object. This way, creation of new fields in the same would be possible.
            */
        existUser = existUser.toObject();
        existUser.jwt_token = jwt_token;

        // removing password from the existUser object before sending as a response(security).
        existUser.password = undefined; 
        // but writing thus will not empty the password field, but remove it altogether from
        // the existUser object. isiliye json output mein gayab thi.


        // Testing creation of jwt_field in the existUser object....
        console.log(existUser);

        // setting up cookie...
        let cookieOptions = {
            expires: new Date(Date.now() + 2*24*60*60*1000), // expires in 2 days from current time.
            httpOnly: true // cookie accessible only on the server side.
        }

        // cookie params : cookie_name, cookie_data, cookie_options{}
        res.cookie(existUser.name+"_cookie", jwt_token, cookieOptions).status(200).json({
            success: true,
            jwt_token,
            message: 'Login Successful',
            data: existUser
        })

    }
    catch(err){
        console.log('Internal Server Error');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


// defining signup  Control...
// Steps required in signing in...
        // 1. extracting user credentials from the request body...
        // 2. Performing format validations on data (Not performed in our code yet);
        // 3. Checking whether current user already exits...
            // 2.1  If yes, return failure response (user already exists)
            // 2.2  If no, Proceed further....
        // 4. Perform password hashing (using bcrypt);
        // 5. Create entry in database

const signup = async (req,res) => {
    try{
        // extracting user credentials from the request body
        const {name, email, password, role} = req.body;

        // Data Format validations....
            /*
                error code : 400, Bad Request.
                // To be done .....    
            */

        // checking whether a user with same email exits
        const userExist = await Auth.findOne({email}); // Mis_1.
                

        // response if user already exists
        if(userExist){
            console.log('User with this email already exists');
            return res.status(409).json({
                // status 409 : Resourse State Conflict, email already in use
                // status 400 : Bad request may also be used.
                success: false,
                message: 'User already exists'
            })
        }

        // Securing Password:

        let hashPass;
        try{
            hashPass = await argon.hash(password);

        }catch(err){
            console.log('Password Hashing Failed.');
            return res.status(500).json({
                success: false,
                message: 'Failure in hashing the password'
            })
        }

        /*
            // DEPRECATED !!!!
            // The bcrypt library has been deprecated, so the encryption of password
            // has been postponed until a suitable alternative is found.

        */

        // new user creation...
        const newUser = await Auth.create({name,email,password:hashPass,role});

        // success response
        res.status(200).json({
            success: true,
            message: 'Registration successful',
            data: newUser
        })
    }
    catch(err){
        console.log('Internal Server Error');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

// exporting controllers...
module.exports = {login,signup};

// Mistakes Made:
        /*  1. Mis_1 ==>
            // const userExist = await Auth.find(email);
            The find() function would have returned all the entries which match
            the email id mentioned. 

            we use the findOne() function to get the first entry which matches the 
            email mentioned, which serves our purpose.
        */