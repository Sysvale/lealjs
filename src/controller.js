import argument from './argument';

$.ctrl = {};

export default function controller(id, Obj) {
	if (typeof id === 'undefined') {
		return $.ctrl[argument(0)];
	}

	if (typeof Obj === 'undefined') {
		return $.ctrl[id];
	}

	if (typeof Obj === 'function') {
		const c = new Obj();

		Object.keys(c).forEach((i) => {
			if (typeof c[i] === 'function') {
				c[i] = c[i].bind(c);
			}
		});

		$.ctrl[id] = c;
	} else {
		$.ctrl[id] = Obj;
	}

	if (typeof $.ctrl[id].initialize === 'function') {
		$($.ctrl[id].initialize);
	}

	return null;
}
