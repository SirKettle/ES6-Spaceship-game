
const Store = {

  getKeys: ( keyMatch ) => {
    return Object.keys( window.localStorage )
      .filter( ( key ) => {
        return key.indexOf( keyMatch ) !== -1;
      });
  },

  remove: ( key ) => {
    window.localStorage.removeItem( key );
  },

  has: ( key ) => {
    return Boolean( window.localStorage.hasOwnProperty( key ) );
  },

  get: ( key ) => {
    const dataString = window.localStorage.getItem( key );

    if ( !dataString ) {
      console.warn( 'No record found in store', key );
      return;
    }

    let recordData;

    try {
      const record = JSON.parse( dataString );
      recordData = record.data;
    }
    catch ( error ) {
      console.warn( 'Error parsing json', key, error );
      return;
    }

    return recordData;
  },

  set: ( key, data ) => {

    let recordString;

    try {
      recordString = JSON.stringify({
        data: data
      });
    }
    catch ( error ) {
      console.warn( 'Error converting to string - probably trying to stringify a Class', key, data, error );
      return;
    }

    if ( recordString ) {
      window.localStorage.setItem( key, recordString );
    }
  }

}

export default Store;
