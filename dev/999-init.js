/***************************************************************************************************************************************************************
 *
 * Application initialization
 *
 * Start the game via scaffolding
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Writable = require('stream').Writable;
const Readline = require('readline');
const CliSize = require("cli-size");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// customStdout, A custom stdout so we can disable output display
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const customStdout = new Writable({
	write: function(chunk, encoding, callback) {
		BEAST.debugging.report(`Running customStdout with ${this.muted}`, 1);

		if( !this.muted ) {
			process.stdout.write( chunk, encoding );
		}

		callback();
	}
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// checkSize, Check the size of the terminal space
//
// @return  error  {string}  The error if there is any
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.checkSize = () => {
	BEAST.debugging.report(`Running checkSize`, 1);

	let error = ''; //undefined is overrated

	if( CliSize().columns < ( BEAST.MINWIDTH + 4 ) || CliSize().rows < ( BEAST.MINHEIGHT + 1 ) ) {

		if( CliSize().columns < ( BEAST.MINWIDTH + 4 ) ) {
			error = `  Your console is not wide enough for this game\n  (It is ${CliSize().columns} wide but needs to be ${( BEAST.MINWIDTH + 4 )})\n`;
		}

		if( CliSize().rows < ( BEAST.MINHEIGHT + 1 ) ) {
			error = `  Your console is not tall enough for this game\n  (It is ${CliSize().rows} tall but needs to be ${( BEAST.MINHEIGHT + 1 )})\n`;
		}
	}

	return error;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Initiate application
//
// Do your thing
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.init = () => {
	BEAST.debugging.headline(`DEBUG|INFO`, 99);

	//testing screen size and exiting on error
	let error = BEAST.checkSize();
	if( error !== '' ) {
		console.log( error );
		process.exit( 1 );
	}

	BEAST.RL = Readline.createInterface({ //create the readline interface
		input: process.stdin,
		output: customStdout,
		terminal: true,
		historySize: 0,
	});

	Readline.emitKeypressEvents( process.stdin );
	process.stdin.setEncoding('utf8');

	if(process.stdin.isTTY) {
		process.stdin.setRawMode( true );
	}


	process.on("SIGWINCH", () => { //redraw frame and board on terminal resize
		BEAST.draw.frame();
		BEAST.draw.score();
		BEAST.draw.board();
	});


	process.stdin.on("keypress", (chunk, key) => { //redraw frame and board on terminal resize
		BEAST.RL.clearLine();

		if( key.name === 'right' ) {
			BEAST.hero.move( 'x', 1 );
		}
		else if( key.name === 'left' ) {
			BEAST.hero.move( 'x', -1 );
		}
		else if( key.name === 'up' ) {
			BEAST.hero.move( 'y', -1 );
		}
		else if( key.name === 'down' ) {
			BEAST.hero.move( 'y', 1 );
		}
		else if( key.name === 'q' ) {
			process.exit(0);
		}
		else {
			return;
		}
	});


	// BEAST.RL.on("close", () => { //redraw frame and board on terminal resize
	// 	customStdout.muted = false;

	// 	Readline.cursorTo( BEAST.RL, 0, 0 ); //go to top of board
	// 	Readline.clearScreenDown( BEAST.RL ); //clear screen

	// 	console.log(`\n   Good bye\n`);

	// 	process.exit(0);
	// });


	BEAST.scaffolding.init();
	BEAST.draw.init();
	BEAST.beasts.init();
};


BEAST.init();