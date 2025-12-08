import {
	OrderConfirmationViewConstructor,
	OrderConfirmationView as TOrderConfirmationView,
} from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения подтверждения заказа.
 * Отображает успешное оформление заказа с итоговой суммой.
 * @extends BaseElementView
 * @implements TOrderConfirmationView
 */
export class OrderConfirmationView
	extends BaseElementView
	implements TOrderConfirmationView
{
	protected baseElement;
	private totalPriceEl: Element;

	/**
	 * Создает экземпляр OrderConfirmationView.
	 * @param onCloseButtonClick - Обработчик закрытия окна подтверждения.
	 */
	constructor({ onCloseButtonClick }: OrderConfirmationViewConstructor) {
		super();
		const template = document.querySelector(
			'#success'
		) as HTMLTemplateElement | null;
		if (!template)
			throw new Error('OrderConfirmationView: template was not found!');

		const clone = template.content.cloneNode(true) as Element;
		const successEl = clone.firstElementChild as Element | null;
		if (!successEl)
			throw new Error('OrderConfirmationView: successEl was not found!');

		const closeButton = successEl.querySelector(
			'.order-success__close'
		) as HTMLButtonElement | null;
		const totalPriceEl = successEl.querySelector('.order-success__description');

		if (!totalPriceEl)
			throw new Error('OrderConfirmationView: totalPriceEl was not found!');
		if (!closeButton)
			throw new Error('OrderConfirmationView: closeButton was not found!');

		closeButton.addEventListener('click', onCloseButtonClick);

		this.baseElement = successEl;
		this.totalPriceEl = totalPriceEl;
	}

	/**
	 * Отображает подтверждение заказа с итоговой суммой.
	 * @param totalPrice - Итоговая сумма заказа.
	 */
	public render(totalPrice: number) {
		this.totalPriceEl.textContent = `Списано ${totalPrice.toString()} синапсов`;
	}
}
