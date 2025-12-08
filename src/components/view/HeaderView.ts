import { HeaderView as THeaderView } from '../../types';
import { BaseViewElement } from '../base/BaseViewElement';

export class HeaderView extends BaseViewElement implements THeaderView {
	protected baseElement: Element;

	constructor() {
		super();
		const basketCounterEl = document.querySelector('.header__basket-counter');
		if (!basketCounterEl)
			throw new Error('HeaderView: basketCounterEl was not found');

		basketCounterEl.textContent = '0';
		this.baseElement = basketCounterEl;
	}

	public render(totalItemsCount: number) {
		this.baseElement.textContent = totalItemsCount.toString();
	}
	public reset() {
		this.baseElement.textContent = '0';
	}
}
