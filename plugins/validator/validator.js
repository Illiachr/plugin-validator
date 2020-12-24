class Validator {
	constructor({ selector, pattern = {}, method }) {
		this.form = document.querySelector(selector);
		this.pattern = pattern;
		this.method = method;
		this.elementsForm = [...this.form.elements].filter(item => item.tagName.toLowerCase() !== 'button' &&
				item.type !== 'button');
		this.error = new Set(); // коллекция для хранения ошибок, с ней будет удобнее работать чем с массивом
	}

	init() {
		this.applyStyle();
		this.setPattern();
		this.elementsForm.forEach(elem => elem.addEventListener('change', this.chekIt.bind(this)));
		this.form.addEventListener('submit', e => {
			this.elementsForm.forEach(elem => this.chekIt({ target: elem }));
			if (this.error.size) {
				e.preventDefault();
			}
		});
	}

	isValid(elem) {
		const validatorMethod = {
			notEmpty(elem) {
				if (elem.value.trim() === '') { return false; }
				return true;
			},

			pattern(elem, pattern) {
				return pattern.test(elem.value);
			}

		}; // end validatorMethod

		const method = this.method[elem.id];
		// если матрица методов существует - перебираем все методы
		if (method) {
			return method.every(item => validatorMethod[item[0]](elem, this.pattern[item[1]]));
		}
	}

	chekIt(event) {
		const target = event.target;

		if (this.isValid(target)) {
			this.showSuccess(target);
		} else {
			this.showError(target);
			this.error.add(target);
		}
		console.log(this.error); // в коллекцию сохраням элемент, который содержит строку с ошибкой.
	}

	showError(elem) {
		elem.classList.remove('success');
		elem.classList.add('error');

		if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')) {
			return;
		} // условие необходимо для того чтобы не создавать блоки повторно
		const errorDiv = document.createElement('div');
		errorDiv.textContent = 'Ошибка в этом поле';
		errorDiv.classList.add('validator-error');
		elem.insertAdjacentElement('afterend', errorDiv);
	}

	showSuccess(elem) {
		elem.classList.remove('error');
		elem.classList.add('success');
		if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')) {
			elem.nextElementSibling.remove();
		}
	}

	applyStyle() {
		const style = document.createElement('style');
		style.textContent = `
		input.success {
			border: 2px solid green
		}

		input.error {
			border: 2px solid red
		}

		.validator-error {
			font-size: 14px;
			color: red;
		}
		`;

		document.head.appendChild(style);
	}

	setPattern() {
		// если свойство у объекта отсутствует - добавляем
		this.pattern.phone = this.pattern.phone ? this.pattern.phone : /^\+?[78]([-()]*\d){10}$/;
		this.pattern.email = this.pattern.email ? this.pattern.email : /^\w+@\w+\.\w{2,}$/;

		console.log(this.pattern);
	}
}
