
const defaultMissionData = {
  playerShip: {
    _class: 'Ship',
    type: 'harrisonShip'
  },
  actors: [
    {
      _class: 'AiShip',
      type: 'alienClass1',
      x: 200,
      y: 300,
      speed: 40,
      direction: 135
    },
    {
      _class: 'AiShip',
      type: 'alienClass2',
      x: 500,
      y: 200,
      speed: 400,
      direction: 20
    },
    {
      _class: 'AiShip',
      type: 'alienClass1',
      x: 200,
      y: 300,
      speed: 140,
      direction: 135
    },
    {
      _class: 'Actor',
      type: 'frozenMoon',
      x: 500,
      y: 200,
      speed: 200,
      direction: 230
    },
    {
      _class: 'AiShip',
      type: 'playerShip',
      x: -2000,
      y: -2200,
      speed: 150,
      direction: 90
    },
    {
      _class: 'SpaceStation',
      type: 'spaceStation',
      x: 1500,
      y: -1500,
      speed: 10,
      direction: 355
    }
  ]
};

import Store from './Storage';

class MissionService {

  constructor () {
    if ( !MissionService.isCreating ) {
      throw new Error( 'You cannot call new in Singleton instances!' );
    }

    this.store = {
      missions: {}
    };

    this.save( 'Default', defaultMissionData );
  }

  static getInstance () {
    if ( MissionService.instance == null ) {
      MissionService.isCreating = true;
      MissionService.instance = new MissionService();
      MissionService.isCreating = false;
    }

    return MissionService.instance;
  }

  getKeys () {
    return Store.getKeys( this.storeKey ).map( ( key ) => {
      return this.getDisplayKey( key );
    });
  }

  remove ( key ) {
    Store.remove( this.getStoreKey( key ) );
  }

  load ( key ) {
    return Store.get( this.getStoreKey( key ) );
  }

  save ( key, missionData ) {
    Store.set(
      this.getStoreKey( key ),
      Object.assign( { missionKey: key }, missionData )
    );
  }

  getDisplayKey ( storeKey ) {
    return storeKey.split( this.storeKey )[ 1 ];
  }

  getStoreKey ( key ) {
    return `${ this.storeKey }${ key }`;
  }

  get storeKey () {
    return '_mission';
  }
}

export default MissionService.getInstance();
