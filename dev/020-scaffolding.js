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