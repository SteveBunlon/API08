var express = require('express'),
	router = express.Router(),
	path = require('path'),
    user = require('../models/users.js'),
    jwt =  require('jsonwebtoken'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    product = require('../models/products.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../app/index.jade'), {
      username : "test",
      toDisplay : "",
    });
});
router.post('/api/products', function(req, res, next){
    product.find({}, function(err, data){
        if(err)
            res.status(500).send();
        else
            res.json(JSON.stringify(data));
    })
})





router.get('/cas', function(req, res, next) {
    console.log(req.query.ticket);
    request("https://cas.utc.fr/cas/serviceValidate?service=http://51.255.169.85:3001/cas&ticket="+req.query.ticket, function(error, response, body){
        console.log(body);
        if(error)
            res.status(500).send("Request to UTC pb");
        //Parse the user received
        parseString(body, function (err, result) {
            if(err)
                res.status(500).send("Error while parsing xml");
            var usernameFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:user"][0],
                toDisplayFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:attributes"][0]["cas:cn"][0],
                mailFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:attributes"][0]["cas:mail"][0];
            console.log(usernameFromXml);
            //looking if the user exists
            user.find({casUsername:usernameFromXml}, function(err, data){
                if(err)
                    res.status(500).send("Err while looking for cas user in base");
                else
                //if it doesn't exist we create it
                if(data == undefined || data == "" || data == null){
                    var lastName = toDisplayFromXml.split(" ")[1],
                        firstName = toDisplayFromXml.split(" ")[0];
                    var newUser = new user({casUsername:usernameFromXml,mail:mailFromXml, lastname:lastName, firstname:firstName, from:"cas"});
                    newUser.save(function(err){
                        if(err){
                            console.log(err);
                            res.status(500).send("error while saving the new cas user");
                        }
                        else
                            console.log("user created successfuly");
                    })
                }
            })
            //sending the info saying that we need to connect a CAS user
            res.render(path.join(__dirname + '/../app/index.jade'), {
                usernameFromXml: usernameFromXml,
                toDisplayFromXml: toDisplayFromXml}
            );
        });
    });
});

router.post('api/casLogin', function(req, res, next){
    var mail = req.body.username || '';

    if (mail == '') {
        return res.status(401).send("No username provided");
    }
    user.findOne({
        casUsername: mail,
        from: "cas"
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        } else {
            if(user){
                var token = jwt.sign(user, "vnqfdmvqfnvqmernvmeqnvmqrehqùebnqZ43565TGV2R24GVFVDdsvQ%vmdsfbqf", {
                    expiresIn:    3600// seconds, 600 minutes, 1heures.
                });
                return res.json({
                    token: token,
                    user: JSON.stringify(user)
                });
            }else{
                console.log("no users found");
                res.sendStatus(401);
            }
        }
    })
})

router.post('/api/login', function(req, res, next) {
    var mail = req.body.mail || '',
        password = req.body.password || '';

    if (mail == '' || password == '') {
        return res.sendStatus(401);
    }
    user.findOne({
        mail: mail,
        from: "ext"
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        } else {
            if(user){
                if(user.password.localeCompare(password) == 0) {
                    var token = jwt.sign(user, "vnqfdmvqfnvqmernvmeqnvmqrehqùebnqZ43565TGV2R24GVFVDdsvQ%vmdsfbqf", {
                        expiresIn:    3600//seconds, 600 minutes, 10heures.
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
