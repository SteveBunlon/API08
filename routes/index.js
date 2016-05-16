var express = require('express'),
	router = express.Router(),
	path = require('path'),
    user = require('../models/users.js'),
    product = require('../models/products.js'),
    jwt =  require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
    product.find({}, function(err,products){
        console.log(products[0]);
    });
  res.sendFile(path.join(__dirname + '/../app/index.html'));
});

router.post('/api/products', function(req, res, next){
    product.find({}, function(err, data){
        if(err)
            res.status(500).send();
        else
            res.json(JSON.stringify(data));
    })
})

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
