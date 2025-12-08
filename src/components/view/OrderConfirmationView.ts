import {
	OrderConfirmationViewConstructor,
	OrderConfirmationView as TOrderConfirmationView,
} from '../../types';

export class OrderConfirmationView implements TOrderConfirmationView {
	private successEl: Element;
	private totalPriceEl: Element;

	constructor({ onCloseButtonClick }: OrderConfirmationViewConstructor) {
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

		this.successEl = successEl;
		this.totalPriceEl = totalPriceEl;
	}

	getElement() {
		return this.successEl;
	}

	render(totalPrice: number | string) {
		this.totalPriceEl.textContent = `Списано ${totalPrice.toString()} синапсов`;
	}
}
