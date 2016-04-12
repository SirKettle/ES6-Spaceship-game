import gameUtils from '../util/game';
import HeadSfx from '../services/Audio';
import SOUNDS from '../services/Sounds';

class Actor {

  constructor ( canvas, props, defaultProps = {} ) {
    this._canvas = canvas;
    this._state = Object.assign({
      _ready: true,
      _class: 'Actor',
      type: '_actor',
      name: 'base object',
      health: 1,
      power: 1,
      size: 1,
      speed: 0,
      x: 0,
      y: 0,
      direction: 0,
      images: [],
      imageUrls: []
    }, defaultProps, props);
    this._state.circle = this.circle;

    if ( !this.state.maxHealth ) {
      this._state.maxHealth = this.state.health;
    }
  }

  changeDirection ( turnBy ) {
    turnBy = turnBy % 360;
    let newDirection = this.state.direction + turnBy;

    if ( newDirection < 0 ) {
      newDirection = 360 + newDirection;
    }

    return newDirection % 360;
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

  hit ( anotherActor, delta ) {
    this._state.health -= anotherActor.power * ( delta / 1000 );

    if ( this.state.health > this.state.maxHealth ) {
      this._state.health = this._state.maxHealth;
    }

    if ( this.state.health <= 0 ) {
      HeadSfx.play( SOUNDS.EXPLOSION, this.audioVolume );
    }
  }

  update ( delta ) {
    const { x, y, direction, speed } = this._state;
    // get new coords
    const pos = this.getPosition( delta, x, y, direction, speed );
    // update the state
    this._state.x = pos.x;
    this._state.y = pos.y;
    // update the image
    this._state.image = this.image;
    // update the circle
    this._state.circle = this.circle;
  }

  get audioVolume () {
    return this.target && gameUtils.getVolumeByDistance( this.state, this.target ) || 1;
  }

  get circle () {
    const { x, y, size } = this.state;
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

    const speedIndex = Math.round( this.state.speed / this.state.maxSpeed * ( imageCount - 1 ) );
    return this.state.images[ speedIndex ];
  }

  get power () {
    return this.state.power;
  }

  get health () {
    return this.state.health;
  }

  get alive () {
    return this.health > 0;
  }

  get state () {
    return this._state;
  }
}

export default Actor;
