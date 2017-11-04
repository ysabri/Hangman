var express = require('express');
var router = express.Router();
var rand = require('random-js')();
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var Regex = require('regex');
var regex = new Regex('[A-Za-z]');
file = './words';
var db = new sqlite3.Database(file);

//words to pick from in case database takes too long to get back with a word.
//This means, in the worse case, the probability of a number being picked twice
//(I think) is 1 - (19/20)^n, n being how many times the user picks during the worse
//case. This is usally not high, but its a proof of concept.
var inCase = ['Earthbred', 'Upclimb', 'Euphonized', 'Cholelith', 'Retributive',
	'Secreta', 'Utterable', 'Angulates', 'Skunkdom', 'Marooning',
	'Releaser', 'Hymenophore', 'Disgorges', 'Podophyllous', 'Emporial',
	'Shemaal', 'Inquisitors', 'Riflebird', 'Surfusion', 'Parilicium'
];
//setup debug flag
dbg = true;
if (process.env.NODE_ENV == 'production')
	dbg = false;

/*Query DB for word using the rand num*/
function queryWord(oldword, callback) {

	if (dbg) {
		callback('testword');
		return;
	}

	var num = rand.integer(0, 365713);

	//let wordPromise = new Promise(function (fulfill, reject) {
	/*query db for a word given a random id */
	//db.serialize(function() {
	db.get("SELECT word as word FROM Words WHERE id=" + num,
		function(err, row) {
			if (err) {
				dbg && console.log(err);
				//	reject(err);
			} else {
				//	fulfill(row.word);
				try {
					if (row != undefined) {
						callback(row.word);
					} else {
						callback(oldWord);
					}
				} catch (e) {
					console.log('in case happened');
					i = rand.integer(0, 19);
					callback(inCase[i]);
				}
			}
		});
	//});
	//});

	//wordPromise.then(function(word) {
	//	callback(word);
	//});

	dbg && console.log(num);

}

/*create initial html*/
function initHtml(word, misses, callback) {

	for (var i = 0; i < word.length; i++) {
		if (i == 0) {
			result = '<div class="wordbox">\n\t<h3 class="letter">' + '</h3>\n\t<hr class = "line">\n</div>\n';
		} else {
			result += '<div class="wordbox">\n\t<h3 class="letter">' + '</h3>\n\t<hr class = "line">\n</div>\n';
		}
	}

	callback(result, misses);

}

/*create word html*/
function createHtml(word, guessed, misses, status, oldWord, callback) {
	//vars for the guesses and the missed letters
	var result = '',
		misresult = '',
		gameStat = '',
		displayWord = '';

	/*compare the guesses array with the guessed letters,
	 * write it out if it is there, otherwise write spaces*/
	for (var i = 0; i < word.length; i++) {
		var rend = '';
		if (guessed[i] != undefined) {
			if (word.charAt(i).toUpperCase() == guessed[i].toUpperCase());
			rend = guessed[i].toUpperCase();
		}
		result += '<div class="wordbox">\n\t<h3 class="letter">' + rend + '</h3>\n\t<hr class = "line">\n</div>\n';
	}
	//create the misses html
	for (var i = 0; i < misses.length; i++) {
		if (i == misses.length - 1) {
			misresult += '<div class="wordbox">\n\t<h3 class="letter">' + misses[i].toUpperCase() + '</h3>\n</div>\n';
		} else {
			misresult += '<div class="wordbox">\n\t<h3 class="letter">' + misses[i].toUpperCase() + ',</h3>\n</div>\n';
		}
	}
	//create lost or won html
	var wid = '20px',
		worl;
	//player won
	if (status == 1) {
		wid = '270px';
		worl = 'Congrats! The word was: ';
		displayWord = '<h4 class="label" style="width: 45px;">' +
			oldWord.charAt(0).toUpperCase() + oldWord.slice(1);
		gameStat = '<h4 class="label" style="width:' + wid + ';">' + worl + '</h4>';
	} //player lost
	else if (status == -1) {
		wid = '160px';
		worl = 'The word was: ';
		displayWord = '<h4 class="label" style="width: 45px;">' +
			oldWord.charAt(0).toUpperCase() + oldWord.slice(1) + '</h4>';
		gameStat = '<h4 class="label" style="width:' + wid + ';">' + worl + '</h4>';
	}

	callback(result, misresult, gameStat, displayWord);
}

