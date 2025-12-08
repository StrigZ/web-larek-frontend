import { HeaderView as THeaderView } from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения шапки приложения.
 * Отображает счетчик товаров в корзине в шапке сайта.
 * @extends BaseElementView
 * @implements THeaderView
 */
export class HeaderView extends BaseElementView implements THeaderView {
	protected baseElement;

	constructor() {
		super();
		const basketCounterEl = document.querySelector('.header__basket-counter');
		if (!basketCounterEl)
			throw new Error('HeaderView: basketCounterEl was not found');

		basketCounterEl.textContent = '0';
		this.baseElement = basketCounterEl;
	}

	/**
	 * Обновляет счетчик товаров в корзине.
	 * @param totalItemsCount - Общее количество товаров в корзине.
	 */
	public render(totalItemsCount: number) {
		this.baseElement.textContent = totalItemsCount.toString();
	}

	/**
	 * Сбрасывает счетчик корзины.
	 */
	public reset() {
		this.baseElement.textContent = '0';
	}
}
