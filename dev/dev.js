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
		MINWIDTH: 100,  //width of the game canvas
		MINHEIGHT: 40,  //height of the game canvas (reuse in BEAST.HERO.y)
		BOARD: [],      //the board representation in integers
		START: {        //the start position of the player, the beasts start on the right top corner
			x: 1,         //left aligned
			y: (40 - 8),  //we take MINHEIGHT - 8 to get to the bottom
		},
		HERO: {},       //position tracking for our hero
		DEAD: false,    //when the hero dies he/she can't move no more
		BEASTS: {},     //position tracking for all beasts
		LIVES: 4,       //how many lives do we have?
		DEATHS: 0,      //how many times have we died so far?
		LEVEL: 1,       //the current level (we start with 1 duh)
		LEVELS: {       //the amount of elements per level
			1: {          //start easy
				beast: 1,
				block: 600,
				solid: 50,
				speed: 1000,
			},
			2: {          //increase beasts and solids, decrease blocks
				beast: 3,
				block: 400,
				solid: 100,
				speed: 1000,
			},
			3: {          //increase beasts and solids, decrease blocks
				beast: 5,
				block: 350,
				solid: 200,
				speed: 1000,
			},
			4: {          //increase beasts and solids, decrease blocks and speed
				beast: 10,
				block: 100,
				solid: 500,
				speed: 500,
			},
		},
		SYMBOLS: {      //symbols for element
			hero: Chalk.cyan('¶'),
			beast: Chalk.green('Φ'),
			block: Chalk.gray('▓'),
			solid: Chalk.white('▓'),
		},
		RL: {},         //the readline object for reuse in all modules
		INTERVAL: {},   //the interval object to clear or set the beast walking interval on


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
			BEAST.debugging.report(`scaffolding: init`, 1);

			BEAST.HERO = {
				x: BEAST.START.x,
				y: BEAST.START.y,
			};

			BEAST.scaffolding.cords();             //we need to fill the BEAST.BOARD with empty arrays
			BEAST.scaffolding.beasts();            //add beasts
			BEAST.scaffolding.element( 'block' );  //add blocks to BEAST.BOARD
			BEAST.scaffolding.element( 'solid' );  //add solids to BEAST.BOARD
			BEAST.scaffolding.hero();              //last but not least we need the hero
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// cords, Scaffold the coordinates for the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		cords: () => {
			BEAST.debugging.report(`scaffolding: cords`, 1);

			for(let i = 0; i < ( BEAST.MINHEIGHT - 7 ); i++) {
				BEAST.BOARD[ i ] = []; //add array per row
			};
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// hero, Scaffold the hero onto the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		hero: () => {
			BEAST.debugging.report(`scaffolding: hero`, 1);

			BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero' //add the hero his/her starting position
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// beasts, Scaffold beasts onto the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		beasts: () => {
			BEAST.debugging.report(`scaffolding: beasts`, 1);

			let beasts = 0; //keep track of the beasts we distribute
			BEAST.BEASTS = [];

			while( beasts < BEAST.LEVELS[ BEAST.LEVEL ]['beast'] ) {
				let randomX = Math.floor( Math.random() * ((BEAST.MINWIDTH - 2) - ( BEAST.MINWIDTH / 2 )) + ( BEAST.MINWIDTH / 2 ) );
				let randomY = Math.floor( Math.random() * (((BEAST.MINHEIGHT - 7) / 2) - 0) + 0 );

				if( BEAST.BOARD[ randomY ][ randomX ] === undefined ) { //no other elements on the spot
					BEAST.BOARD[ randomY ][ randomX ] = 'beast'; //adding beast onto board

					BEAST.BEASTS[`${randomX}-${randomY}`] = { //adding beast to beast registry
						x: randomX,
						y: randomY,
					}

					beasts ++;
				}
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// element, Randomly create and distribute elements on the board
//
// @param  element  {keyword}  We can only scaffold 'beast', 'block', 'solid'
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		element: ( element ) => {
			BEAST.debugging.report(`scaffolding: blocks`, 1);

			let count = 0; //keep track of elements we distribute

			while( count < BEAST.LEVELS[ BEAST.LEVEL ][ element ] ) {
				let randomX = Math.floor( Math.random() * ((BEAST.MINWIDTH - 2) - 0 ) + 0 );
				let randomY = Math.floor( Math.random() * ((BEAST.MINHEIGHT - 7) - 0 ) + 0 );

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
					count ++;
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
// getSpaceLeft, Return the space we need left from the frame
//
// @return  {integer}  The amount of spaces we need to get inside the board from the left, rounded
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const getSpaceLeft = ( item ) => {
		BEAST.debugging.report(`draw: getSpaceLeft`, 1);

		let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ) + 1; //horizontal alignment

		return spaceLeft
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// getSpaceTop, Return the space we need from the top to inside the board
//
// @return  {integer}  The amount of spaces we need to get inside the board from the top, not rounded
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const getSpaceTop = ( item ) => {
		BEAST.debugging.report(`draw: getSpaceTop`, 1);

		let spacetop = ( CliSize().rows - BEAST.MINHEIGHT ) / 2; //vertically alignment

		return spacetop
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// frame, Draw canvas with logo and score
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		frame: () => {
			BEAST.debugging.report(`draw: frame`, 1);

			customStdout.muted = false; //allow output so we can draw

			Readline.cursorTo( BEAST.RL, 0, 0 ); //go to top of board
			Readline.clearScreenDown( BEAST.RL ); //clear screen

			//testing screen size and just printing on error
			let error = BEAST.checkSize();
			if( error !== '' ) {
				BEAST.RL.write(`\n\n${error}`);
			}
			else {
				let spaceLeft = getSpaceLeft() - 1; //horizontal alignment
				spaceLeft = ' '.repeat( spaceLeft );

				let spaceTop = Math.ceil( getSpaceTop() ); //vertically alignment
				spaceTop = `\n`.repeat( spaceTop );

				BEAST.RL.write( spaceTop );
				BEAST.RL.write(
					`${spaceLeft}${Chalk.green(`  ╔╗  ╔═╗ ╔═╗ ╔═╗ ╔╦╗`)}\n` +
					`${spaceLeft}${Chalk.cyan (`  ╠╩╗ ║╣  ╠═╣ ╚═╗  ║`)}\n` +
					`${spaceLeft}${Chalk.white(`  ╚═╝ ╚═╝ ╩ ╩ ╚═╝  ╩`)}\n`
				);

				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`┌${'─'.repeat( BEAST.MINWIDTH - 2 )}┐`)}\n`);
				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│${' '.repeat( BEAST.MINWIDTH - 2 )}│`)}\n`.repeat( BEAST.MINHEIGHT - 7 ));
				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`└${'─'.repeat( BEAST.MINWIDTH - 2 )}┘`)}\n\n`);

				BEAST.RL.write( spaceTop );
			}

			customStdout.muted = true; //no more user output now!
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// score, Draw the score at the bottom of the frame
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		score: () => {
			BEAST.debugging.report(`draw: score`, 1);

			customStdout.muted = false; //allow output so we can draw

			//testing screen size
			let error = BEAST.checkSize();
			if( error === '' ) {
				let spaceTop = Math.floor( getSpaceTop() );
				let spaceLeft = getSpaceLeft();

				Readline.cursorTo( BEAST.RL, spaceLeft, (spaceTop + 4 + ( BEAST.MINHEIGHT - 6 )) ); //go to bottom of board

				//calculate the space between lives and beast count
				let spaceMiddle = ( BEAST.MINWIDTH - 2 ) - ( 3 * BEAST.LIVES ) - 3 - ( Object.keys( BEAST.BEASTS ).length.toString().length );

				BEAST.RL.write(
					`${Chalk.red(` ${BEAST.SYMBOLS.hero}`).repeat( BEAST.LIVES - BEAST.DEATHS )}` +
					`${Chalk.gray(`  ${BEAST.SYMBOLS.hero}`).repeat( BEAST.DEATHS )}` +
					`${' '.repeat( spaceMiddle )}  ${ Object.keys( BEAST.BEASTS ).length } x ${BEAST.SYMBOLS.beast}`
				);

				Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there
			}

			customStdout.muted = true; //no more user output now!
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// level, Draw the score at the bottom of the frame
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		level: () => {
			BEAST.debugging.report(`draw: level`, 1);

			customStdout.muted = false; //allow output so we can draw

			//testing screen size
			let error = BEAST.checkSize();
			if( error === '' ) {
				let spaceTop = Math.floor( getSpaceTop() );
				let spaceLeft = getSpaceLeft(); //horizontal alignment
				let spaceMiddle = ( BEAST.MINWIDTH - 2 ) - 10 - ( Object.keys( BEAST.LEVEL ).length.toString().length ); //calculate the space so we can right align

				Readline.cursorTo( BEAST.RL, (spaceLeft + spaceMiddle), (spaceTop + 2) ); //go to top above the board and right align

				BEAST.RL.write(`  Level: ${BEAST.LEVEL}`);

				Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there
			}

			customStdout.muted = true; //no more user output now!
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// board, Drawing the board
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		board: () => {
			BEAST.debugging.report(`draw: board`, 1);

			customStdout.muted = false; //allow output so we can draw

			let spaceTop = Math.floor( getSpaceTop() );
			let spaceLeft = getSpaceLeft();

			Readline.cursorTo( BEAST.RL, 0, (spaceTop + 4) ); //go to top of board

			for(let boardRow of BEAST.BOARD) { //iterate over each row
				let line = ''; //translate BEAST.BOARD to ASCII

				for(let x = 0; x < ( BEAST.MINWIDTH - 2 ); x++) { //iterate over each column in this row
					let element = BEAST.SYMBOLS[ boardRow[ x ] ]; //get the symbol for the element we found

					if( element ) { //if there was an element found
						line += element;
					}
					else { //add space
						line += ' ';
					}
				}

				Readline.moveCursor(BEAST.RL, spaceLeft, 0); //move cursor into board
				BEAST.RL.write(`${line}\n`); //print line inside the frame
			}

			Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there

			customStdout.muted = true; //no more user output now!
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// message, Drawing a message in the center of the screen
//
// @param  message  {string}   The string to be written to the screen
// @param  color    {keyword}  The color of the message, Default: black, optional
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		message: ( message, color = 'black' ) => {
			customStdout.muted = false; //allow output so we can draw

			let spaceTop = Math.floor( getSpaceTop() );
			let spaceLeft = getSpaceLeft(); //space left from frame

			Readline.cursorTo( BEAST.RL, spaceLeft, (spaceTop + 4 + Math.floor( ( BEAST.MINHEIGHT - 7 ) / 2 ) - 2) ); //go to middle of board

			let space = ( (BEAST.MINWIDTH - 2) / 2 ) - ( (message.length + 2) / 2 ); //rest space minus the message length
			let spaceMiddleLeft = Math.floor( space );
			let spaceMiddleRight = Math.ceil( space );

			BEAST.RL.write(`${' '.repeat( BEAST.MINWIDTH - 2 )}\n`); //clear line
			Readline.moveCursor(BEAST.RL, spaceLeft, 0);             //move cursor into board
			BEAST.RL.write(`${' '.repeat( BEAST.MINWIDTH - 2 )}\n`); //clear line
			Readline.moveCursor(BEAST.RL, spaceLeft, 0);             //move cursor into board
			BEAST.RL.write(`${' '.repeat( spaceMiddleLeft )}${Chalk[ color ].bgWhite.bold(` ${message} `)}${' '.repeat( spaceMiddleRight )}\n`);
			Readline.moveCursor(BEAST.RL, spaceLeft, 0);             //move cursor into board
			BEAST.RL.write(`${' '.repeat( BEAST.MINWIDTH - 2 )}\n`); //clear line
			Readline.moveCursor(BEAST.RL, spaceLeft, 0);             //move cursor into board
			BEAST.RL.write(`${' '.repeat( BEAST.MINWIDTH - 2 )}\n`); //clear line

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
			BEAST.draw.score(); //draw score,
			BEAST.draw.level(); //draw level,
			BEAST.draw.board(); //draw board, I mean the function names are kinda obvious so this comment really doesn't help much.
		},
	}
})();
/***************************************************************************************************************************************************************
 *
 * Hero
 *
 * Moving the hero and checking for collisions, blocks and deaths
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.hero = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// _isOutOfBounds, Check that the move does not go outside the bounds of the board
//
// @param  position  {object}   The position object: { x: 1, y: 1 }
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const _isOutOfBounds = ( position ) => {
		BEAST.debugging.report(`hero: _isOutOfBounds`, 1);

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
		BEAST.debugging.report(`hero: push`, 1);

		let element = '';
		let canMove = true;
		let elements = [];
		let pushBeast = false;
		let beastPosition = {};
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

			if( element === 'beast' && elements.length === 0 ) { //You just walked into a beast = you dead!
				BEAST.hero.die(); //gone, done for, good bye

				return false;
			}

			if(
				element === 'solid' ||      //can't push no solid
				element === 'beast' ||      //can't push the beast around. beast eats you
				_isOutOfBounds( position )  //can't push past the bounds
			) {
				canMove = false;
			}

			if( element === 'beast' && !pushBeast ) { //if we got a beast by itself
				pushBeast = true;

				beastPosition = { //save the position of that beast for later squashing
					x: position.x,
					y: position.y,
				};
			}

			if(
				element === 'block' && pushBeast || //now we got a block right after a beast = squash it!
				element === 'solid' && pushBeast //a solid after a beast = squash it too
			) {

				let previousSolids = false; //
				for(let i = elements.length - 2; i >= 0; i--) { //have we got any solids in the elements we are pushing?
					if( elements[i] === 'solid' ) {
						previousSolids = true;
					}
				};

				if( !previousSolids ) { //can't move this if you are trying to push solids
					canMove = true; //even though there is a beast in the way we can totally squash it
				}

				elements.splice( (elements.length - 1), 1 );   //remove the beast from the things we will push
				elements.push( element ); //move the block
				BEAST.beasts.squash( beastPosition ); //squash that beast real good

				break; //no other elements need to be pushed now
			}

			if( element !== undefined ) {
				elements.push( element ); //save each element on the way to a free space
			}
		}

		if( canMove ) { //if there is pushing
			let i = 1;

			while( position[ dir ] != BEAST.HERO[ dir ] ) { //stop when we're back where we started
				element = elements[ elements.length - i ];    //get the saved element

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
// move, Move hero
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		move: ( dir, step ) => {
			BEAST.debugging.report(`hero: move`, 1);

			if( !BEAST.DEAD ) {
				let position = { //our current position
					x: BEAST.HERO.x,
					y: BEAST.HERO.y,
				};
				position[ dir ] += step; //move

				if( !_isOutOfBounds( position ) ) {    //check to stay within bounds
					let _isPushable = push( dir, step ); //can we even push?

					if( _isPushable ) {
						BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = undefined; //clear old position
						BEAST.HERO = position; //update global position

						BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero'; //set new position

						BEAST.draw.board(); //now draw it up
					}
				}
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// die, Hero dies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		die: ( ) => {
			BEAST.debugging.report(`hero: die`, 1);

			clearInterval( BEAST.INTERVAL );
			BEAST.DEATHS ++;
			BEAST.DEAD = true;

			if( BEAST.DEATHS > BEAST.LIVES ) { //no more lives left
				BEAST.draw.message('GAME OVER...'); //sorry :`(

				setTimeout(() => {
					process.exit(0); //exit without error
				}, 2000);
			}
			else {
				BEAST.draw.message('You were eaten by a beast :`(');

				setTimeout(() => { //restart with level 1
					BEAST.LEVEL = 1;
					BEAST.DEAD = false;
					BEAST.scaffolding.init();
					BEAST.draw.init();
					BEAST.beasts.init();
				}, 3000);
			}
		},
	}
})();
/***************************************************************************************************************************************************************
 *
 * Beasts
 *
 * Breathing live into beasts, making them move, seek, kill and mortal
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const PF = require('pathfinding');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.beasts = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// portBoard, Convert current board into an array the pathfinding library can understand
//
// @return  {array}  The presentation of the board in 0 and 1
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const portBoard = ( position ) => {
		BEAST.debugging.report(`beasts: portBoard`, 1);

		let i = 0;
		let newBoard = []; //we assume always the best

		for(let boardRow of BEAST.BOARD) { //iterate over each row
			newBoard[ i ] = []; //add a row

			for(let x = 0; x < ( BEAST.MINWIDTH - 2 ); x++) { //iterate over each cell in this row
				let cell = boardRow[ x ];

				if( cell === undefined || cell === 'hero' ) {
					newBoard[ i ].push( 0 ); //add the cell as walkable
				}
				else {
					newBoard[ i ].push( 1 ); //add the cell as not walkable
				}
			}

			i ++;
		}

		return newBoard;
	}


	return {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// walk, Make all beasts walk
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		walk: () => {
			BEAST.debugging.report(`beasts: walk`, 1);

			let finder = new PF.AStarFinder({
				allowDiagonal: true,
			});

			//iterate beasts
			for( let beast in BEAST.BEASTS ) {
				beast = BEAST.BEASTS[ beast ];
				let board = portBoard(); //we have to port the board to an binary multi dimensional array for the pathfinding library
				let grid = new PF.Grid( board );
				let path = finder.findPath(beast.x, beast.y, BEAST.HERO.x, BEAST.HERO.y, grid);

				if( path[1] !== undefined ) { //if there is no path then just stand still
					delete BEAST.BEASTS[`${beast.x}-${beast.y}`]; //delete this beast from the registry
					BEAST.BOARD[ beast.y ][ beast.x ] = undefined; //empty the spot this beast was in

					BEAST.BEASTS[`${path[1][0]}-${path[1][1]}`] = { //add it back in with updated key and coordinates
						x: path[1][0],
						y: path[1][1],
					};
					BEAST.BOARD[ path[1][1] ][ path[1][0] ] = 'beast'; //add the best to the new position

					BEAST.draw.board();

					if( path[1][0] === BEAST.HERO.x && path[1][1] === BEAST.HERO.y ) {
						clearInterval( BEAST.INTERVAL ); //first no more movements
						BEAST.hero.die(); //you dead

						break; //no more beasts movements necessary
					}
				}
			}

		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// squash, Squash a beast
//
// @param  position  {object}  The x position of the beast on the board in format: { x: 1, y: 1 }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		squash: ( position ) => {
			BEAST.debugging.report(`beasts: squash`, 1);

			delete BEAST.BEASTS[`${position.x}-${position.y}`]; //delete beast from the registry

			if( Object.keys( BEAST.BEASTS ).length === 0 ) { //no more beasts! The hero wins
				BEAST.DEAD = true; //disable controls
				BEAST.LEVEL ++; //increase level

				clearInterval( BEAST.INTERVAL ); //disable interval for movement

				if( BEAST.LEVEL > Object.keys( BEAST.LEVELS ).length ) { //won last level
					setTimeout(() => {
						BEAST.draw.message( '!! YOU WIN THE GAME !!', 'magenta' );

						setTimeout(() => {
							process.exit(0); //exit without error
						}, 2000);
					}, 300);
				}
				else { //win mid levels
					setTimeout(() => {
						BEAST.draw.message( `YOU WIN LEVEL ${(BEAST.LEVEL - 1)}!`, 'magenta' );

						setTimeout(() => { //next level
							BEAST.DEAD = false;
							BEAST.scaffolding.init();
							BEAST.draw.init();
							BEAST.beasts.init();
						}, 3000);
					}, 300);
				}
			}
			else {
				BEAST.draw.score(); //draw the score again as it just changed!
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// init, Adding the intervals for each beast for their movements
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		init: () => {
			BEAST.debugging.report(`beasts: init`, 1);

			clearInterval( BEAST.INTERVAL ); //clear any intervals to avoid doubling up

			BEAST.INTERVAL = setInterval(() => { //set the interval in which the beasts move
				BEAST.beasts.walk();
			}, BEAST.LEVELS[ BEAST.LEVEL ].speed );
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
			error = `\n  Your console window is not wide enough for this game\n` +
				`  Please resize your window to at least ${( BEAST.MINWIDTH + 4 )} x ${( BEAST.MINHEIGHT + 1 )}\n` +
				`  (It is ${CliSize().columns} x ${CliSize().rows})\n`;
		}

		if( CliSize().rows < ( BEAST.MINHEIGHT + 1 ) ) {
			error = `\n  Your console window is not tall enough for this game\n` +
				`  Please resize your window to at least ${( BEAST.MINWIDTH + 4 )} x ${( BEAST.MINHEIGHT + 1 )}\n` +
				`  (It is ${CliSize().columns} x ${CliSize().rows})\n`;
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