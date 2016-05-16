var express = require('express'),
	router = express.Router(),
	path = require('path'),
    user = require('../models/users.js'),
    jwt =  require('jsonwebtoken'),
    request = require('request'),
    parseString = require('xml2js').parseString;


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../app/index.html'));
});



router.get('/cas', function(req, res, next) {
    console.log(req.query.ticket);
    request("https://cas.utc.fr/cas/serviceValidate?service=http://51.255.169.85:3001/cas&ticket="+req.query.ticket, function(error, response, body){
        console.log(body);
        parseString(body, function (err, result) {
            console.log("hello");
            console.log(result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:user"]);
            console.log(result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:attributes"][0]["cas:cn"]);
        });
        res.status(200).send();
    });
    //https://assos.utc.fr/ginger/v1/bunlonst?key=yE27aq9cV2Xdm79j85eNCEg3TJaEBZ8v
    //res.sendFile(path.join(__dirname + '/../app/index.html'));
});


router.post('/api/login', function(req, res, next) {
    var mail = req.body.mail || '',
        password = req.body.password || '';
    console.log(mail, password);
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
                console.log("no users found");
                res.sendStatus(401);
            }
        }
    })
});

module.exports = router;
