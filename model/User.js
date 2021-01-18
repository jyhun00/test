const mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const userSchema = new mongoose.Schema({
    name: String,
    email:  {
        type: String,
        unique: true // `email` must be unique
    },
    password: String,
}, schemaOptions);

userSchema.virtual('passwordConfirmation')
    .get(function(){ return this._passwordConfirmation; })
    .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
    .get(function(){ return this._originalPassword; })
    .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
    .get(function(){ return this._currentPassword; })
    .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
    .get(function(){ return this._newPassword; })
    .set(function(value){ this._newPassword=value; });


var passwordRegex = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;
var passwordRegexErrorMessage = '숫자, 알파벳, 특수문자 1개 이상씩 포함해주세요';
userSchema.path('password').validate(function(v) {
    var user = this;
    if(user.isNew){
        if(!user.passwordConfirmation){
            user.invalidate('passwordConfirmation', '비밀번호 확인 문자열을 입력해주세요.');
        }
        if(!passwordRegex.test(user.password)){
            user.invalidate('password', passwordRegexErrorMessage);
        } else if(user.password !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', '비밀번호와 확인 문자열이 일치하지 않습니다.');
        }
    }

    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword', 'Current Password is required!');
        }
        if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){ // original password와 current password가 맞는지 비교
            user.invalidate('currentPassword', 'Current Password is invalid!');
        }
        if(user.newPassword && !passwordRegex.test(user.newPassword)){ // user의 새로운 비밀번호가 있을 경우 정규식을 만족하는지 확인한다.
            user.invalidate('newPassword', passwordRegexErrorMessage);
        } else if(user.newPassword !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
    }
});


userSchema.pre('save', function (next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;


