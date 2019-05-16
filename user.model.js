//npm install --save bcryptjs

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true},
    admin: {type: Boolean, required: true},
    pontszam: {type: Number}
}, {collection: 'users'});

userSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, function(error, hash) {
                if(error) {
                    return next(error);
                }
                user.password = hash;
                return next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePasswords = function(password, next) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        next(error, isMatch);
    });
};

userSchema.methods.updateScore = function(username, score, next) {

}

mongoose.model('user', userSchema);

function rankingUsers(allUsersArray) {
    allUsersArray.sort((user1, user2) => (user1.pontszam > user2.pontszam) ? 1 : -1)
    return allUsersArray
}