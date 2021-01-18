var express  = require('express');
var router   = express.Router();
var Twit = require('../model/Twit');
var util = require('../util');



router.get('/', function(req,res, next){
    Twit.find(function(err,twits){
        res.json(twits);
    })
})


router.get('/list/update/:twittotal/',function(req,res,next){
    let retJson = {};
    let twitTotal = req.params.twittotal;
    if(twitTotal != Twit.count()){
        let diff = twitTotal - Twit.count();

        Twit.find({}).sort({created_at: -1}).limit(diff).exec(function(err, twits){
            if(err){
                console.error(err);
            }else{
                res.json(twits);
            }
        });
    }else{
        res.json({})
    }

})

router.get('/list/:page/:total',function(req, res, next){
    console.log("page")

    let total = Twit.count();
    let twittotal = req.params.total;

    if(total != twittotal){
        if(twittotal == null || twittotal == 0){

        }else{

        }
    }

    const options = {
        limit: 3,
        page: req.params.page != null ? req.params.page : 1,
    };

    Twit.paginate({}, options, function(err, result) {
        res.json(result);
    });
})



router.post('/write',util.isLoggedin, function(req,res, next){
    Twit.init();

    var newTwit = new Twit(req.body);

    newTwit.save(function(err,twit){
        if(err) {
            console.log("newTwit save err")
            throw err;
        }else{
            console.log("성공")
        }
        res.json(err||!twit? util.successFalse(err): util.successTrue(twit));
    });
})






module.exports = router;
