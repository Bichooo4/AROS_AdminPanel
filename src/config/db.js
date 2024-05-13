const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const db = process.env.MONGODB_URL;

mongoose.connect(db).then(() => {
    console.log('MongoDB connected...');
}).catch((err) => {
    console.log(err);
});