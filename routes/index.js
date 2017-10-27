var express = require('express');
var router = express.Router();
var rand = require('random-js')();
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var Regex = require('regex');
var regex = new Regex('[A-Za-z]');
file = './words';
var db = new sqlite3.Database(file);

/*Query DB for word using the rand num*/
function queryWord(callback) {

	var num  = rand.integer(0,365713);

	//let wordPromise = new Promise(function (fulfill, reject) {
	/*query db for a word given a random id */
		db.serialize(function() {
			db.get("SELECT word as word FROM Words WHERE id=" + num, 
				function (err, row) {
					if(err){
						console.log(err);
					//	reject(err);
					} else {
					//	fulfill(row.word);
					if(row!=undefined){
						callback(row.word);
					}
					else{
						callback(req.session.word);
					}

				}
			});
		});
	//});

	//wordPromise.then(function(word) {
	//	callback(word);
	//});

	console.log(num);
	
}

/*create initial html*/
function initHtml(word, misses, callback) {

		for (var i = 0; i < word.length; i++){
			if(i==0) {
				result = '<div class="wordbox">\n\t<h3 class="letter">' 
					+ '</h3>\n\t<hr class = "line">\n</div>\n';
			} else {
				result += '<div class="wordbox">\n\t<h3 class="letter">'
					+ '</h3>\n\t<hr class = "line">\n</div>\n';
			}
		}

		callback(result, misses);

}

/*create word html*/
function createHtml(word, guessed, misses ,callback) {
		//vars for the guesses and the missed letters
		var result = '', misresult='';
		/*compare the guesses array with the guessed letters,
		* write it out if it is there, otherwise write spaces*/
		for (var i = 0; i < word.length; i++){
			var rend = '';
			if(guessed[i] != undefined){
				if(word.charAt(i).toUpperCase() == guessed[i].toUpperCase());
				rend = guessed[i].toUpperCase();
			}
			result += '<div class="wordbox">\n\t<h3 class="letter">' + rend
				+ '</h3>\n\t<hr class = "line">\n</div>\n';
		}
		//create the misses html
		for(var i = 0; i < misses.length; i++){
			if(i==misses.length-1){
				misresult += '<div class="wordbox">\n\t<h3 class="letter">' 
					+ misses[i].toUpperCase()
					+ '</h3>\n</div>\n';
			} else {
				misresult += '<div class="wordbox">\n\t<h3 class="letter">' 
					+ misses[i].toUpperCase()
					+ ',</h3>\n</div>\n';
			}
		}
		callback(result, misresult);
}

/*Render all the html elements*/
function renderHtml(req, res, callback){

	//render html using session vars
	createHtml(req.session.word, req.session.guessed, req.session.misses, 
			function(wordHtml, missesHtml) {
		res.render('index', { title: 'Hangman',
  			image: '/images/hangState/Hangman-' + 
  				req.session.guesses + '.png',
  			word: wordHtml,
  			misses: missesHtml,
  			wins: req.session.wins,
  			loses: req.session.loses });
	});

	callback();
}

/* GET home page. */
router.get('/', function(req, res, next) {

	//user came back
	if(req.session.seen){
		console.log('Welcome back ' + req.session.word);
		renderHtml(req, res, function() {});
		return;
	}

	//new user here..
	console.log('first time');

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

	/*get the word and initialize the session word*/
	queryWord(function(result) {
		req.session.word = result;
		console.log(result);
		renderHtml(req, res, function() {

		});
	});	

});

/*Picks a new word for the user*/
router.get('/reset', function(req, res, next){
	//new user, redirect to initialize them
	if(req.session.seen === undefined){
    	console.log('redirecting...');
    	res.redirect('/');
    	return;
  	} 
  	//reset the the session word vars
  	req.session.guesses = 0;
  	req.session.guessed = [''];
  	req.session.misses = [''];
  	//get new word
  	queryWord(function(result) {
		req.session.word = result;
		console.log(result);
		renderHtml(req, res, function() {

		});
	});

});
/* Decide what to do with the guess and update variable sessions based on it */
function guessChecker(body, req, callback) {

	var letter = body.toUpperCase();
	var guess = false;
	
	//guessed true a letter that has not been guessed before
	if(req.session.guessed.indexOf(letter)<0 && 
		req.session.word.indexOf(letter.toLowerCase()) > -1){
		//add all occurrences of letter into guessed array
		for(var j=0; j<req.session.word.length; j++){
			if(req.session.word.charAt(j)==letter.toLowerCase()){
				req.session.guessed[j]=letter;
			}
		}
		//player won
		if(req.session.guessed.join("").toLowerCase()
			==req.session.word){
			//console.log('won');
			guess=true;
			req.session.wins++;
			req.session.guesses = 0;
			req.session.guessed = [''];
			req.session.misses = [''];
		}
		callback(guess);
		return; 
	}

	//player lost
	if(req.session.guesses==9){
		guess = true;
		req.session.loses++;
		req.session.guesses = 0;
		req.session.guessed = [''];
		req.session.misses = [''];
	// has not been in the misses and guesses
	} else if(req.session.misses.indexOf(letter)<0
		&& req.session.guessed.indexOf(letter)<0) {
		//console.log('why am I here');
		req.session.guesses++;
		req.session.misses += letter;
	}
/*	
	console.log(req.session.guesses + ' guesses');
	console.log(req.session.misses + ' misses');
	console.log(req.session.guessed + ' guessed');
	console.log(req.session.wins + ' wins');
	console.log(req.session.loses + ' loses');
*/
	callback(guess);
}

/*recieve a guess*/
router.post('/', function(req, res, next) {

	//new user, redirect to init session
	if(req.session.seen === undefined){
    	console.log('redirecting...');
    	res.redirect('/');
    	return;
  	} 

  	//check for invalid guess values
  	if(regex.test(req.body.guess) || req.body.guess.length!=1){
  		console.log("&&&&&&&&&&");
  		res.sendStatus(400);
  	}
  	//decide what to do with guess and send response
  	guessChecker(req.body.guess,req, function(guess){
  		if(guess){
  			queryWord(function(result) {
				req.session.word = result;
				console.log(result);
				renderHtml(req, res, function() {

				});
			});
  		} else {
  			renderHtml(req, res, function() {

			});
  		}
  	});

	console.log(req.body.guess);

});


module.exports = router;
