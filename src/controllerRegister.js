import argument from './argument';
import Controller from '../leal2.0/Controller';

$.leal.ctrl = {};

export default function controllerRegister(id, Obj) {
  if (typeof id === 'undefined') {
    return $.leal.ctrl[argument(0)];
  }

  if (typeof Obj === 'undefined') {
    return $.leal.ctrl[id];
  }

  if (Obj instanceof Controller) {
    $.leal.ctrl[id] = Obj;
    return $.leal.ctrl[id];
  }

  if (typeof Obj === 'function') {
    const c = new Obj();

    Object.keys(c).forEach((i) => {
      if (typeof c[i] === 'function') {
        c[i] = c[i].bind(c);
      }
    });
    $.leal.ctrl[id] = c;
  } else {
    $.leal.ctrl[id] = Obj;
  }

  if (!($.leal.ctrl[id] instanceof Controller)) {
    console.warn(`[deprecated]: Considere migrar o controller "${id}" para uma instância da classe Controller`);
    if (typeof $.leal.ctrl[id].initialize === 'function') {
      $($.leal.ctrl[id].initialize);
      return $.leal.ctrl[id];
    }
  }

  if (!$.leal.ctrl[id]) {
    throw new Error('[controllerRegister] => Controller não encontrado');
  }

  return $.leal.ctrl[id];
}

export const controllerCheck = async function controllerCheck(name) {
  const internalName = name.replace(/#/g, '');

  if (!$.leal.ctrl[internalName]) {
    await import(`@/js/controllers/${internalName.replace(/\./g, '/')}.js`)
      .then((module) => {
        controllerRegister(internalName, module.default);
      })
      .catch(() => {
        throw new Error(`[controllerRegister] => ${name} caminho inválido.`);
      });
  }
};
