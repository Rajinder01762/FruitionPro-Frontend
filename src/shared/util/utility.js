export const monthsRegx = /(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/g;
export const apmRegex = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp].[Mm].))/g;
// export const apmRegex = /\b((1[0-2]|0?[1-9]):([0-5][0-9]))/g;
export const apmRegex2 = /\b((1[0-2]|0?[1-9]) ([AaPp].[Mm].))/g;
export const addToStrPrototype = () => {
	String.prototype.nThIndexOf = function (sub, start = 0, n) {
		let str = this,
			count = 0,
			res = -1,
			lastIdx = 0;
		while (str.length) {
			let subIdx = str.indexOf(sub, lastIdx ? lastIdx + 1 : start);
			if (subIdx !== -1) {
				count++;
				lastIdx = subIdx;
				if (count === n) {
					res = subIdx;
					str = '';
				}
			} else str = '';
		}
		return res;
	};
	String.prototype.regexIndexOf = function (regex, startpos) {
		var indexOf = this.substring(startpos || 0).search(regex);
		return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
	};
	String.prototype.regexLastIndexOf = function (regex, startpos) {
		regex = regex.global
			? regex
			: new RegExp(
					regex.source,
					'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiLine ? 'm' : '')
			  );
		if (typeof startpos == 'undefined') startpos = this.length;
		else if (startpos < 0) startpos = 0;
		var stringToWorkWith = this.substring(0, startpos + 1);
		var lastIndexOf = -1;
		var nextStop = 0;
		let result;
		while ((result = regex.exec(stringToWorkWith)) != null) {
			lastIndexOf = result.index;
			regex.lastIndex = ++nextStop;
		}
		return lastIndexOf;
	};
};
// new function added
export const addToArrPrototype = () => {
	Array.prototype.regexIndexOf = function (regex) {
		const arr = this;
		let resI = -1;
		for (let i = 0; i < arr.length; i++) {
			if (regex.test(arr[i])) {
				resI = i;
				break;
			}
		}
		return resI;
	};
	Array.prototype.regexLastIndexOf = function (regex) {
		const arr = this;
		let resI = -1;
		for (let i = arr.length - 1; i >= 0; i--) {
			if (regex.test(arr[i])) {
				resI = i;
				break;
			}
		}
		return resI;
	};
};
export const convertTime12to24 = (time12h) => {
	const [time, modifier] = time12h.split(' ');
	let [hours, minutes] = time.split(':');
	if (hours === '12') hours = '00';
	if (modifier === 'p.m.') hours = parseInt(hours, 10) + 12;
	return `${hours}:${minutes}`;
};

export const areSimpleObjsEqual = function (_1, _2) {
	return JSON.parse(JSON.stringify(_1)) === JSON.parse(JSON.stringify(_2));
};

export const debounce = (func, delay) => {
	let debounceTimer;
	return function () {
	  let context = this, args = arguments;
	  clearTimeout(debounceTimer);
	  debounceTimer = setTimeout(function() {
		func.apply(context, args)
	  }, delay);
	}
  }

export const removeDupsByProp = (arr, prop) => arr.filter((o, i, a) => a.findIndex(el => el[prop] === o[prop]) === i);
