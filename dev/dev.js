/***************************************************************************************************************************************************************
 *
 * Beast, and ANSI node game
 *
 * Beast is a node adaptation from the original written by Dan Baker, Alan Brown, Mark Hamilton and Derrick Shadel in 1984
 * https://en.wikipedia.org/wiki/Beast_(video_game)
 *
 * @license     https://github.com/dominikwilkowski/beast.js/blob/master/LICENSE  GNU-GPLv3
 * @author      Dominik Wilkowski  hi@dominik-wilkowski.com
 * @repository  https://github.com/dominikwilkowski/beast.js
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const CFonts = require(`cfonts`);
const Chalk = require(`chalk`);
const Fs = require(`fs`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Constructor
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const BEAST = (() => { //constructor factory
	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// settings
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		DEBUG: true, //debug settings
		DEBUGLEVEL: 2,  //debug level setting
		MINWIDTH: 120,  //width of the game canvas
		MINHEIGHT: 40,  //height of the game canvas
		BOARD: [],      //the board representation in integers
		HERO: {        //the start position of the player
			x: 1,         //left aligned
			y: (40 - 8),  //we take MINHEIGHT - 8 to get to the bottom
		},
		LEVEL: 1,       //the current level (we start with 1 duh)
		LEVELS: {       //the amount of elements per level
			1: {          //start easy
				beast: 10,
				block: 200,
				solid: 10,
			},
			2: {          //increase beasts and solids, decrease blocks
				beast: 30,
				block: 150,
				solid: 50,
			},
			3: {          //increase beasts and solids, decrease blocks
				beast: 50,
				block: 100,
				solid: 100,
			},
		},
		SYMBOLS: {      //symbols for element
			hero: Chalk.cyan('¶'),
			beast: 'Θ',
			block: '░',
			solid: '▓',
		},
		RL: {},         //The readline object for reuse in all modules


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Debugging prettiness
//
// debugging, Print debug message that will be logged to console.
//
// @method  headline                      Return a headline preferably at the beginning of your app
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  report                        Return a message to report starting a process
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  error                         Return a message to report an error
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  interaction                   Return a message to report an interaction
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  send                          Return a message to report data has been sent
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//
// @method  received                      Return a message to report data has been received
//          @param    [text]   {string}   The sting you want to log
//          @param    [level]  {integer}  (optional) The debug level. Show equal and greater levels. Default: 99
//          @return   [ansi]   {output}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: {

			headline: ( text ) => {
				if( BEAST.DEBUG ) {
					CFonts.say(text, {
						'font': 'chrome',
						'align': 'center',
						'colors': ['green', 'cyan', 'white'],
					});
				}
			},

			report: ( text, level = 99 ) => {
				if( BEAST.DEBUG && level >= BEAST.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.green(' \u2611  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			error: ( text, level = 99 ) => {
				if( BEAST.DEBUG && level >= BEAST.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.red(' \u2612  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			interaction: ( text, level = 99 ) => {
				if( BEAST.DEBUG && level >= BEAST.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.blue(' \u261C  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			send: ( text, level = 99 ) => {
				if( BEAST.DEBUG && level >= BEAST.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.cyan(' \u219D  ')} ${Chalk.black(`${text} `)}`));
				}
			},

			received: ( text, level = 99 ) => {
				if( BEAST.DEBUG && level >= BEAST.DEBUGLEVEL ) {
					console.log(Chalk.bgWhite(`\n${Chalk.bold.cyan(' \u219C  ')} ${Chalk.black(`${text} `)}`));
				}
			}
		}
	}

})();
/***************************************************************************************************************************************************************
 *
 * Scaffolding
 *
 * Scaffold the game canvas
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.scaffolding = (() => {

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// init, Scaffold the canvas
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		init: () => {
			BEAST.debugging.report(`scaffolding: running init`, 1);

			BEAST.scaffolding.cords();             //we need to fill the BEAST.BOARD with empty arrays
			BEAST.scaffolding.element( 'block' );  //add blocks to BEAST.BOARD
			BEAST.scaffolding.element( 'solid' );  //add solids to BEAST.BOARD
			BEAST.scaffolding.hero();              //last but not least we need the hero in BEAST.BOARD
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// cords, Scaffold the coordinates for the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		cords: () => {
			BEAST.debugging.report(`scaffolding: running cords`, 1);

			for(let i = 0; i < ( BEAST.MINHEIGHT - 7 ); i++) {
				BEAST.BOARD[ i ] = []; //add array per row
			};
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// hero, Scaffold the hero onto the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		hero: () => {
			BEAST.debugging.report(`scaffolding: running hero`, 1);

			BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero' //add the hero his/her starting position
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// element, Randomly create and distribute elements on the board
//
// @param  element  {keyword}  We can only scaffold 'beast', 'block', 'solid'
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		element: ( element ) => {
			BEAST.debugging.report(`scaffolding: running blocks`, 1);

			let blocks = 0; //keep track of blocks we distribute

			while( blocks < BEAST.LEVELS[ BEAST.LEVEL ].block ) {
				let randomX = Math.floor( Math.random() * (BEAST.MINWIDTH - 2) + 0 );
				let randomY = Math.floor( Math.random() * (BEAST.MINHEIGHT - 7) + 0 );

				if(
					randomY + '-' + randomX != ( BEAST.HERO.y + 1 ) + '-' + ( BEAST.HERO.x - 1 ) && //row after one column before
					randomY + '-' + randomX != ( BEAST.HERO.y + 1 ) + '-' + ( BEAST.HERO.x ) &&     //row after
					randomY + '-' + randomX != ( BEAST.HERO.y + 1 ) + '-' + ( BEAST.HERO.x + 1 ) && //row after one column after

					randomY + '-' + randomX != BEAST.HERO.y + '-' + ( BEAST.HERO.x - 1 ) && //same row one column before
					randomY + '-' + randomX != BEAST.HERO.y + '-' + BEAST.HERO.x &&         //hero position
					randomY + '-' + randomX != BEAST.HERO.y + '-' + ( BEAST.HERO.x + 1 ) && //same row one column after

					randomY + '-' + randomX != ( BEAST.HERO.y - 1 ) + '-' + ( BEAST.HERO.x - 1 ) && //row before one column before
					randomY + '-' + randomX != ( BEAST.HERO.y - 1 ) + '-' + ( BEAST.HERO.x ) &&     //row before
					randomY + '-' + randomX != ( BEAST.HERO.y - 1 ) + '-' + ( BEAST.HERO.x + 1 ) && //row before one column after

					BEAST.BOARD[ randomY ][ randomX ] === undefined //no other elements on the spot
				) {
					BEAST.BOARD[ randomY ][ randomX ] = element;
					blocks ++;
				}
			}
		},
	}
})();
/***************************************************************************************************************************************************************
 *
 * Draw
 *
 * Drawing out the board to the terminal
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.draw = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// printLine, Print a row inside the board
//
// @param  item  {string}  The string to be written
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const printLine = ( item ) => {
		BEAST.debugging.report(`draw: running printLine`, 1);

		let spaceleft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
		spaceleft = ' '.repeat( spaceleft );

		BEAST.RL.write(`${spaceleft}${Chalk.gray(`║`)}${item}\n`); //print line inside the frame
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// frame, Draw canvas with logo and score
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		frame: () => {
			BEAST.debugging.report(`draw: frame`, 1);

			customStdout.muted = false;

			Readline.cursorTo( BEAST.RL, 0, 0 ); //go to top of board
			Readline.clearScreenDown( BEAST.RL ); //clear screen
			// Readline.clearLine( BEAST.RL, 0 ); //clear current line

			//testing screen size and just printing on error
			let error = BEAST.checkSize();
			if( error !== '' ) {
				Readline.cursorTo( BEAST.RL, 0, 0 ); //go to top of board
				Readline.clearScreenDown( BEAST.RL ); //clear screen
				BEAST.RL.write(`\n\n${error}`);
			}
			else {
				let spaceleft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
				spaceleft = ' '.repeat( spaceleft );

				let spacetop = Math.ceil( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 ); //vertically alignment
				spacetop = `\n`.repeat( spacetop );

				BEAST.RL.write( spacetop );
				BEAST.RL.write(
					`${spaceleft}${Chalk.green(`  ╔╗  ╔═╗ ╔═╗ ╔═╗ ╔╦╗`)}\n` +
					`${spaceleft}${Chalk.cyan (`  ╠╩╗ ║╣  ╠═╣ ╚═╗  ║`)}\n` +
					`${spaceleft}${Chalk.white(`  ╚═╝ ╚═╝ ╩ ╩ ╚═╝  ╩`)}\n`
				);

				BEAST.RL.write(`${spaceleft}${Chalk.gray(`╔${'═'.repeat( BEAST.MINWIDTH - 2 )}╗`)}\n`);
				BEAST.RL.write(`${spaceleft}${Chalk.gray(`║${' '.repeat( BEAST.MINWIDTH - 2 )}║`)}\n`.repeat( BEAST.MINHEIGHT - 7 ));
				BEAST.RL.write(`${spaceleft}${Chalk.gray(`╚${'═'.repeat( BEAST.MINWIDTH - 2 )}╝`)}\n`);
				BEAST.RL.write(`${spaceleft}  ${Chalk.red('❤  ❤  ❤  ❤')}\n`);

				BEAST.RL.write( spacetop );
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// board, Drawing the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		board: () => {
			BEAST.debugging.report(`draw: board`, 1);

			customStdout.muted = false; //allow output so we can draw

			let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
			Readline.cursorTo( BEAST.RL, 0, (top + 4) ); //go to top of board

			for(let boardLine of BEAST.BOARD) { //iterate over each row
				let line = ''; //translate BEAST.BOARD to ASCII

				for(let x = 0; x < ( BEAST.MINWIDTH - 2 ); x++) { //iterate over each column in this row
					let element = BEAST.SYMBOLS[ boardLine[ x ] ]; //get the symbol for the element we found

					if( element ) { //if there was an element found
						line += element;
					}
					else { //add space
						line += ' ';
					}
				}

				printLine( line ); //print the compiled line onto the board
			}

			Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there

			customStdout.muted = true; //no more user output now!
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// init, Scaffold the canvas
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		init: () => {
			BEAST.debugging.report(`draw: init`, 1);

			BEAST.draw.frame(); //draw frame,
			BEAST.draw.board(); //draw board, I mean the function names are kinda obvious so this comment really doesn't help much.
		},
	}
})();
/***************************************************************************************************************************************************************
 *
 * Move
 *
 * Moving the hero and checking for collisions and blocks
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.move = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// _isOutOfBounds, Check that the move does not go outside the bounds of the board
//
// @param  position  {object}   The position object: { x: 1, y: 1 }
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const _isOutOfBounds = ( position ) => {
		BEAST.debugging.report(`move: running _isOutOfBounds`, 1);

		let outofbounds = false; //let's assume the best

		if( position.x < 0 || position.y < 0 ) { //left and top bounds
			outofbounds = true;
		}

		if( position.x > (BEAST.MINWIDTH - 3) || position.y > (BEAST.MINHEIGHT - 8) ) { //right and bottom bounds
			outofbounds = true;
		}

		return outofbounds;
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// push, Check the environment and push blocks, return false if the move can't be done
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const push = ( dir, step ) => {
		BEAST.debugging.report(`move: running push`, 1);

		let element = '';
		let canMove = true;
		let elements = [];
		let position = { //our current position as clone
			x: BEAST.HERO.x,
			y: BEAST.HERO.y,
		};

		while( element !== undefined && !_isOutOfBounds( position ) ) { //stop when we encounter a space or the end of the frame
			position[ dir ] += step; //go one step forward and see

			if( BEAST.BOARD[ position.y ] === undefined ) { //if we're peaking beyond the bounds
				canMove = false;
				break
			}

			element = BEAST.BOARD[ position.y ][ position.x ]; //whats the element on the board on this step?

			if( element === 'solid' || _isOutOfBounds( position ) ) { //can't push pasted the bounds or move a solid mate!
				canMove = false;
			}

			if( element !== undefined ) {
				elements.push( element ); //save each element on the way to a free space
			}
		}

		if( canMove ) { //if there is pushing
			let i = 1;

			while( position[ dir ] != BEAST.HERO[ dir ] ) { //stop when we're back where we started
				element = elements[ elements.length - i ]; //get the saved element

				BEAST.BOARD[ position.y ][ position.x ] = element; //place it on the board

				position[ dir ] -= step; //step backwards
				i ++; //count steps
			}
		}

		return canMove;
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// hero, Move hero
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		hero: ( dir, step ) => {
			BEAST.debugging.report(`move: hero`, 1);

			let position = { //our current position
				x: BEAST.HERO.x,
				y: BEAST.HERO.y,
			};
			position[ dir ] += step; //move

			if( !_isOutOfBounds( position ) ) { //check to stay within bounds
				let _isPushable = push( dir, step );

				if( _isPushable ) {
					BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = undefined; //clear old position
					BEAST.HERO = position; //update global position

					if( _isOutOfBounds( BEAST.HERO ) ) { //check to stay within bounds
						BEAST.HERO[ dir ] -= step; //reset move
					}

					BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero'; //set new position

					BEAST.draw.board();
				}
			}
		},
	}
})();
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
		BEAST.draw.board();
	});

	process.stdin.on("keypress", (chunk, key) => { //redraw frame and board on terminal resize
		BEAST.RL.clearLine();

		if( key.name === 'right' ) {
			BEAST.move.hero( 'x', 1 );
		}
		else if( key.name === 'left' ) {
			BEAST.move.hero( 'x', -1 );
		}
		else if( key.name === 'up' ) {
			BEAST.move.hero( 'y', -1 );
		}
		else if( key.name === 'down' ) {
			BEAST.move.hero( 'y', 1 );
		}
		else {
			return;
		}
	});

	BEAST.scaffolding.init();
	BEAST.draw.init();
};


BEAST.init();