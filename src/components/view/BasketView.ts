import { BasketViewConstructor, BasketView as TBasketView } from '../../types';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения корзины покупок.
 * Отображает список товаров в корзине, общую стоимость и кнопку оформления заказа.
 * @extends BaseElementView
 * @implements TBasketView
 */
export class BasketView extends BaseElementView implements TBasketView {
	protected baseElement;
	private itemListEl: Element;
	private totalPriceEl: Element;
	private goToOrderButton: HTMLButtonElement;

	/**
	 * Создает экземпляр BasketView.
	 * @param onStartOrder - Обработчик начала оформления заказа.
	 * @param onBasketOpen - Обработчик открытия корзины.
	 */
	constructor({ onStartOrder, onBasketOpen }: BasketViewConstructor) {
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
		this.itemListEl = itemListEl;
		this.totalPriceEl = totalPriceEl;
		this.goToOrderButton = goToOrderButton;
	}

	/**
	 * Отображает корзину с товарами.
	 * @param products - Массив элементов.
	 * @param total - Общая стоимость корзины.
	 */
	public render({ products, total }: { products: Element[]; total: number }) {
		this.itemListEl.innerHTML = '';

		if (total > 0) {
			// Отображение товаров в корзине
			products.forEach((product) => {
				return this.itemListEl.append(product);
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
}
