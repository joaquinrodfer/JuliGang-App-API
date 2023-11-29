const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    fullname: String,
    username: String,
    email: String,
    dob: Date,
    password: String,
    created: Date,
    role: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const User = model('User', userSchema);

module.exports = User;