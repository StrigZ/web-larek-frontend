import { BasketViewItemConstructor, Product } from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения элементов корзины.
 * @extends BaseElementView
 */
export class BasketItemView extends BaseElementView {
	protected baseElement: Element;
	private onDelete: (product: Product) => void;

	private static template: HTMLTemplateElement | null;

	/**
	 * Создает экземпляр BasketItemView.
	 * @param onDelete - Обработчик удаления товара из корзины.
	 */
	constructor({ onDelete }: BasketViewItemConstructor) {
		super();

		// Если шаблона нет в кеше, то кешируем его
		if (!BasketItemView.template) {
			const template = document.querySelector(
				'#card-basket'
			) as HTMLTemplateElement | null;
			if (!template) throw new Error('BasketItemView: template was not found!');
			BasketItemView.template = template;
		}

		const clone = BasketItemView.template.content.cloneNode(
			true
		) as DocumentFragment;
		const basketItem = clone.firstElementChild;
		if (!basketItem)
			throw new Error(
				'BasketItemView: basketItem was not found inside template!'
			);

		this.onDelete = onDelete;
		this.baseElement = basketItem;
	}

	/**
	 * Отрисовывает элемент.
	 * @param product - Данные товара.
	 * @param index - Порядковый номер товара.
	 */
	public render(product: Product, index: string) {
		const { title, price } = product;
		const titleEl = this.baseElement.querySelector('.card__title');
		const priceEl = this.baseElement.querySelector('.card__price');
		const deleteButton = this.baseElement.querySelector('.basket__item-delete');
		const indexEl = this.baseElement.querySelector('.basket__item-index');
		if (!indexEl || !priceEl || !titleEl || !deleteButton) {
			throw new Error('Required basketItem elements not found');
		}

		// Заполнение данными
		titleEl.textContent = title;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
		indexEl.textContent = index;
		// Обработчик удаления товара
		deleteButton.addEventListener('click', () => this.onDelete(product));
	}
}
