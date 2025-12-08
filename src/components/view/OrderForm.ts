import {
	OrderFormConstructor,
	OrderFormDetails,
	OrderForm as TOrderForm,
} from '../../types/index';
import { BaseFormView } from '../base/BaseFormView';

/**
 * Класс формы оформления заказа.
 * Обрабатывает ввод адреса и выбор способа оплаты.
 * @extends BaseFormView
 * @implements TOrderForm
 */
export class OrderForm extends BaseFormView implements TOrderForm {
	protected baseElement: HTMLFormElement;
	protected errorContainer: Element;
	protected submitButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private cardButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;
	private details: OrderFormDetails;

	/**
	 * Создает экземпляр OrderForm.
	 * @param onSubmit - Обработчик отправки формы.
	 * @param onOrderDetailsChange - Обработчик изменения данных формы.
	 */
	constructor({ onSubmit, onOrderDetailsChange }: OrderFormConstructor) {
		super();
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
		const errorContainer = formEl.querySelector('.form__errors');
		if (!errorContainer)
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

		this.baseElement = formEl;
		this.cardButton = cardButton;
		this.cashButton = cashButton;
		this.errorContainer = errorContainer;
		this.addressInput = addressInput;
		this.submitButton = submitButton;
		this.details = { address: '', paymentVariant: 'Онлайн' };
	}

	/**
	 * Отображает форму с переданными данными.
	 * @param details - Данные заказа для заполнения формы.
	 */
	public render(details: OrderFormDetails) {
		this.addressInput.value = details.address;
		details.paymentVariant === 'Онлайн'
			? this._activatePaymentMethodButton('card')
			: this._activatePaymentMethodButton('cash');
	}

	/**
	 * Сбрасывает форму к исходному состоянию.
	 */
	public reset() {
		this.addressInput.value = '';
		this.submitButton.disabled = true;
		this.details = { address: '', paymentVariant: 'Онлайн' };
		this._activatePaymentMethodButton('card');
	}

	/**
	 * Активирует кнопку выбранного способа оплаты.
	 * @private
	 * @param name - Название способа оплаты ('cash' или 'card').
	 */
	private _activatePaymentMethodButton(name: 'cash' | 'card') {
		if (!this.cardButton || !this.cashButton) return;

		this.cardButton.classList.remove('button_alt-active');
		this.cashButton.classList.remove('button_alt-active');

		name === 'cash'
			? this.cashButton.classList.add('button_alt-active')
			: this.cardButton.classList.add('button_alt-active');
	}
}
