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
				BEAST.RL.write(`${spaceleft}  ${Chalk.red('❤  ❤  ❤  ❤')}\n${spaceleft}  ??`);

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