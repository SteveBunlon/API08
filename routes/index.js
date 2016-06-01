var express = require('express'),
	router = express.Router(),
    multer = require('multer'),
	path = require('path'),
    user = require('../models/users.js'),
    jwt =  require('jsonwebtoken'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    annal = require('../models/annals.js'),
    product = require('../models/products.js');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

var upload = multer({
    storage: storage
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/../application/index.jade'), {
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

router.post('/api/product', function(req, res, next){
    var productName = req.body.name || null,
        productPrice = req.body.price || null,
        productOnSale = req.body.onSale;
    if (!productName || !productPrice) {
        res.status(401).send("Le nom du produit est obligatoire");
    }
    product.findOne({ name: productName }, function (err, doc){
        if(err) {
            res.sendStatus(500);
        }
        else {
            doc.price = productPrice;
            doc.onSale = productOnSale;
            doc.save();
            res.sendStatus(200);
        }
    });
})
router.post('/api/products/new', upload.single('file'),function(req, res, next){
    console.log("passing");
    var productName = req.body.name || null,
        productCategory = req.body.category || null,
        productPrice = req.body.price || null,
        productOnSale = req.body.onSale,
        productFile = req.file;

    console.log(productFile);
    if(!productName || !productCategory || !productPrice){
        res.status(400).send("Des informations obligatoires manquent");
    }
    product.findOne({name: productName }, function(err, doc){
        if(err) {
            res.status(500).send("Une erreur est survenue");
        } else {
            if(doc) {
                res.status(500).send("Le nom est déjà utilisé");
            } else {
                var newProduct = new product({ name: productName,
                    category: productCategory,
                    price: productPrice,
                    onSale: productOnSale,
                    img: productFile.path
                });
                newProduct.save();
                res.sendStatus(200);
            }
        }
    })

})

router.get('/cas', function(req, res, next) {
    console.log("WAAAAAAAAAAAAAAAAAAAAAAAAAAARNIIIIIIIIIIIIIIIIIIIIIIN");
    request("https://cas.utc.fr/cas/serviceValidate?service=http://51.255.169.85:3001/cas&ticket="+req.query.ticket, function(error, response, body){
        if(error)
            res.status(500).send("Request to UTC pb");
        //Parse the user received
        parseString(body, function (err, result) {
            if(err)
                res.status(500).send("Error while parsing xml");
            var usernameFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:user"][0],
                toDisplayFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:attributes"][0]["cas:cn"][0],
                mailFromXml = result["cas:serviceResponse"]["cas:authenticationSuccess"][0]["cas:attributes"][0]["cas:mail"][0];
            console.log(usernameFromXml, toDisplayFromXml);
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
            console.log("rendering");
            res.render(path.join(__dirname + '/../application/index.jade'), {
                username: usernameFromXml,
                toDisplay: toDisplayFromXml}
            );
        });
    });
});

router.post('/api/users', function(req, res, next){
    user.find({}, function(err, docs){
        if(err)
            res.sendStatus(500);
        else
            res.json(JSON.stringify(docs));
    })
})

router.post('/api/users/new', function(req, res, next){
    var mail = req.body.mail || null,
        lastName = req.body.lastName || null,
        firstName = req.body.firstName || null,
        password = req.body.password || null,
        accountType = req.body.accountType || null;

    if(!mail || !lastName || !firstName || !password || !accountType)
        res.sendStatus(403);
    else{
        var newUser = new user({mail:mail, lastname:lastName, firstname:firstName, password:password, accountType:accountType});
        newUser.save(function(err){
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            else
                res.sendStatus(200);
        })
    }
})

router.post('/api/caslogin', function(req, res, next){
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
            return res.status(401).send("Error while looking for a user in base");
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
                res.status(401).send("No user for the username specified");
            }
        }
    })
})

router.post('/api/login', function(req, res, next) {
    var mail = req.body.mail || '',
        password = req.body.password || '';

    if (mail == '' || password == '') {
        return res.status(401).send("Missing parameters");
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

router.post('/api/annals/add',upload.single('file'), function (req, res, next) {
    var pages = req.body.pages || null,
        name = req.body.name || null,
        type = req.body.type || null,
        saison = req.body.saison || null,
        date = req.body.date || null,
        file = req.file;
    if(!pages || !name || !type || !saison || !date || !file){
        res.sendStatus(500);
    }
    else{
        var newAnnal = new annal({name:name, saison:saison, type:type, nbPage:pages, link:file.path,date:date});
        newAnnal.save(function(err){
            if(err){
                console.log(err);
                return;
            }
            else
                return res.sendStatus(200);
        })
    }
})

router.post('/api/annals', function(req, res, next){
    annal.find({}, function(err, annals){
        if(err)
            res.sendStatus(500);
        else
            res.json(JSON.stringify(annals));
    })
})

router.post('/api/createCommand', function(req, res, next){
    var mail = req.body.mail,
        commands = JSON.parse(req.body.commands);

    if(!mail || !commands)
        res.sendStatus(500);
    else{
        console.log("gotcha");
        user.findOne({mail:mail}, function(err, nUser){
            if(err)
                res.sendStatus(500)
            else{
                console.log(commands);
                nUser.commands.push({date:new Date(),type:"annales",p:commands});
                console.log("chien");
                nUser.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                    else
                        res.sendStatus(200);
                });
            }
        })
    }
})

router.post("/api/userCommands", function(req, res, next){
    var mail = req.body.user || null;
    console.log(mail);
    if(!mail)
        res.sendStatus(401);
    else{
        user.findOne({mail:mail}, function(err, fuser){
            if(err){
                res.sendStatus(500);
                console.log(err)
            }
            else
                res.json(fuser.commands);
        })
    }
})

router.get('/about', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/annals', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/annals/list', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/annals/order', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/annals/upload', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/commands', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/contact', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/team', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/home', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/products', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/service', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

router.get('/users', function(req, res, next) {
    console.log("passing there");
    res.render(path.join(__dirname + '/../application/index.jade'), {
        username : "test",
        toDisplay : "",
    });
});

module.exports = router;
