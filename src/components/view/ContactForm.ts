import {
	ContactsFormDetails,
	ContactsForm as TContactsForm,
} from '../../types/index';

export class ContactsForm implements TContactsForm {
	private formEl: HTMLFormElement;
	private emailInput: HTMLInputElement;
	private phoneNumberInput: HTMLInputElement;
	private errorSpan: Element;
	private submitButton: HTMLButtonElement;
	private details: Partial<ContactsFormDetails>;
	constructor({
		onSubmit,
		onPaymentDetailsChange,
	}: {
		onSubmit: (details: Partial<ContactsFormDetails>) => void;
		onPaymentDetailsChange: (details: Partial<ContactsFormDetails>) => void;
	}) {
		const formTemplate = document.querySelector(
			'#contacts'
		) as HTMLTemplateElement | null;
		if (!formTemplate) {
			throw new Error('ContactsForm: Template was not found!');
		}
		const clone = formTemplate.content.cloneNode(true) as HTMLElement;
		const formEl = clone.firstElementChild as HTMLFormElement | null;
		if (!formEl)
			throw new Error(
				'ContactsForm: form template was not found inside formTemplate!'
			);

		const emailInput = formEl.querySelector(
			'input[name="email"]'
		) as HTMLInputElement | null;
		const phoneNumberInput = formEl.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement | null;
		const errorSpan = formEl.querySelector('.form__errors');
		const submitButton = formEl.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement | null;

		if (!emailInput)
			throw new Error('populateForm: email input was not found!');
		if (!phoneNumberInput)
			throw new Error('populateForm: phone number input was not found!');
		if (!errorSpan)
			throw new Error(
				'ContactsForm: form errors element was not found inside formTemplate!'
			);
		if (!submitButton)
			throw new Error(
				'ContactsForm: submitButton was not found inside formTemplate!'
			);

		emailInput.addEventListener('change', () => {
			this.details = { ...this.details, email: emailInput.value };
			onPaymentDetailsChange(this.details);
		});
		phoneNumberInput.addEventListener('change', () => {
			this.details = { ...this.details, phoneNumber: phoneNumberInput.value };
			onPaymentDetailsChange(this.details);
		});
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			onSubmit(this.details);
		});

		this.formEl = formEl;
		this.errorSpan = errorSpan;
		this.emailInput = emailInput;
		this.phoneNumberInput = phoneNumberInput;
		this.submitButton = submitButton;
		this.details = {};
	}

	public render(details: ContactsFormDetails = { email: '', phoneNumber: '' }) {
		this.emailInput.value = details.email;
		this.phoneNumberInput.value = details.phoneNumber;
	}

	public getElement() {
		return this.formEl;
	}
	public setError(message: string) {
		this.errorSpan.textContent = message;
	}
	public setSubmitButtonStatus(isActive: boolean) {
		this.submitButton.disabled = !isActive;
	}
	public reset() {
		this.phoneNumberInput.value = '';
		this.emailInput.value = '';
		this.submitButton.disabled = true;
		this.details = {};
	}
}
