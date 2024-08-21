const mongoose = require('mongoose'); //ORM for mongoDB
const bcrypt = require('bcryptjs'); //For hashing password
const jwt = require('jsonwebtoken'); //For creating jsonwebtoken

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true],
            minlength: 3,
            maxlength: 50,
        },
        username: {
            type: String,
            required: [true],
            unique: true,
        },
        email: {
            type: String,
            required: [true],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

    }, { timestamps: true }
);

// Method to create jsonwebtoken for user -> String
// everytime a user is created, it will be stored in the user collection in the database
userSchema.methods.createJWT = function (){
    return jwt.sign({ userId: this._id, name : this.name }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME}); //generating token for users
    }

const user = mongoose.model('User', userSchema);
module.exports = user 