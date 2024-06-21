
// importing mongoose instance...
const mongoose = require('mongoose');

// initializing process.env for Database url...
require('dotenv').config();

// defining datbase connector...
const dbConnect = async() => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database Connection Successful'))
    .catch((err) => {
        console.log('Database Connection Failed');
        console.log(err);
        process.exit(1);
    })
}

module.exports = dbConnect;