/*Render all the html elements*/
function renderHtml(req, res, callback) {

	//render html using session vars
	createHtml(req.session.word, req.session.guessed, req.session.misses,
		req.session.gameStatus, req.session.oldWord,
		function(wordHtml, missesHtml, gameStatHtml, displayWord) {
			res.render('index', {
				title: 'Hangman',
				image: '/images/hangState/Hangman-' +
					req.session.guesses + '.png',
				word: wordHtml,
				misses: missesHtml,
				wins: req.session.wins,
				loses: req.session.loses,
				gameStatus: gameStatHtml,
				notGuessed: displayWord
			});
		});

	if (dbg) {
		console.log(req.session.guesses + ' guesses');
		console.log(req.session.misses + ' misses');
		console.log(req.session.guessed + ' guessed');
		console.log(req.session.wins + ' wins');
		console.log(req.session.loses + ' loses');
		console.log(req.session.gameStatus + ' gameStatus');
	}

	callback();
}

/* GET home page. */
router.get('/', function(req, res, next) {

	//user came back
	if (req.session.seen) {
		dbg && console.log('Welcome back ' + req.session.word);
		renderHtml(req, res, function() {});
		return;
	}

	//new user here..
	dbg && console.log('first time');

	/*initialize session variables*/
	req.session.seen = true;
	//number of wrong guesses
	req.session.guesses = 0;
	//missed letters
	req.session.misses = [''];
	//guessed correct letters
	req.session.guessed = [''];
	//number of wins
	req.session.wins = 0;
	//number of loses
	req.session.loses = 0;
	//lost = -1, won = 1, playing = 0, reseting = 2
	req.session.gameStatus = 0;
	//old word
	req.session.oldWord = '';

	/*get the word and initialize the session word*/
	queryWord(req.session.word, function(result) {
		req.session.word = result;
		dbg && console.log(result);
		renderHtml(req, res, function() {

		});
	});

});

/*Picks a new word for the user*/
router.get('/reset', function(req, res, next) {
	//new user, redirect to initialize them
	if (req.session.seen === undefined) {
		dbg && console.log('redirecting...');
		res.redirect('/');
		return;
	}
	//made a guess, or just reseting normally
	if (req.session.guesses > 0 || req.session.gameStatus == 0 ||
		req.session.gameStatus == -1) {
		dbg && console.log('in the loser is losing a point');
		req.session.oldWord = req.session.word;
		req.session.loses++;
	}
	//reset the the session word vars
	req.session.gameStatus = -1;
	req.session.guesses = 0;
	req.session.guessed = [''];
	req.session.misses = [''];
	//get new word
	queryWord(req.session.word, function(result) {
		req.session.word = result;
		dbg && console.log(result);
		renderHtml(req, res, function() {

		});
	});

});
/* Decide what to do with the guess and update variabl esessions based on it */
function guessChecker(body, req, callback) {

	var letter = body.toUpperCase();
	var guess = false;
	if (req.session.guesses == 9 && req.session.gameStatus == -1) {
		req.session.guesses = 0;
	}
	//guessed true a letter that has not been guessed before
	if (req.session.guessed.indexOf(letter) < 0 &&
		req.session.word.indexOf(letter.toLowerCase()) > -1) {
		//add all occurrences of letter into guessed array
		for (var j = 0; j < req.session.word.length; j++) {
			if (req.session.word.charAt(j) == letter.toLowerCase()) {
				req.session.guessed[j] = letter;
			}
		}
		req.session.gameStatus = 0;
		//player won
		if (req.session.guessed.join("").toLowerCase() == req.session.word) {
			dbg && console.log('won');
			guess = true;
			req.session.wins++;
			req.session.gameStatus = 1;
			req.session.oldWord = req.session.word;
			req.session.guesses = 0;
			req.session.guessed = [''];
			req.session.misses = [''];
		}
		callback(guess);
		return;
	}
	//player lost
	if (req.session.guesses == 9) {
		guess = true;
		req.session.loses++;
		req.session.gameStatus = -1;
		req.session.oldWord = req.session.word;
		req.session.guesses = 9;
		req.session.guessed = [''];
		req.session.misses = [''];
		// has not been in the misses and guesses
	} else if (req.session.misses.indexOf(letter) < 0 && req.session.guessed.indexOf(letter) < 0) {
		req.session.gameStatus = 0;
		req.session.guesses++;
		req.session.misses += letter;
	}

	callback(guess);
}

/*recieve a guess*/
router.post('/', function(req, res, next) {

	//new user, redirect to init session
	if (req.session.seen === undefined) {
		dbg && console.log('redirecting...');
		res.redirect('/');
		return;
	}

	//check for invalid guess values
	if (regex.test(req.body.guess) || req.body.guess.length != 1) {
		dbg && console.log("&&&&&&&&&&");
		res.sendStatus(400);
	}
	//decide what to do with guess and send response
	guessChecker(req.body.guess, req, function(guess) {
		if (guess) {
			queryWord(req.session.word, function(result) {
				req.session.word = result;
				dbg && console.log(result);
				renderHtml(req, res, function() {

				});
			});
		} else {
			renderHtml(req, res, function() {

			});
		}
	});

	dbg && console.log(req.body.guess);

});


module.exports = router;