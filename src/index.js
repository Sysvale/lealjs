import './controllerJquery';

import { routes } from './redirect';

export { default as argument } from './argument';
export { default as controller } from './controller';
export { default as redirect } from './redirect';

$.view = (name, done, local) => {
	const cleanName = name.replace(/#/g, '').replace(/\./g, '/');
	const path = typeof local === 'undefined' ? '.app' : local;
	$.ajax({
		url: `views/${cleanName}.html`,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			$(path).append(data);
		},
		error: (e) => {
			console.error(name, '[$.view] caminho inválido.', e);
		},
	}).done(done);
};

export default function initRoutes() {
	$(window).on('hashchange', routes);
	routes();
}
