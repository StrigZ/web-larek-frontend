export class OrderConfirmationView {
	private successEl: Element;
	private totalPriceEl: Element;
	constructor({ onCloseButtonClick }: { onCloseButtonClick: () => void }) {
		const template = document.querySelector(
			'#success'
		) as HTMLTemplateElement | null;
		if (!template)
			throw new Error('OrderConfirmationView: template was not found!');
		const clone = template.content.cloneNode(true) as Element;
		const successEl = clone.firstElementChild as Element | null;
		if (!successEl)
			throw new Error('OrderConfirmationView: successEl was not found!');

		const totalPriceEl = successEl.querySelector('.order-success__description');
		if (!totalPriceEl)
			throw new Error('OrderConfirmationView: totalPriceEl was not found!');
		const closeButton = successEl.querySelector(
			'.order-success__close'
		) as HTMLButtonElement | null;
		if (!closeButton)
			throw new Error('OrderConfirmationView: closeButton was not found!');

		closeButton.addEventListener('click', onCloseButtonClick);

		this.successEl = successEl;
		this.totalPriceEl = totalPriceEl;
	}
	render(totalPrice: number | string) {
		const isPriceless = typeof totalPrice == 'string';
		this.totalPriceEl.textContent = isPriceless
			? 'Бесценно'
			: `Списано ${totalPrice.toString()} синапсов`;
	}

	getElement() {
		return this.successEl;
	}
}
