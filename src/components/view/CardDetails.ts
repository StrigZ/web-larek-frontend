import {
	CardDetails as TCardDetails,
	Product,
	CardDetailsConstructor,
} from '../../types';
import { CDN_URL } from '../../utils/constants';
import { BaseElementView } from '../base/BaseElementView';

/**
 * Класс отображения детальной информации о товаре.
 * Отображает полную информацию о товаре в модальном окне.
 * @extends BaseElementView
 * @implements TCardDetails
 */
export class CardDetails extends BaseElementView implements TCardDetails {
	protected baseElement;
	private titleEl: Element;
	private categoryEl: Element;
	private imageEl: HTMLImageElement;
	private priceEl: Element;
	private descriptionEl: Element;

	/**
	 * Создает экземпляр CardDetails.
	 * @param onBasketAdd - Обработчик добавления товара в корзину.
	 */
	constructor({ onBasketAdd }: CardDetailsConstructor) {
		super();

		// Инициализация шаблона
		const cardDetailsTemplate = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement | null;
		if (!cardDetailsTemplate)
			throw new Error('CardDetails: template not found');

		const clone = cardDetailsTemplate.content.cloneNode(true) as Element;
		const cardDetailsEl = clone.firstElementChild;
		if (!cardDetailsEl) throw new Error('CardDetails: element not found');

		// Поиск DOM-элементов
		const addToBasketButton = cardDetailsEl.querySelector('.card__row button');
		const titleEl = cardDetailsEl.querySelector('.card__title');
		const categoryEl = cardDetailsEl.querySelector('.card__category');
		const imageEl = cardDetailsEl.querySelector(
			'.card__image'
		) as HTMLImageElement;
		const priceEl = cardDetailsEl.querySelector('.card__price');
		const descriptionEl = cardDetailsEl.querySelector('.card__text');

		// Валидация элементов
		if (!titleEl) throw new Error('CardDetails: titleEl not found');
		if (!categoryEl) throw new Error('CardDetails: categoryEl not found');
		if (!imageEl) throw new Error('CardDetails: imageEl not found');
		if (!priceEl) throw new Error('CardDetails: priceEl not found');
		if (!descriptionEl) throw new Error('CardDetails: descriptionEl not found');
		if (!addToBasketButton)
			throw new Error('CardDetails: addToBasketButton not found');

		// Настройка обработчиков
		addToBasketButton.addEventListener('click', onBasketAdd);

		// Сохранение ссылок
		this.titleEl = titleEl;
		this.categoryEl = categoryEl;
		this.imageEl = imageEl;
		this.priceEl = priceEl;
		this.descriptionEl = descriptionEl;
		this.baseElement = cardDetailsEl;
	}

	/**
	 * Отображает информацию о товаре.
	 * @param product - Данные товара для отображения.
	 */
	public render({ category, description, image, price, title }: Product) {
		this.titleEl.textContent = title;
		this.categoryEl.textContent = category;
		this.imageEl.src = `${CDN_URL}${image}`;
		this.priceEl.textContent = price
			? `${price.toString()} синапсов`
			: 'Бесценно';
		this.descriptionEl.textContent = description;
	}
}
