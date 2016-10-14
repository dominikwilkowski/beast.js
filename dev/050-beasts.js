/***************************************************************************************************************************************************************
 *
 * Beasts
 *
 * Breathing live into beasts, making them move and killing them off too
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.beasts = (() => {

	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// squash, Squash a beast
//
// @param  position  {object}  The x position of the beast on the board in format: { x: 1, y: 1 }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		squash: ( position ) => {
			BEAST.debugging.report(`beasts: squash`, 1);

			delete BEAST.BEASTS[`${position.x}x${position.y}`]; //delete beast from the registry

			//disable interval for movement

			if( Object.keys( BEAST.BEASTS ).length === 0 ) { //no more beasts! The hero wins
				BEAST.DEAD = true; //disable controls
				BEAST.LEVEL ++; //increase level

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

			//
		},
	}
})();