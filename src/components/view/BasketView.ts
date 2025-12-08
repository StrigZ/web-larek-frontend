import {
	BasketViewConstructor,
	Product,
	BasketView as TBasketView,
} from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения корзины покупок.
 * Отображает список товаров в корзине, общую стоимость и кнопку оформления заказа.
 * @extends BaseElementView
 * @implements TBasketView
 */
export class BasketView extends BaseElementView implements TBasketView {
	protected baseElement;
	private cardTemplateEl: HTMLTemplateElement;
	private itemListEl: Element;
	private totalPriceEl: Element;
	private goToOrderButton: HTMLButtonElement;
	private onBasketItemRemove: (product: Product) => void;

	/**
	 * Создает экземпляр BasketView.
	 * @param onStartOrder - Обработчик начала оформления заказа.
	 * @param onBasketItemRemove - Обработчик удаления товара из корзины.
	 * @param onBasketOpen - Обработчик открытия корзины.
	 */
	constructor({
		onStartOrder,
		onBasketItemRemove,
		onBasketOpen,
	}: BasketViewConstructor) {
		super();
		// Инициализация DOM-элементов
		const basketTemplate = document.querySelector(
			'#basket'
		) as HTMLTemplateElement | null;
		if (!basketTemplate)
			throw new Error('BasketView: basket template was not found!');

		const clone = basketTemplate.content.cloneNode(true) as Element;
		const basketEl = clone.firstElementChild as Element | null;
		if (!basketEl)
			throw new Error(
				'BaksteView: basket was not found inside basket template '
			);

		const cardTemplateEl = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('initBasketModal: Basket card template  was not found!');
		}

		const itemListEl = basketEl.querySelector('.basket__list');
		const totalPriceEl = basketEl.querySelector('.basket__price');
		const openBasketButton = document.querySelector(
			'.header__basket'
		) as HTMLButtonElement | null;
		const goToOrderButton = basketEl.querySelector(
			'.modal__actions .button'
		) as HTMLButtonElement | null;

		// Валидация DOM-элементов
		if (!goToOrderButton)
			throw new Error('initBasketView: goToOrderButton was not found!');
		if (!openBasketButton)
			throw new Error(
				'initBasketView: open basket button element was not found!'
			);
		if (!totalPriceEl)
			throw new Error(
				'initBasketView: Basket total price element was not found!'
			);
		if (!itemListEl)
			throw new Error(
				'initBasketView: Basket item list element was not found!'
			);

		// Начальное состояние
		itemListEl.innerHTML = 'Корзина пуста!';
		totalPriceEl.textContent = '0 синапсов';
		goToOrderButton.disabled = true;

		// Подписка на события
		goToOrderButton.addEventListener('click', onStartOrder);
		openBasketButton.addEventListener('click', onBasketOpen);

		// Сохранение ссылок на элементы
		this.baseElement = basketEl;
		this.cardTemplateEl = cardTemplateEl;
		this.itemListEl = itemListEl;
		this.totalPriceEl = totalPriceEl;
		this.goToOrderButton = goToOrderButton;
		this.onBasketItemRemove = onBasketItemRemove;
	}

	/**
	 * Отображает корзину с товарами.
	 * @param productsMap - Карта товаров и их количества.
	 * @param productsArray - Массив товаров в корзине.
	 * @param total - Общая стоимость корзины.
	 */
	public render({
		productsArray,
		productsMap,
		total,
	}: {
		productsMap: Map<string, number>;
		productsArray: Product[];
		total: number;
	}) {
		this.itemListEl.innerHTML = '';
		const uniqueItemsArray = Array.from(new Set(productsArray));

		if (total > 0) {
			// Отображение товаров в корзине
			uniqueItemsArray.forEach((product) => {
				const index = productsMap.get(product.id);
				if (!index) return;

				return this.itemListEl.append(
					this._createBasketItem(product, index.toString())
				);
			});

			this.totalPriceEl.textContent = `${total.toString()} синапсов`;
			this.goToOrderButton.disabled = false;
		} else {
			// Отображение пустой корзины
			this.totalPriceEl.textContent = '0 синапсов';
			this.itemListEl.textContent = 'Корзина пуста!';
			this.goToOrderButton.disabled = true;
		}
	}

	/**
	 * Создает DOM-элемент товара в корзине.
	 * @private
	 * @param data - Данные товара.
	 * @param index - Индекс/количество товара.
	 * @returns DOM-элемент товара.
	 */
	private _createBasketItem(data: Product, index: string) {
		const { price, title } = data;
		const card = this.cardTemplateEl.content.cloneNode(
			true
		) as DocumentFragment;
		const titleEl = card.querySelector('.card__title');
		const priceEl = card.querySelector('.card__price');
		const indexEl = card.querySelector('.basket__item-index');
		const deleteButton = card.querySelector('.basket__item-delete');

		if (!indexEl || !priceEl || !titleEl || !deleteButton) {
			throw new Error('Required card elements not found');
		}

		const cardElement = card.querySelector('.card') as HTMLElement;

		// Заполнение данными
		titleEl.textContent = title;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
		indexEl.textContent = index;

		// Обработчик удаления товара
		deleteButton.addEventListener('click', () => this.onBasketItemRemove(data));

		return cardElement;
	}
}
