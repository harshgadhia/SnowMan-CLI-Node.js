var path = require('path');
var fs = require("fs");
var inquirer = require('inquirer');
var filepath = path.join(__dirname, 'words.txt');
var snowmanImgPath = path.join(__dirname, 'snowman_image.txt');
var instructionsFile = path.join(__dirname, 'instructions.txt');

module.exports.run = function() {
	var snowman = new Snowman();
	snowman.printGameInstructions();
}

module.exports.gameHelp = function() {
	var self = this;
	fs.readFile(instructionsFile, {encoding:'utf8'}, function (err, data) {
		var lines = data.split('\r\n');
		console.log('');
		
		for (var i = 0; i < lines.length; i++) {
			console.log(lines[i]);
		};
		console.log('');
	});
}

function Snowman() {
	this.allowed_tries = 5;
}

Snowman.prototype.init = function() {
	this.total_tries = 0;
	this.wrong_tries = 0;
	this.gameWord = '';
	this.displayBlankWord = '';
	this.startGame();
}

Snowman.prototype.startGame = function() {
	this.fetchRandomWord();
}

Snowman.prototype.printGameInstructions = function() {
	var self = this;
	fs.readFile(instructionsFile, {encoding:'utf8'}, function (err, data) {
		var lines = data.split('\r\n');
		console.log('');
		
		for (var i = 0; i < lines.length; i++) {
			console.log(lines[i]);
		};
		console.log('');
		self.init();
	});
}

Snowman.prototype.fetchRandomWord = function() {
	var self = this;
	fs.readFile(filepath, {encoding:'utf8'}, function (err, data) {
		var words = data.split('\r\n');
		self.gameWord = words[Math.floor(Math.random() * words.length)];
		for(var i=0; i<self.gameWord.length; i++)
			self.displayBlankWord+='-';
		
		console.log('Can you guess this ' + self.gameWord.length + ' letter word?');
		self.printWord();
	});
}

Snowman.prototype.printWord = function() {
	console.log('');
	for(var i=0; i<this.displayBlankWord.length; i++) {
		process.stdout.write(this.displayBlankWord[i] + " ");
	}
	console.log('');
	console.log('');
	this.promptUserInput();
}

Snowman.prototype.promptUserInput = function() {

	var self = this;
	inquirer.prompt([{
		type: "input",
		name: "answer",
		message: "Please enter a letter?"
	}], function( input ) {
	    self.processInput( input.answer );
	});
	this.total_tries++;
}

Snowman.prototype.processInput = function(input) {

	var charExistsInWord = false;
	for (var i = 0; i < this.gameWord.length; i++) {
		if(this.gameWord[i].toUpperCase() === input.toUpperCase()) {
			this.displayBlankWord = this.displayBlankWord.replaceAt(i, input);
			charExistsInWord=true;
		}
	};
	if(charExistsInWord!=true) {
		this.incorrectWord();
	}
	else if( this.gameWord.toUpperCase() == this.displayBlankWord.toUpperCase() ) {
		this.winGame();
	}
	else {
		this.printWord();
	}
}

Snowman.prototype.incorrectWord = function() {
	this.wrong_tries++;
	if(this.allowed_tries == this.wrong_tries) {
		this.lostGame();
	}
	else {
		console.log("Wrong guess! " + (this.allowed_tries - this.wrong_tries) + " tries are left.");
		this.printWord();
	}
	this.printSnowmanImg();
}

Snowman.prototype.winGame = function() {
	console.log('');
	console.log('Correct word : ' + this.displayBlankWord);
	console.log("You win!");
	console.log('');
	console.log('Total guesses made ' + this.total_tries);
	console.log('');
	this.playAgain();
}

Snowman.prototype.lostGame = function() {
	console.log('');
	console.log("You Lost! The correct answer is " + this.gameWord);
	console.log('');
	this.playAgain();
}

Snowman.prototype.printSnowmanImg = function() {
	var self = this;
	fs.readFile(snowmanImgPath, {encoding:'utf8'}, function (err, data) {
		var snowManLines = data.split("\r\n");
		console.log('');
		for (var i = 0; i < self.wrong_tries; i++) {
			console.log('\t\t\t\t' + snowManLines[i]);
		};
	});
}

Snowman.prototype.playAgain = function() {
	var self = this;
	inquirer.prompt([{
		type: "confirm",
		name: "answer",
		message: "Play Again?"
	}], function( input ) {
	    if(input.answer == true) {
	    	self.init();
	    }
	    else {
	    	console.log('');
	    	console.log("Thanks for playing! Good Bye!");
	    }
	});
}

String.prototype.replaceAt = function(index, char) {
	return this.substr(0,index) + char + this.substr(index + char.length);
}