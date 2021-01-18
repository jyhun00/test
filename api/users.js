var express  = require('express');
var router   = express.Router();
var User     = require('../model/User');
var util     = require('../util');

// index
router.get('/', function(req,res,next){
    User.find({})
        .sort({name:1})
        .exec(function(err,users){
            res.json(err||!users? util.successFalse(err): util.successTrue(users));
        });
});

// create
router.post('/register', function(req,res,next){
    User.init()

    User.findOne({email: req.body.email}, function(err, result){
        if(err){
            res.send(err);
        }else{
            if(result != null){
                res.json("이미 존재하는 사용자 정보입니다. 로그인을 시도해주세요.");
            }else{
                var newUser = new User(req.body);

                newUser.save(function(err,user){
                    if(err) {
                        console.log("newUser save err")
                        throw err;
                    }else{
                        console.log("성공")
                    }
                    res.json(err||!user? util.successFalse(err): util.successTrue(user));
                });
            }
        }
    })


});

function checkPermission(req,res,next){
    User.findOne({username:req.params.username}, function(err,user){
        if(err||!user) return res.json(util.successFalse(err));
        else if(!req.decoded || user._id != req.decoded._id)
            return res.json(util.successFalse(null,'You don\'t have permission'));
        else next();
    });
}

module.exports = router;