/***************************************************************************************************************************************************************
 *
 * Hero
 *
 * Moving the hero and checking for collisions, blocks and deaths
 *
 **************************************************************************************************************************************************************/


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
BEAST.hero = (() => {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Private function
// _isOutOfBounds, Check that the move does not go outside the bounds of the board
//
// @param  position  {object}   The position object: { x: 1, y: 1 }
//
// @return           {boolean}  True or false
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	const _isOutOfBounds = ( position ) => {
		BEAST.debugging.report(`hero: running _isOutOfBounds`, 1);

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
		BEAST.debugging.report(`hero: running push`, 1);

		let element = '';
		let canMove = true;
		let elements = [];
		let pushBeast = false;
		let beastPosition = {};
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

			if( element === 'beast' && elements.length === 0 ) { //You just walked into a beast = you dead!
				BEAST.hero.die(); //gone, done for, good bye

				return false;
			}

			if(
				element === 'solid' ||      //can't push no solid
				element === 'beast' ||      //can't push the beast around. beast eats you
				_isOutOfBounds( position )  //can't push past the bounds
			) {
				canMove = false;
			}

			if( element === 'beast' && !pushBeast ) { //if we got a beast by itself
				pushBeast = true;

				beastPosition = { //save the position of that beast for later squashing
					x: position.x,
					y: position.y,
				};
			}

			if(
				element === 'block' && pushBeast || //now we got a block right after a beast = squash it!
				element === 'solid' && pushBeast //a solid after a beast = squash it too
			) {
				if( elements[0] !== 'solid' ) {
					canMove = true; //even though there is a beast in the way we can totally squash it
				}

				elements.splice( (elements.length - 1), 1 );   //remove the beast from the things we will push
				elements.push( element ); //move the block
				BEAST.beasts.squash( beastPosition ); //squash that beast real good

				break; //no other elements need to be pushed now
			}

			if( element !== undefined ) {
				elements.push( element ); //save each element on the way to a free space
			}
		}

		if( canMove ) { //if there is pushing
			let i = 1;

			while( position[ dir ] != BEAST.HERO[ dir ] ) { //stop when we're back where we started
				element = elements[ elements.length - i ];    //get the saved element

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
// move, Move hero
//
// @param  dir   {string}   The direction we are moving towards
// @param  step  {integer}  The increment of the movement. 1 = move right, -1 = move left
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		move: ( dir, step ) => {
			BEAST.debugging.report(`hero: running move`, 1);

			if( !BEAST.DEAD ) {
				let position = { //our current position
					x: BEAST.HERO.x,
					y: BEAST.HERO.y,
				};
				position[ dir ] += step; //move

				if( !_isOutOfBounds( position ) ) {    //check to stay within bounds
					let _isPushable = push( dir, step ); //can we even push?

					if( _isPushable ) {
						BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = undefined; //clear old position
						BEAST.HERO = position; //update global position

						BEAST.BOARD[ BEAST.HERO.y ][ BEAST.HERO.x ] = 'hero'; //set new position

						BEAST.draw.board(); //now draw it up
					}
				}
			}
		},


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Public function
// die, Hero dies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		die: ( ) => {
			BEAST.debugging.report(`hero: running die`, 1);

			BEAST.DEATHS ++;
			BEAST.DEAD = true;

			BEAST.draw.message('You died :`(');

			setTimeout(() => {
				BEAST.DEAD = false;
				BEAST.scaffolding.init();
				BEAST.draw.init();
			}, 3000);
		},
	}
})();