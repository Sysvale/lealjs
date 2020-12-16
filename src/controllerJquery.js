import Controllers from '../controllers';
import controller from './controller';

$.controller = (name) => {
	const internalName = name.replace(/#/g, '');

	if (Controllers[internalName]) {
		controller(internalName, Controllers[internalName]);
	} else {
		console.error(internalName, '[$.controller] caminho inválido.');
	}
};
