const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString)
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('error connecting to MongoDB:', err.message);
    });