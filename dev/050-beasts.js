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