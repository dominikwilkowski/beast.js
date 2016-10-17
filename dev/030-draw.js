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