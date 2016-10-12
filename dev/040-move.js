/***************************************************************************************************************************************************************
 *
 * Move
 *
 * Moving the hero and checking for collisions and blocks
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.move = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// _isOutOfBounds, Check that the move does not go outside the bounds of the board
//
// @param  position  {object}   The position object: { x: 1, y: 1 }
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const _isOutOfBounds = ( position ) => {
		BEAST.debugging.report(`move: running _isOutOfBounds`, 1);

		let outofbounds = false; //let's assume the best

		if( position.x < 0 || position.y < 0 ) { //left and top bounds
			outofbounds = true;
		}

		if( position.x > (BEAST.MINWIDTH - 3) || position.y > (BEAST.MINHEIGHT - 8) ) { //right and bottom bounds
			outofbounds = true;
		}

		return outofbounds;
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// hero, Move hero
//
// @param  dir   {string}   The direction we are moving
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		hero: ( dir, step ) => {
			BEAST.debugging.report(`move: hero`, 1);

			BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = ''; //clear old position
			BEAST.HERO[ dir ] += step; //move

			if( _isOutOfBounds( BEAST.HERO ) ) { //check to stay within bounds
				BEAST.HERO[ dir ] -= step; //reset move
			}

			BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero'; //set new position

			BEAST.draw.board();
		},
	}
})();