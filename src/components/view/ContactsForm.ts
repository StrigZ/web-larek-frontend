import {
	ContactsFormConstructor,
	ContactsFormDetails,
	ContactsForm as TContactsForm,
} from '../../types/index';
import { BaseFormView } from '../base/BaseFormView';

/**
 * Класс формы контактных данных для оформления заказа.
 * Обрабатывает ввод email и номера телефона с валидацией.
 * @extends BaseFormView
 * @implements TContactsForm
 */
export class ContactsForm extends BaseFormView implements TContactsForm {
	protected baseElement;
	protected submitButton;
	protected errorContainer;
	private emailInput: HTMLInputElement;
	private phoneNumberInput: HTMLInputElement;
	private details: ContactsFormDetails;

	/**
	 * Создает экземпляр ContactsForm.
	 * @param onSubmit - Обработчик отправки формы.
	 * @param onOrderDetailsChange - Обработчик изменения данных формы.
	 */
	constructor({ onSubmit, onOrderDetailsChange }: ContactsFormConstructor) {
		super();

		// Инициализация шаблона формы
		const formTemplate = document.querySelector(
			'#contacts'
		) as HTMLTemplateElement | null;
		if (!formTemplate) throw new Error('ContactsForm: template not found');

		const clone = formTemplate.content.cloneNode(true) as HTMLElement;
		const formEl = clone.firstElementChild as HTMLFormElement;
		if (!formEl) throw new Error('ContactsForm: form element not found');

		// Поиск элементов формы
		const emailInput = formEl.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneNumberInput = formEl.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		const errorContainer = formEl.querySelector('.form__errors');
		const submitButton = formEl.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		// Валидация элементов
		if (!emailInput) throw new Error('ContactsForm: email input not found');
		if (!phoneNumberInput)
			throw new Error('ContactsForm: phone input not found');
		if (!errorContainer)
			throw new Error('ContactsForm: error container not found');
		if (!submitButton) throw new Error('ContactsForm: submit button not found');

		// Настройка обработчиков событий
		emailInput.addEventListener('change', () => {
			this.details = { ...this.details, email: emailInput.value };
			onOrderDetailsChange(this.details);
		});

		phoneNumberInput.addEventListener('change', () => {
			this.details = { ...this.details, phoneNumber: phoneNumberInput.value };
			onOrderDetailsChange(this.details);
		});

		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			onSubmit(this.details);
		});

		// Сохранение ссылок на элементы
		this.baseElement = formEl;
		this.errorContainer = errorContainer;
		this.emailInput = emailInput;
		this.phoneNumberInput = phoneNumberInput;
		this.submitButton = submitButton;
		this.details = { email: '', phoneNumber: '' };
	}

	/**
	 * Отображает форму с переданными данными.
	 * @param details - Контактные данные для заполнения формы.
	 */
	public render(details: ContactsFormDetails) {
		this.emailInput.value = details.email;
		this.phoneNumberInput.value = details.phoneNumber;
	}

	/**
	 * Сбрасывает форму к исходному состоянию.
	 */
	public reset() {
		this.phoneNumberInput.value = '';
		this.emailInput.value = '';
		this.submitButton.disabled = true;
		this.details = { email: '', phoneNumber: '' };
	}
}
