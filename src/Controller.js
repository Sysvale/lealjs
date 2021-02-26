export default class Controller {
	constructor(
		view,
		path,
		initializeCallback = function () {},
		loadViewCallback = function () {},
		showCallback,
		{
			extraCallbacks = {},
			extraProps,
			appendTo,
		},
	) {
		this.view = view;
		this.path = path;
		this.appendTo = appendTo;
		this.initializeCallback = initializeCallback.bind(this);
		this.loadViewCallback = loadViewCallback.bind(this);
		this.showCallback = showCallback.bind(this);

		Object.keys(extraCallbacks).forEach((callbackName) => {
			this[callbackName] = extraCallbacks[callbackName].bind(this);
		});
		Object.keys(extraProps).forEach((prop) => {
			this[prop] = extraProps[prop];
		});
		this.initialize();
	}

	async show() {
		try {
			await this.loadView();
			this.showCallback();
			$(this.view).show();
		} catch {
			throw new Error('Controller: showCallback não é uma função.');
		}
	}

	async initialize() {
		try {
			this.initializeCallback();
		} catch {
			throw new Error('Controller: initializeCallback não é uma função.');
		}
	}

	async loadView(path = this.path, loadViewCallback = this.loadViewCallback) {
		let cleanName;

		if ($(this.view).length) { // a view já foi carregada
			return false;
		}

		try {
			cleanName = path.replace(/#/g, '').replace(/\./g, '/');
		} catch {
			throw new Error('Controller: path é obrigatório.');
		}

		const element = typeof this.appendTo === 'undefined' ? '.app' : this.appendTo;

		return $.ajax({
			url: `views/${cleanName}.html`,
			type: 'GET',
			dataType: 'html',
			success: (data) => {
				$(element).append(data);
				try {
					loadViewCallback.call(this);
				} catch {
					throw new Error('View: loadView exige um callback.');
				}
			},
			error: (e) => {
				throw new Error(`${path} - View: caminho inválido. ${e}`);
			},
		});
	}
}
