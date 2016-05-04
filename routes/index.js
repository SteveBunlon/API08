var express = require('express'),
	router = express.Router(),
	path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../app/index.html'));
});

module.exports = router;
