// api/auth.js

var express  = require('express');
var router   = express.Router();
var User     = require('../model/User');
var util     = require('../util');
var jwt      = require('jsonwebtoken');

var JWT_SECRET = "ew3je21321#!@;ldskfvmx@!#$!@)"

// login
router.post('/login',
    function(req,res,next){

        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.email){
            isValid = false;
            validationError.errors.email = {message:'이메일을 입력해주세요'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'비밀번호를 입력해주세요'};
        }

        if(!isValid) return res.json(util.successFalse(validationError));
        else next();
    },
    function(req,res,next){
        User.findOne({email:req.body.email})
            .select({password:1,name:1,email:1})
            .exec(function(err,user){
                if(err) return res.json(util.successFalse(err));
                else if(!user||!user.authenticate(req.body.password))
                    return res.json(util.successFalse(null,'이메일이나 비밀번호가 일치하지 않습니다. 다시 입력해주세요.'));
                else {
                    var payload = {
                        _id : user._id,
                        email: user.email
                    };

                    var secretOrPrivateKey = JWT_SECRET;
                    var options = {expiresIn: 60*60*24};

                    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
                        if(err) return res.json(util.successFalse(err));
                        res.json(util.successTrue(token));
                    });
                }
            });
    }
);





module.exports = router;
