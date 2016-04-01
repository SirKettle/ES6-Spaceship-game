import gameUtils from '../util/game';

class Shot {

  constructor ( direction, x, y, speed = 1000, power = 1, health = 1, lifeSpan = 300, size = 6, color = '#ffff00' ) {
    this._state = {
      direction: direction,
      speed: speed,
      power: power,
      lifeSpan: lifeSpan, // ms
      health: health,
      size: size,
      color: color,
      x: x,
      y: y
    };
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

  hit ( thing ) {
    // collisions handled outside the Hero class
    this._state.health -= thing.power;
  }

  update ( delta ) {
    const { x, y, direction, speed } = this._state;
    // get new coords
    const pos = this.getPosition( delta, x, y, direction, speed );
    // update the state
    this._state.x = pos.x;
    this._state.y = pos.y;


    this._state.health -= delta / this._state.lifeSpan;
    // this._state.power -= delta / this._state.lifeSpan;
  }

  get circle () {
    const { x, y, size } = this._state;
    return {
      radius: size * 0.5,
      x: x,
      y: y
    };
  }

  get power () {
    return this._state.power;
  }

  get state () {
    return this._state;
  }

  get alive () {
    return this._state.health > 0;
  }
}

export default Shot;
