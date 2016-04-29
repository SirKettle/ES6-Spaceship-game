



// in screenUtils

screenUtils.findPos = ( obj ) => {
    let curleft = 0;
    let curtop = 0;

    if ( obj.offsetParent ) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while ( obj = obj.offsetParent );

        return {
          x: curleft - document.body.scrollLeft,
          y: curtop - document.body.scrollTop
        };
    }
}

screenUtils.isTouchInBounds = ( el, touch ) => {
  if ( !el && !touch ) { return; }
  const offset = screenUtils.findPos( el );
  return Boolean(
    !!offset &&
    touch.clientX - offset.x > 0 &&
    touch.clientX - offset.x < parseFloat( el.width ) &&
    touch.clientY - offset.y > 0 &&
    touch.clientY - offset.y < parseFloat( el.height )
  );
};


// in objectUtils

objectUtils.clone = ( obj ) {
    return { ...obj };
};


// touchPadUtils

const targets = {
  left: { x1: 10, x2: 60, y1: 400, y2: 500 }
}

const TouchPad = {
  getIsTouch: ( touch, target ) => {
    return Boolean(
      touch.pageX >= target.x1 &&
      touch.pageX <= target.x2 &&
      touch.pageY >= target.y1 &&
      touch.pageY <= target.y2
    );
  },
  touches: {
    left: ( touches ) => {
      return touches.some( ( touch ) => {
        return TouchPad.getIsTouch( touch, targets.left );
      });
    }
  }
}


// mission.jsx

// add to the initial state
state = {
    touches: []
}

// touch actions
// ie - which actions to fire based on touches

// In updateGame ( delta ) - I think!


if ( screenUtils.isTouch ) {
  const touches = this.state.touches;
  const isTouchLeft = touchPadUtils.touches.left( touches );
  const isTouchRight = touchPadUtils.touches.right( touches );
  const isTouchUp = touchPadUtils.touches.up( touches );
  const isTouchDown = touchPadUtils.touches.down( touches );
  const isTouchFire1 = touchPadUtils.touches.fire1( touches );
  const isTouchFire2 = touchPadUtils.touches.fire2( touches );

  if ( isTouchLeft ) { this.playerShip.turnLeft( delta ); }
  if ( isTouchRight ) { this.playerShip.turnRight( delta ); }
  if ( isTouchUp ) { this.playerShip.accelerate( delta ); }
  if ( isTouchDown ) { this.playerShip.decelerate( delta ); }
  if ( isTouchFire1 ) { this.playerShip.shoot(); }
  if ( isTouchFire2 ) { this.playerShip.bomb(); }
}




// state manipulators

const addTouch ( touch ) {
  const touches = this.state.touches;
  touches.push( objectUtils.clone( touch ) );
  this.setState({ touches: touches });
};

const replaceTouch ( newTouch ) {
  const touches = this.state.touches;

  touches = touches.map( ( touch ) => {
    if ( newTouch.identifier === touch.identifier ) {
      return objectUtils.clone( newTouch );
    }
    return touch;
  });

  this.setState({ touches: touches });
};

const removeTouch ( touchToRemove ) {
  const touches = this.state.touches;

  touches = touches.filter( ( touch ) => {
    return Boolean( touchToRemove.identifier !== touch.identifier );
  });

  this.setState({ touches: touches });
};


// do we need this???

const getCanvasElement = () => {
  return document.getElementsByTagName("canvas")[0];
};

// touch event handlers

const handleStart = ( evt ) => {
  const el = getCanvasElement();
  const touches = evt.changedTouches;
  touches.forEach( ( touch, index ) => {
    const inBounds = screenUtils.isTouchInBounds( el, touch );
    if ( inBounds ) {
      evt.preventDefault();
      addTouch( touch );
    }
  });
};

const handleMove = ( evt ) => {
  const el = getCanvasElement();
  const touches = evt.changedTouches;
  touches.forEach( ( touch, index ) => {
    const inBounds = screenUtils.isTouchInBounds( el, touch );
    if ( inBounds ) {
      evt.preventDefault();
      replaceTouch( touch );
    }
  });
};

const handleEnd = ( evt ) => {
  const el = getCanvasElement();
  const touches = evt.changedTouches;
  touches.forEach( ( touch, index ) => {
    const inBounds = screenUtils.isTouchInBounds( el, touch );
    if ( inBounds ) {
      evt.preventDefault();
      removeTouch( touch );
    }
  });
};

const handleCancel = ( evt ) => {
  const touches = evt.changedTouches;
  touches.forEach( ( touch, index ) => {
    removeTouch( touch );
  });
  evt.preventDefault();
};
