var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Hangman',
  						image: '/images/hangState/Hangman-0.png',
  						word: '<div class="wordbox"><h3 class="letter"></h3><hr class = "line"></div>' });
});

module.exports = router;
