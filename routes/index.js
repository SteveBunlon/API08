var express = require('express'),
	router = express.Router(),
	path = require('path'),
    user = require('../models/users.js'),
    jwt =  require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../app/index.html'));
});

router.post('/api/login', function(req, res, next) {
    var mail = req.body.mail || '',
        password = req.body.password || '';

    if (mail == '' || password == '') {
        return res.sendStatus(401);
    }
    user.findOne({
        mail: mail
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        } else {
            if(user){
                if(user.password.localeCompare(password) == 0) {
                    var token = jwt.sign(user, "vnqfdmvqfnvqmernvmeqnvmqrehqùebnqZ43565TGV2R24GVFVDdsvQ%vmdsfbqf", {
                        //expiresIn:    //36000 seconds, 600 minutes, 10heures.
                    });
                    user.password = "";
                    return res.json({
                        token: token,
                        user: JSON.stringify(user)
                    });
                }
                else
                    return res.sendStatus(401);
            }else{
                res.sendStatus(401);
            }
        }
    })
});

module.exports = router;
