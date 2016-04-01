import gameUtils from '../util/game';

class Actor {

  constructor ( canvas, props, defaultProps = {} ) {
    this._canvas = canvas;
    this._state = Object.assign({}, defaultProps, props);
    this._state.circle = this.circle;

    console.log(this.state);
  }

  getPosition ( delta, x, y, direction, speed ) {
    const radians = gameUtils.degreesToRadians( direction );

    // calc distance to travel
    const distance = speed * delta / 1000;
    const distanceX = Math.sin( radians ) * distance;
    const distanceY = Math.cos( radians ) * distance;

    return {
      x: x + distanceX,
      y: y - distanceY
    }
  }

  hit ( anotherActor ) {
    this._state.health -= anotherActor.power;
  }

  get circle () {
    const { x, y, size } = this._state;
    const radius = size * 0.5;
    return {
      radius: radius,
      x: x + radius,
      y: y + radius
    };
  }

  get image () {
    const imageCount = this.state.images && this.state.images.length;
    if ( !imageCount ) { return; }

    if ( !this.state.speed || !this.state.maxSpeed ) {
      return this.state.images[ 0 ];
    }

    const speedIndex = Math.round( this.state.speed / this.state.maxSpeed * ( imageCount - 2 ) );
    return this.state.images[ speedIndex ];
  }

  get power () {
    return this._state.power;
  }

  get alive () {
    return this._state.health > 0;
  }

  get state () {
    return this._state;
  }
}

export default Actor;
