import { OrderFormDetails, OrderForm as TOrderForm } from '../../types/index';

export class OrderForm implements TOrderForm {
	private formEl: HTMLFormElement;
	private addressInput: HTMLInputElement | null;
	private cardButton: HTMLButtonElement | null;
	private cashButton: HTMLButtonElement | null;
	private errorSpan: Element | null;
	private submitButton: HTMLButtonElement | null;
	private onSubmit: (e: SubmitEvent) => void;
	constructor({ onSubmit }: { onSubmit: (e: SubmitEvent) => void }) {
		this.onSubmit = onSubmit;
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
		this.formEl = formEl;

		this.cardButton = null;
		this.cashButton = null;
		this.errorSpan = null;
		this.addressInput = null;
		this.submitButton = null;
	}

	public render(
		details: OrderFormDetails = { address: '', paymentVariant: 'Онлайн' }
	) {
		const addressInput = this.formEl.querySelector('input');
		if (!addressInput)
			throw new Error('populateForm: address input was not found!');
		const errorSpan = this.formEl.querySelector('.form__errors');
		if (!errorSpan)
			throw new Error(
				'_createForm: form errors element was not found inside formTemplate!'
			);

		const cashButton = this.formEl.querySelector(
			'.order__buttons button[name="cash"]'
		) as HTMLButtonElement | null;
		if (!cashButton)
			throw new Error(
				'_createForm: cashButton was not found inside formTemplate!'
			);

		const cardButton = this.formEl.querySelector(
			'.order__buttons button[name="card"]'
		) as HTMLButtonElement | null;
		if (!cardButton)
			throw new Error(
				'_createForm: cardButton was not found inside formTemplate!'
			);

		const submitButton = this.formEl.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement | null;
		if (!submitButton)
			throw new Error(
				'_createForm: submitButton was not found inside formTemplate!'
			);

		cardButton.addEventListener('click', () =>
			this._activatePaymentMethodButton('card')
		);
		cashButton.addEventListener('click', () =>
			this._activatePaymentMethodButton('cash')
		);
		addressInput.addEventListener('change', (e) => this._onInputChange(e));

		this.cardButton = cardButton;
		this.cashButton = cashButton;
		this.errorSpan = errorSpan;
		this.addressInput = addressInput;
		this.submitButton = submitButton;

		this.addressInput.value = details.address;
		details.paymentVariant === 'Онлайн'
			? this._activatePaymentMethodButton('card')
			: this._activatePaymentMethodButton('cash');

		this.formEl.addEventListener('submit', this.onSubmit);
	}

	public getElement() {
		return this.formEl;
	}
	public reset() {
		if (!this.addressInput) return;

		this.addressInput.value = '';
		this._activatePaymentMethodButton('card');
	}
	private _onInputChange(e: Event) {
		if (!this.addressInput || !this.submitButton) return;

		const target = e.target as HTMLInputElement | null;
		if (!target) return;

		const newValue = target.value;
		this.addressInput.value = newValue;
		this.submitButton.disabled = !newValue;
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
