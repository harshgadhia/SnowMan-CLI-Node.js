var yargs = require("yargs");
var snowman = require("./snowman.js");

var flags = yargs.usage('Usage node cli --run ')
			.options('h',{
				alias:'help',
				describe: 'Display help.'
			})
			.options('r',{
				alias:'run',
				describe: 'Run the Game'
			})
			.argv;

if(flags.help) {
	yargs.showHelp();
}
if(flags.run) {
	snowman.run();
}