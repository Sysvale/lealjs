import argument from './argument';
import controllerRegister, { controllerCheck } from './controllerRegister';

$.leal.current_page = '';

export default async function redirect(route, options = {}) {
  let internalOptions = null;
  let internalRoute = null;
  const hash = argument(0);

  $('.all-views').hide();

  if (typeof options === 'object') {
    internalOptions = { ...options };
  }

  if (route && !route.target) { // não é um evento
    internalRoute = route;
  }

  if (!hash || route === '') {
    internalRoute = $.leal.fallbackRoute;
    if (typeof $.leal.fallbackRoute === 'function') {
      internalRoute = internalRoute();
    }
  }

  if (!internalRoute) {
    internalRoute = hash;
  }

  if (Array.isArray(internalRoute)) {
    internalRoute = internalRoute.join('/');
  }

  internalRoute = internalRoute.replace('#', '');
  $.leal.current_page = internalRoute;

  if (typeof controllerRegister(hash) === 'undefined') {
    await controllerCheck(internalRoute);
  } else if (internalRoute === hash) {
    controllerRegister(internalRoute).show();
  } else if (internalOptions.replace) {
    window.location.replace(`#${internalRoute}`);
  } else {
    window.location.hash = internalRoute;
  }
}
