import { EventEmitter } from '../components/base/events';
import { ModalManager } from '../modules/modal';
import {
	BasketViewModel,
	BasketViewModelConfig,
	BasketViewModelConstructor,
	Product,
} from '../types';
import { Catalog } from './Catalog';

export class BasketView implements BasketViewModel {
	modal: Element;
	events: EventEmitter;
	items: Map<Product['id'], number>;
	modalManager: ModalManager;
	catalog: Catalog<Product>;
	cardTemplateEl: HTMLTemplateElement;
	itemListEl: Element;
	totalPriceEl: Element;
	constructor({
		modal,
		events,
		items,
		modalManager,
		itemListEl,
		totalPriceEl,
		cardTemplateEl,
		catalog,
	}: BasketViewModelConstructor) {
		this.modal = modal;
		this.items = items;
		this.events = events;
		this.catalog = catalog;
		this.modalManager = modalManager;
		this.itemListEl = itemListEl;
		this.totalPriceEl = totalPriceEl;
		this.cardTemplateEl = cardTemplateEl;
	}

	showBasket() {
		this.modalManager.showModal(this.modal);
	}
	hideBasket() {
		this.modalManager.closeModal(this.modal);
	}
	updateBasket() {
		this.itemListEl.innerHTML = '';
		const basketItemsArray = Array.from(this.items);
		let totalPrice = 0;
		let isPriceless = false;
		if (basketItemsArray.length > 0) {
			basketItemsArray.forEach(([id, index]) => {
				const item = this.catalog.getItemById(id);
				if (item.price && !isPriceless) {
					totalPrice += item.price * index;
				} else {
					isPriceless = true;
				}

				return this.itemListEl.append(
					this._createBasketItem(item, index.toString())
				);
			});
			this.totalPriceEl.textContent = isPriceless
				? 'Бесценно'
				: totalPrice.toString();
		} else {
			this.itemListEl.textContent = 'Корзина пуста!';
		}
	}

	private _createBasketItem(data: Product, index: string) {
		const { price, title, id } = data;
		const card = this.cardTemplateEl.content.cloneNode(
			true
		) as DocumentFragment;
		const titleEl = card.querySelector('.card__title');
		const priceEl = card.querySelector('.card__price');
		const indexEl = card.querySelector('.basket__item-index');
		const deleteButton = card.querySelector('.basket__item-delete  ');
		if (!indexEl || !priceEl || !titleEl || !deleteButton) {
			throw new Error('Required card elements not found');
		}
		const cardElement = card.querySelector('.card') as HTMLElement;

		titleEl.textContent = title;
		priceEl.textContent = price ? `${price.toString()} синапсов` : 'Бесценно';
		indexEl.textContent = index;
		deleteButton.addEventListener('click', () =>
			this.events.emit('basket:remove', { id })
		);
		return cardElement;
	}

	public static initBasketView({
		queries: {
			basketModalQuery,
			cardTemplateQuery,
			itemListQuery,
			totalPriceQuery,
		},
		config,
	}: {
		queries: {
			basketModalQuery: string;
			cardTemplateQuery: string;
			itemListQuery: string;
			totalPriceQuery: string;
		};
		config: BasketViewModelConfig;
	}) {
		const modal = document.querySelector(basketModalQuery);
		if (!modal) {
			throw new Error('initBasketView: Basket modal was not found!');
		}
		const cardTemplateEl = document.querySelector(
			cardTemplateQuery
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('initBasketView: Basket card template  was not found!');
		}
		const itemListEl = modal.querySelector(itemListQuery);
		if (!itemListEl) {
			throw new Error(
				'initBasketView: Basket item list element was not found!'
			);
		}
		const totalPriceEl = modal.querySelector(totalPriceQuery);
		if (!totalPriceEl) {
			throw new Error(
				'initBasketView: Basket total price element was not found!'
			);
		}

		itemListEl.innerHTML = 'Корзина пуста!';
		totalPriceEl.textContent = '0 синапсов';

		return new BasketView({
			modal,
			itemListEl,
			totalPriceEl,
			cardTemplateEl,
			...config,
		});
	}
}
