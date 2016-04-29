
const objectUtils = {
    getSafeKey: ( key ) => {
        return `safeKey${key}`;
    },
    clone: ( obj ) => {
      return {
        ...obj
      };
    }
}

export default objectUtils;
