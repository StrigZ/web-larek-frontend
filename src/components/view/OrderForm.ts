import { OrderFormDetails, OrderForm as TOrderForm } from '../../types/index';

export class OrderForm implements TOrderForm {
	private formEl: HTMLFormElement;
	private addressInput: HTMLInputElement;
	private cardButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;
	private errorSpan: Element;
	private submitButton: HTMLButtonElement;
	private details: OrderFormDetails;
	constructor({
		onSubmit,
		onOrderDetailsChange,
	}: {
		onSubmit: (details: OrderFormDetails) => void;
		onOrderDetailsChange: (details: OrderFormDetails) => void;
	}) {
		const formTemplate = document.querySelector(
			'#order'
		) as HTMLTemplateElement | null;
		if (!formTemplate) {
			throw new Error('OrderForm: Template was not found!');
		}
		const clone = formTemplate.content.cloneNode(true) as HTMLElement;
		const formEl = clone.firstElementChild as HTMLFormElement | null;
		if (!formEl)
			throw new Error(
				'OrderForm: form template was not found inside formTemplate!'
			);

		const addressInput = formEl.querySelector('input');
		if (!addressInput)
			throw new Error('populateForm: address input was not found!');
		const errorSpan = formEl.querySelector('.form__errors');
		if (!errorSpan)
			throw new Error(
				'OrderForm: form errors element was not found inside formTemplate!'
			);

		const cashButton = formEl.querySelector(
			'.order__buttons button[name="cash"]'
		) as HTMLButtonElement | null;
		if (!cashButton)
			throw new Error(
				'OrderForm: cashButton was not found inside formTemplate!'
			);

		const cardButton = formEl.querySelector(
			'.order__buttons button[name="card"]'
		) as HTMLButtonElement | null;
		if (!cardButton)
			throw new Error(
				'OrderForm: cardButton was not found inside formTemplate!'
			);

		const submitButton = formEl.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement | null;
		if (!submitButton)
			throw new Error(
				'OrderForm: submitButton was not found inside formTemplate!'
			);

		cardButton.addEventListener('click', () => {
			this._activatePaymentMethodButton('card');
			this.details = { ...this.details, paymentVariant: 'Онлайн' };
			onOrderDetailsChange(this.details);
		});
		cashButton.addEventListener('click', () => {
			this._activatePaymentMethodButton('cash');
			this.details = { ...this.details, paymentVariant: 'При получении' };
			onOrderDetailsChange(this.details);
		});
		addressInput.addEventListener('change', (e) => {
			const target = e.target as HTMLInputElement | null;
			if (!target) return;

			this.details = { ...this.details, address: target.value };
			onOrderDetailsChange(this.details);
		});
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			onSubmit(this.details);
		});

		this.formEl = formEl;
		this.cardButton = cardButton;
		this.cashButton = cashButton;
		this.errorSpan = errorSpan;
		this.addressInput = addressInput;
		this.submitButton = submitButton;
		this.details = { address: '', paymentVariant: 'Онлайн' };
	}

	public render(details: OrderFormDetails) {
		this.addressInput.value = details.address;
		details.paymentVariant === 'Онлайн'
			? this._activatePaymentMethodButton('card')
			: this._activatePaymentMethodButton('cash');
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
		this.addressInput.value = '';
		this.submitButton.disabled = true;
		this.details = { address: '', paymentVariant: 'Онлайн' };
		this._activatePaymentMethodButton('card');
	}

	private _activatePaymentMethodButton(name: 'cash' | 'card') {
		if (!this.cardButton || !this.cashButton) return;

		this.cardButton.classList.remove('button_alt-active');
		this.cashButton.classList.remove('button_alt-active');

		name === 'cash'
			? this.cashButton.classList.add('button_alt-active')
			: this.cardButton.classList.add('button_alt-active');
	}
}
