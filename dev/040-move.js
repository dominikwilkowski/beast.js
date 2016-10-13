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


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// push, Check the environment and push blocks, return false if the move can't be done
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const push = ( dir, step ) => {
		BEAST.debugging.report(`move: running push`, 1);

		let element = '';
		let canMove = true;
		let elements = [];
		let position = { //our current position as clone
			x: BEAST.HERO.x,
			y: BEAST.HERO.y,
		};

		while( element !== undefined && !_isOutOfBounds( position ) ) { //stop when we encounter a space or the end of the frame
			position[ dir ] += step; //go one step forward and see

			if( BEAST.BOARD[ position.y ] === undefined ) { //if we're peaking beyond the bounds
				canMove = false;
				break
			}

			element = BEAST.BOARD[ position.y ][ position.x ]; //whats the element on the board on this step?

			if( element === 'solid' || _isOutOfBounds( position ) ) { //can't push pasted the bounds or move a solid mate!
				canMove = false;
			}

			if( element !== undefined ) {
				elements.push( element ); //save each element on the way to a free space
			}
		}

		if( canMove ) { //if there is pushing
			let i = 1;

			while( position[ dir ] != BEAST.HERO[ dir ] ) { //stop when we're back where we started
				element = elements[ elements.length - i ]; //get the saved element

				BEAST.BOARD[ position.y ][ position.x ] = element; //place it on the board

				position[ dir ] -= step; //step backwards
				i ++; //count steps
			}
		}

		return canMove;
	}


	return {
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// hero, Move hero
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		hero: ( dir, step ) => {
			BEAST.debugging.report(`move: hero`, 1);

			let position = { //our current position
				x: BEAST.HERO.x,
				y: BEAST.HERO.y,
			};
			position[ dir ] += step; //move

			if( !_isOutOfBounds( position ) ) { //check to stay within bounds
				let _isPushable = push( dir, step );

				if( _isPushable ) {
					BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = undefined; //clear old position
					BEAST.HERO = position; //update global position

					if( _isOutOfBounds( BEAST.HERO ) ) { //check to stay within bounds
						BEAST.HERO[ dir ] -= step; //reset move
					}

					BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero'; //set new position

					BEAST.draw.board();
				}
			}
		},
	}
})();