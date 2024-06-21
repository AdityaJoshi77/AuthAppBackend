
const express = require('express');
const router = express.Router();


// importing controllers....
const {login,signup} = require('../controllers/authControls.js');

// importing authentication middlewares....
const {auth, isStudent, isAdmin} = require('../middlewares/authMid.js');

// Login, Signup routes...
router.post('/login',login);
router.post('/signup',signup);

// defining authentication middlewaress...
router.post('/Student', auth, isStudent, (req,res) => {
    console.log('Student signup Successful');
    res.status(200).json({
        success: true,
        message: 'Student verified'
    })
})

router.post('/Admin', auth, isAdmin, (req,res) => {
    console.log('Admin signup Successful');
    res.status(200).json({
        success: true,
        message: 'Admin verified'
    })
})

// exporting router...
module.exports = router;