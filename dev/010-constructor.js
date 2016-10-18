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
		DEBUG: [Debug], //debug settings
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
			lives: '¶',
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