
const defaultMissionData = {
  playerShip: {
    type: 'harrisonShip',
    settings: {
      _ready: true
    }
  },
  ships: [
    {
      type: 'alienClass1',
      settings: {
        x: 200,
        y: 300,
        speed: 40,
        direction: 135,
        _ready: true
      }
    },
    {
      type: 'alienClass2',
      settings: {
        x: 500,
        y: 200,
        speed: 400,
        direction: 20,
        _ready: true
      }
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

    this.saveMission( 'Default', defaultMissionData );
  }

  static getInstance () {
    if ( MissionService.instance == null ) {
      MissionService.isCreating = true;
      MissionService.instance = new MissionService();
      MissionService.isCreating = false;
    }

    return MissionService.instance;
  }

  getMissionKeys () {
    return Store.getKeys( this.storeKey ).map( ( key ) => {
      return {
        key: key,
        displayKey: this.getDisplayKey( key )
      }
    });
  }


  getMission ( key ) {
    return Store.get( this.getStoreKey( key ) );
  }

  saveMission ( key, missionData ) {
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
