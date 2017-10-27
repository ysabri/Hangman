var express = require('express');
var router = express.Router();
var rand = require('random-js')();
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
file = './words';
var db = new sqlite3.Database(file);

function createWord(num, callback) {
		//var word;
		db.serialize(function() {
		db.get("SELECT word as word FROM Words WHERE id=" + num, 
			function (err, row) {
				if(err){
					console.log(err);
				} else {
					//console.log(row.word);
					callback(row.word);
					//this.word = row.word;
				}
			});
	});
	
}

function initHtml(word, callback) {
		for (var i = 0; i < word.length; i++){
			if(i==0) {
				result = '<div class="wordbox">\n\t<h3 class="letter">' 
				+ '</h3>\n\t<hr class = "line">\n</div>\n';
			} else {
				result += '<div class="wordbox">\n\t<h3 class="letter">'
				+ '</h3>\n\t<hr class = "line">\n</div>\n';
			}
		}
		//console.log(result);
		callback(result);
}

function createHtml(word,callback) {
		var result;
		for (var i = 0; i < word.length; i++){
			if(i==0) {
				result = '<div class="wordbox">\n\t<h3 class="letter">' 
				+ word.toUpperCase().charAt(i)
				+ '</h3>\n\t<hr class = "line">\n</div>\n';
			} else {
				result += '<div class="wordbox">\n\t<h3 class="letter">' + word.toUpperCase().charAt(i)
				+ '</h3>\n\t<hr class = "line">\n</div>\n';
			}
		}
		//console.log(result);
		callback(result);
}
/* GET home page. */
router.get('/', function(req, res, next) {
	var num  = rand.integer(0,370100);
	var word;
	createWord(num, function(result) {
		console.log(result);
		var wordRend;
		initHtml(result, function(html) {
			res.render('index', { title: 'Hangman',
  				image: '/images/hangState/Hangman-0.png',
  				word: html,
  				misses: '' });
		})


	});
	console.log(num);
	

});

module.exports = router;
