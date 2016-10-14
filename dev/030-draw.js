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

		//testing screen size and just printing on error
		let error = BEAST.checkSize();
		if( error === '' ) {
			let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
			spaceLeft = ' '.repeat( spaceLeft );

			BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│`)}${item}\n`); //print line inside the frame
		}
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

			//testing screen size and just printing on error
			let error = BEAST.checkSize();
			if( error !== '' ) {
				Readline.cursorTo( BEAST.RL, 0, 0 ); //go to top of board
				Readline.clearScreenDown( BEAST.RL ); //clear screen
				BEAST.RL.write(`\n\n${error}`);
			}
			else {
				let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
				spaceLeft = ' '.repeat( spaceLeft );

				let spacetop = Math.ceil( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 ); //vertically alignment
				spacetop = `\n`.repeat( spacetop );

				BEAST.RL.write( spacetop );
				BEAST.RL.write(
					`${spaceLeft}${Chalk.green(`  ╔╗  ╔═╗ ╔═╗ ╔═╗ ╔╦╗`)}\n` +
					`${spaceLeft}${Chalk.cyan (`  ╠╩╗ ║╣  ╠═╣ ╚═╗  ║`)}\n` +
					`${spaceLeft}${Chalk.white(`  ╚═╝ ╚═╝ ╩ ╩ ╚═╝  ╩`)}\n`
				);

				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`┌${'─'.repeat( BEAST.MINWIDTH - 2 )}┐`)}\n`);
				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│${' '.repeat( BEAST.MINWIDTH - 2 )}│`)}\n`.repeat( BEAST.MINHEIGHT - 7 ));
				BEAST.RL.write(`${spaceLeft}${Chalk.gray(`└${'─'.repeat( BEAST.MINWIDTH - 2 )}┘`)}\n\n`);

				BEAST.RL.write( spacetop );
			}

			customStdout.muted = true;
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// score, Draw the score at the bottom of the frame
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		score: () => {
			customStdout.muted = false;

			//testing screen size and just printing on error
			let error = BEAST.checkSize();
			if( error === '' ) {
				let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
				Readline.cursorTo( BEAST.RL, 0, (top + 4 + ( BEAST.MINHEIGHT - 6 )) ); //go to bottom of board

				let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
				spaceLeft = ' '.repeat( spaceLeft );

				//calculate the space between lives and beast count
				let spaceMiddle = ( BEAST.MINWIDTH - 2 ) - ( 3 * BEAST.LIVES ) - 6 - ( Object.keys( BEAST.BEASTS ).length.toString().length );

				BEAST.RL.write(`${spaceLeft}${Chalk.red('  ❤').repeat( BEAST.LIVES - BEAST.DEATHS )}${Chalk.gray('  ❤').repeat( BEAST.DEATHS )}`);
				BEAST.RL.write(`${' '.repeat( spaceMiddle )}  ${ Object.keys( BEAST.BEASTS ).length } x ${BEAST.SYMBOLS.beast}`);

				Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there
			}

			customStdout.muted = true;
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
// message, Drawing a message in the center of the screen
//
// @param  message  {string}  The string to be written to the screen
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		message: ( message ) => {
			customStdout.muted = false; //allow output so we can draw

			let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
			Readline.cursorTo( BEAST.RL, 0, (top + 4 + Math.floor( ( BEAST.MINHEIGHT - 7 ) / 2 ) - 1) ); //go to middle of board

			let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //space left from frame
			spaceLeft = ' '.repeat( spaceLeft );

			let spaceCenter = Math.floor( ( (BEAST.MINWIDTH - 2) / 2 ) - ( message.length / 2 ) );

			BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);
			BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│`)}${' '.repeat( spaceCenter )}${message}${' '.repeat( spaceCenter )}\n`);
			BEAST.RL.write(`${spaceLeft}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);

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
			BEAST.draw.board(); //draw board, I mean the function names are kinda obvious so this comment really doesn't help much.
		},
	}
})();