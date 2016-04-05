
const Store = {

  getKeys: ( keyMatch ) => {
    return Object.keys( window.localStorage )
      .filter( ( key ) => {
        return key.indexOf( keyMatch ) !== -1;
      });
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

    const recordString = JSON.stringify({
      data: data
    });

    window.localStorage.setItem( key, recordString );
  }

}

export default Store;
