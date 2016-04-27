
export const validateNumber = {
	is: ( test ) => {
		return typeof test === 'number';
	},
	between: ( test, min, max ) => {
		if ( !validateNumber.is( test ) ) {
			return false;
		}

		if ( test < min ) {
			return false;
		}

		if ( test > max ) {
			return false;
		}

		return true;
	}
};

export const validateString = {
  is: ( test ) => {
    return typeof test === 'string';
  }
};

const validate = {
	number: validateNumber,
  string: validateString
};

export default validate;
