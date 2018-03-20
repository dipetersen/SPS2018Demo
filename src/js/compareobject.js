//Returns the object's class, Array, Date, RegExp, Object are of interest to us
const getClass = val => Object.prototype.toString.call(val).match(/^\[object\s(.*)\]$/)[1];
//Defines the type of the value, extended typeof
export const whatis = val => {
	if (val === undefined) return 'undefined';
	if (val === null)	return 'null';
  let type = typeof val;
 	if (type === 'object') type = getClass(val).toLowerCase();
	if (type === 'number') {
		if (val.toString().indexOf('.') > 0)
			return 'float';
		else
			return 'integer';
	}
	return type;
};

const compareObjects = function(a, b) {
	if (a === b)
		return true;
	for (let i in a) {
		if (b.hasOwnProperty(i)) {
			if (!IsEqual(a[i],b[i])) return false;
		} else {
			return false;
		}
	}

	for (let i in b) {
		if (!a.hasOwnProperty(i)) {
			return false;
		}
	}
	return true;
};

const compareArrays =function(a, b) {
	if (a === b)
		return true;
	if (a.length !== b.length)
		return false;
	for (let i = 0; i < a.length; i++){
		if(!IsEqual(a[i], b[i])) return false;
	};
	return true;
};

const _equal = {};
_equal.array = compareArrays;
_equal.object = compareObjects;
_equal.date = function(a, b) {
	return a.getTime() === b.getTime();
};
_equal.regexp = function(a, b) {
	return a.toString() === b.toString();
};

/*
 * Are two values equal, deep compare for objects and arrays.
 * @param a {any}
 * @param b {any}
 * @return {boolean} Are equal?
 */

export function IsEqual(a, b) {
	if (a !== b) {
		var atype = whatis(a), btype = whatis(b);

		if (atype === btype)
			return _equal.hasOwnProperty(atype) ? _equal[atype](a, b) : a==b;

		return false;
	}

	return true;
};


