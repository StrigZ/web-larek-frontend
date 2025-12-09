import { Product } from '../../types';

/**
 * Класс для создания элементов товаров в корзине.
 * Генерирует DOM-элементы для отображения товаров в корзине.
 */
export class BasketItemView {
	private template: HTMLTemplateElement;
	private onDelete: (product: Product) => void;

	/**
	 * Создает экземпляр BasketItemView.
	 * @param onDelete - Обработчик удаления товара из корзины.
	 */
	constructor({ onDelete }: { onDelete: (product: Product) => void }) {
		const template = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement | null;
		if (!template) throw new Error('BasketItemView: template was not found!');

		this.template = template;
		this.onDelete = onDelete;
	}

	/**
	 * Создает массив DOM-элементов товаров для корзины.
	 * @param products - Массив товаров для отображения.
	 * @returns Массив DOM-элементов товаров.
	 */
	public createBasketItems(products: Product[]) {
		const basketItemsView: Element[] = [];
		products.forEach((item, i) =>
			basketItemsView.push(this.createBasketItem(item, (i + 1).toString()))
		);
		return basketItemsView;
	}

	/**
	 * Создает DOM-элемент для одного товара в корзине.
	 * @param product - Данные товара.
	 * @param index - Порядковый номер товара.
	 * @returns DOM-элемент товара.
	 */
	public createBasketItem(product: Product, index: string) {
		const clone = this.template.content.cloneNode(true) as DocumentFragment;
		const basketItem = clone.firstElementChild;

		if (!basketItem)
			throw new Error(
				'BasketItemView: basketItem was not found inside template!'
			);

		const { title, price } = product;
		const titleEl = basketItem.querySelector('.card__title');
		const priceEl = basketItem.querySelector('.card__price');
		const deleteButton = basketItem.querySelector('.basket__item-delete');
		const indexEl = basketItem.querySelector('.basket__item-index');
		if (!indexEl || !priceEl || !titleEl || !deleteButton) {
			throw new Error('Required basketItem elements not found');
		}

		// Заполнение данными
		titleEl.textContent = title;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
		indexEl.textContent = index;
		// Обработчик удаления товара
		deleteButton.addEventListener('click', () => this.onDelete(product));

		return basketItem;
	}
}
