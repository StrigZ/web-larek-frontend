import {
	CardDetails as TCardDetails,
	Product,
	CardDetailsConstructor,
} from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardDetails implements TCardDetails {
	private cardDetailsEl: Element;
	private titleEl: Element;
	private categoryEl: Element;
	private imageEl: HTMLImageElement;
	private priceEl: Element;
	private descriptionEl: Element;

	constructor({ onBasketAdd }: CardDetailsConstructor) {
		const cardDetailsTemplate = document.querySelector(
			'#card-preview'
		) as HTMLTemplateElement | null;
		if (!cardDetailsTemplate)
			throw new Error('Preview: preview template was not found!');

		const clone = cardDetailsTemplate.content.cloneNode(true) as Element;
		const cardDetailsEl = clone.firstElementChild;
		if (!cardDetailsEl)
			throw new Error(
				'Preview: preview was not found inside preview template!'
			);

		const addToBasketButton = cardDetailsEl.querySelector('.card__row button');
		const titleEl = cardDetailsEl.querySelector('.card__title');
		const categoryEl = cardDetailsEl.querySelector('.card__category');
		const imageEl = cardDetailsEl.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		const priceEl = cardDetailsEl.querySelector('.card__price');
		const descriptionEl = cardDetailsEl.querySelector('.card__text');

		if (!titleEl) {
			throw new Error('CardDetails: titleEl was not found!');
		}
		if (!categoryEl) {
			throw new Error('CardDetails: categoryEl was not found!');
		}
		if (!imageEl) {
			throw new Error('CardDetails: imageEl was not found!');
		}
		if (!priceEl) {
			throw new Error('CardDetails: priceEl was not found!');
		}
		if (!descriptionEl) {
			throw new Error('CardDetails: descriptionEl was not found!');
		}
		if (!addToBasketButton) {
			throw new Error('CardDetails: addToBasketButton was not found!');
		}

		addToBasketButton.addEventListener('click', onBasketAdd);

		this.titleEl = titleEl;
		this.categoryEl = categoryEl;
		this.imageEl = imageEl;
		this.priceEl = priceEl;
		this.descriptionEl = descriptionEl;
		this.cardDetailsEl = cardDetailsEl;
	}

	public getElement() {
		return this.cardDetailsEl;
	}

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
