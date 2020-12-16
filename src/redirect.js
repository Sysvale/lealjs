import argument from './argument';
import controller from './controller';
import runMiddlewares from './middlewares';

window.current_page = '';
window.initialPage = '/';

export default function redirect(route, options) {
	let internalOptions = null;

	if (typeof options !== 'object') {
		internalOptions = {};
	} else {
		internalOptions = { ...options };
	}

	const hash = window.location.hash.replace('#', '') || '';

	let internalRoute = route || '';

	if (typeof internalRoute === 'object') {
		internalRoute = internalRoute.join('/');
	}

	internalRoute = internalRoute.replace('#', '');

	if (internalRoute === hash) {
		routes();
	} else if (internalOptions.replace) {
		window.location.replace(`#${internalRoute}`);
	} else {
		window.location.hash = internalRoute;
	}
}

export const routes = async () => {
	const hash = argument(0);

	if (!hash.length) {
		const initialPage = getInitialPage();
		redirect(initialPage);
		return false;
	}

	$('.all-views').hide();

	await runMiddlewares()
		.then((results) => {
			if (typeof $.ctrl[hash] === 'undefined') {
				$.controller(hash);
			} else {
				controller(hash).show();
			}

			window.current_page = hash;
		}).catch((e) => console.log(e));
	return false;
};

export const setInitialPage = (initialPage) => {
	window.initialPage = initialPage;
};

export const getInitialPage = () => {
	return window.initialPage;
};
