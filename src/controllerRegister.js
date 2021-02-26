import argument from './argument';
import Controller from '../leal2.0/Controller';

$.ctrl = {};

export default function controllerRegister(id, Obj) {
	if (typeof id === 'undefined') {
		return $.ctrl[argument(0)];
	}

	if (typeof Obj === 'undefined') {
		return $.ctrl[id];
	}

	if (Obj instanceof Controller) {
		$.ctrl[id] = Obj;
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

	if (!($.ctrl[id] instanceof Controller)) {
		console.warn(`[deprecated]: Considere migrar o controller "${id}" para uma instância da classe Controller`);
		if (typeof $.ctrl[id].initialize === 'function') {
			$($.ctrl[id].initialize);
			return $.ctrl[id];
		}
	}

	if (!$.ctrl[id]) {
		throw new Error('[controllerRegister] => Controller não encontrado');
	}

	return $.ctrl[id];
}

export const controllerCheck = async function controllerCheck(name) {
	const internalName = name.replace(/#/g, '');

	if (!$.ctrl[internalName]) {
		await import(`@/js/controllers/${internalName.replace(/\./g, '/')}.js`)
			.then((module) => {
				controllerRegister(internalName, module.default);
			})
			.catch(() => {
				throw new Error(`[controllerRegister] => ${name} caminho inválido.`);
			});
	}
};
