module.exports = function(app){

    var router = require('express').Router();

    router.post('/contact', function (req, res, next) {
        var text = req.body.text || null,
            mail = req.body.mail || null,
            subject = req.body.subject || null;

        if(!text || !mail || !subject)
            res.status(400).send("missing parameters");
        else
            app.mailer.send('contact', {
                to: 'bunlon.steve@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
                mail: mail,
                text: text,
                subject: subject
            }, function (err) {
                if (err) {
                    // handle error
                    console.log(err);
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send('Email Sent');
            });
    });

    return router;
}