var jwt = require('jsonwebtoken');
var JWT_SECRET = "ew3je21321#!@;ldskfvmx@!#$!@)"
var util = {};

// success json 을 만드는 함수입니다. API가 return하는 json의 형태를 통일시키기 위해 바로 함수를 통해 json 오브젝트를 만들고 이를 return하게 됩니다.
util.successTrue = function(data){
    return {
        success:true,
        message:null,
        errors:null,
        data:data
    };
};

// API가 성공하지 못한 경우 return하는 json의 형태를 통일시키기 위해 error 오브젝트나 message를 받아서 error json을 만드는 함수 입니다.
util.successFalse = function(err, message){
    if(!err&&!message) message = 'data not found';
    return {
        success:false,
        message:message,
        errors:(err)? util.parseError(err): null,
        data:null
    };
};

// mongoose를 통해 resource를 조작하는 과정에서 발생하는 에러를 일정한 형태로 만들어 주는 함수입니다.
// resource 조작중에 에러가 mongoose 내는 에러와 mongoDB에서 내는 에러의 형태가 다르기 때문에 이 함수를 통해 에러의 형태를
// { 항목이름: { message: "에러메세지" } 로 통일시켜주는 함수입니다.
// if 에서 mongoose의 model validation error를, else if 에서 mongoDB에서 username이 중복되는 error를, else 에서 그 외 error들을 처리합니다.
util.parseError = function(errors){ //3
    var parsed = {};
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    } else if(errors.code == '11000' && errors.errmsg.indexOf('email') > 0) {
        parsed.username = { message:'email이 이미 존재합니다. 다른 메일로 가입해주세요.' };
    } else {
        parsed.unhandled = errors;
    }
    return parsed;
};


// middlewares
util.isLoggedin = function(req,res,next){ //4
    var token = req.headers['x-access-token'];
    if (!token) return res.json(util.successFalse(null,'로그인 후 트윗 작성이 가능합니다.'));
    else {
        jwt.verify(token, JWT_SECRET, function(err, decoded) {
            if(err) return res.json(util.successFalse(err));
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
};

module.exports = util;
