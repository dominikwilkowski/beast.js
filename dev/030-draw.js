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
		BEAST.debugging.report(`draw: printLine`, 1);

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
			BEAST.debugging.report(`draw: score`, 1);

			customStdout.muted = false;

			//testing screen size
			let error = BEAST.checkSize();
			if( error === '' ) {
				let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
				Readline.cursorTo( BEAST.RL, 0, (top + 4 + ( BEAST.MINHEIGHT - 6 )) ); //go to bottom of board

				let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
				spaceLeft = ' '.repeat( spaceLeft );

				//calculate the space between lives and beast count
				let spaceMiddle = ( BEAST.MINWIDTH - 2 ) - ( 3 * BEAST.LIVES ) - 6 - ( Object.keys( BEAST.BEASTS ).length.toString().length );

				BEAST.RL.write(
					`${spaceLeft}${Chalk.red(`  ${BEAST.SYMBOLS.hero}`).repeat( BEAST.LIVES - BEAST.DEATHS )}` +
					`${Chalk.gray(`  ${BEAST.SYMBOLS.hero}`).repeat( BEAST.DEATHS )}`
				);

				BEAST.RL.write(`${' '.repeat( spaceMiddle )}  ${ Object.keys( BEAST.BEASTS ).length } x ${BEAST.SYMBOLS.beast}`);

				Readline.cursorTo( BEAST.RL, 0, (CliSize().rows - 1) ); //go to bottom of board and rest cursor there
			}

			customStdout.muted = true;
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// level, Draw the score at the bottom of the frame
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		level: () => {
			BEAST.debugging.report(`draw: level`, 1);

			customStdout.muted = false;

			//testing screen size
			let error = BEAST.checkSize();
			if( error === '' ) {
				let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
				let spaceLeft = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //horizontal alignment
				let spaceMiddle = ( BEAST.MINWIDTH - 2 ) - 9 - ( Object.keys( BEAST.LEVEL ).length.toString().length ); //calculate the space so we can right align

				Readline.cursorTo( BEAST.RL, (spaceLeft + spaceMiddle), (top + 2) ); //go to top above the board and right align

				BEAST.RL.write(`  Level: ${BEAST.LEVEL}`);

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

				printLine( line ); //print the compiled line onto the board
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

			let top = Math.floor( ( CliSize().rows - BEAST.MINHEIGHT ) / 2 );
			Readline.cursorTo( BEAST.RL, 0, (top + 4 + Math.floor( ( BEAST.MINHEIGHT - 7 ) / 2 ) - 2) ); //go to middle of board

			let spaceShoulder = Math.floor( ( CliSize().columns - BEAST.MINWIDTH ) / 2 ); //space left from frame
			spaceShoulder = ' '.repeat( spaceShoulder );

			let spaceLeft = Math.floor( ( (BEAST.MINWIDTH - 2) / 2 ) - ( (message.length + 2) / 2 ) );
			let spaceRight = Math.ceil( ( (BEAST.MINWIDTH - 2) / 2 ) - ( (message.length + 2) / 2 ) );

			BEAST.RL.write(`${spaceShoulder}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);
			BEAST.RL.write(`${spaceShoulder}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);
			BEAST.RL.write(`${spaceShoulder}${Chalk.gray(`│`)}${' '.repeat( spaceLeft )}${Chalk[ color ].bgWhite.bold(` ${message} `)}${' '.repeat( spaceRight )}\n`);
			BEAST.RL.write(`${spaceShoulder}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);
			BEAST.RL.write(`${spaceShoulder}${Chalk.gray(`│`)}${' '.repeat( BEAST.MINWIDTH - 2 )}\n`);

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