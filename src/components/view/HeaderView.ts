import { HeaderView as THeaderView } from '../../types';

export class HeaderView implements THeaderView {
	basketCounterEl: Element;

	constructor() {
		const basketCounterEl = document.querySelector('.header__basket-counter');
		if (!basketCounterEl)
			throw new Error('HeaderView: basketCounterEl was not found');

		basketCounterEl.textContent = '0';
		this.basketCounterEl = basketCounterEl;
	}

	public render(totalItemsCount: number) {
		this.basketCounterEl.textContent = totalItemsCount.toString();
	}
	public reset() {
		this.basketCounterEl.textContent = '0';
	}
	public getElement() {
		this.basketCounterEl;
	}
}
