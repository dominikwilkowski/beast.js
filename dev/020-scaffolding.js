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