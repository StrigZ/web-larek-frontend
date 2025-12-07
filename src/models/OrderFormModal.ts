import { Modal } from '../modules/modal';
import {
	ModalConfig,
	OrderForm,
	OrderModalConstructor,
	OrderFormModal as TOrderFormModal,
} from '../types/index';

export class OrderFormModal extends Modal implements TOrderFormModal {
	private modal: Element;
	private formTemplate: HTMLTemplateElement;
	private form: HTMLFormElement | null;
	private addressInput: HTMLInputElement | null;
	private cardButton: HTMLButtonElement | null;
	private cashButton: HTMLButtonElement | null;
	private errorSpan: Element | null;
	private submitButton: HTMLButtonElement | null;
	constructor({ modal, formTemplate, ...modalConfig }: OrderModalConstructor) {
		super(modalConfig);
		this.modal = modal;
		this.formTemplate = formTemplate;
		this.form = null;
		this.cardButton = null;
		this.cashButton = null;
		this.errorSpan = null;
		this.addressInput = null;
		this.submitButton = null;
	}

	public showOrder() {
		super.showModal(this.modal);
	}
	public hideOrder() {
		super.closeModal(this.modal);
	}

	public populateOrderForm(details: OrderForm) {
		if (!this.addressInput)
			throw new Error('populateForm: order form does not exits!');

		this.addressInput.value = details.address;
		details.paymentVariant === 'Онлайн'
			? this._activatePaymentMethodButton('card')
			: this._activatePaymentMethodButton('cash');
	}

	private _getPaymentMethod() {
		if (!this.cardButton) return;

		return this.cardButton.classList.contains('button_alt-active')
			? 'Онлайн'
			: 'При получении';
	}
	private _showAddressInputError() {
		if (!this.errorSpan) return;

		this.errorSpan.textContent = 'Адрес не может быть пустым!';
	}
	private _resetAddressInputError() {
		if (!this.errorSpan) return;

		this.errorSpan.textContent = '';
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

	public static initOrderFormModal({
		modalConfig,
		queries,
	}: {
		queries: {
			modal: string;
			formTemplate: string;
		};
		modalConfig: ModalConfig;
	}) {
		const modal = document.querySelector(queries.modal);
		if (!modal)
			throw new Error('initOrderFormModal: Order modal was not found!');
		const formTemplate = document.querySelector(
			queries.formTemplate
		) as HTMLTemplateElement | null;
		if (!formTemplate)
			throw new Error('initOrderFormModal:formTemplate was not found!');

		const orderFormModal = new OrderFormModal({
			modal,
			formTemplate,
			...modalConfig,
		});
		orderFormModal._replaceFormInModal(orderFormModal._createForm());
		orderFormModal._attachClickListeners();
		orderFormModal._attachFormSubmitListener();

		return orderFormModal;
	}
	private _replaceFormInModal(newForm: HTMLFormElement) {
		const currentForm = this.modal.querySelector('form');
		if (!currentForm)
			throw new Error('_replaceFormInModal: Current form was not found!');

		currentForm.replaceWith(newForm);
	}
	private _attachClickListeners() {
		super.attachListeners(this.modal, () => this.events.emit('order:close'));
	}
	private _createForm() {
		const formFragment = this.formTemplate.content.cloneNode(
			true
		) as DocumentFragment;
		const formEl = formFragment.querySelector('form');
		if (!formEl)
			throw new Error(
				'_createForm: form element was not found inside formTemplate!'
			);
		this.form = formEl;

		const addressInput = this.form.querySelector('input');
		if (!addressInput)
			throw new Error('populateForm: address input was not found!');
		const errorSpan = formEl.querySelector('.form__errors');
		if (!errorSpan)
			throw new Error(
				'_createForm: form errors element was not found inside formTemplate!'
			);

		const cashButton = formEl.querySelector(
			'.order__buttons button[name="cash"]'
		) as HTMLButtonElement | null;
		if (!cashButton)
			throw new Error(
				'_createForm: cashButton was not found inside formTemplate!'
			);

		const cardButton = formEl.querySelector(
			'.order__buttons button[name="card"]'
		) as HTMLButtonElement | null;
		if (!cardButton)
			throw new Error(
				'_createForm: cardButton was not found inside formTemplate!'
			);

		const submitButton = formEl.querySelector(
			'button[type="submit"'
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
		this.form = formEl;

		return formEl;
	}
	private _attachFormSubmitListener() {
		if (!this.form) return;

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this._resetAddressInputError();
			const form = e.currentTarget as HTMLFormElement | null;
			if (!form) return;

			const formData = new FormData(form);
			const formObject = Object.fromEntries(formData) as Partial<OrderForm>;

			if (!formObject.address) {
				return this._showAddressInputError();
			}

			this.events.emit('order:submit', {
				details: {
					address: formObject.address,
					paymentVariant: this._getPaymentMethod(),
				},
			});
		});
	}
}
