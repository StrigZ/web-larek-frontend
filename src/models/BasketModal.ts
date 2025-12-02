import { EventEmitter } from '../components/base/events';
import { Modal } from '../modules/modal';
import {
	BasketModalConfig,
	BasketModalConstructor,
	Product,
	ModalConfig,
} from '../types';
import { Catalog } from './Catalog';

export class BasketModal extends Modal implements BasketModal {
	private modal: Element;
	private events: EventEmitter;
	private items: Map<Product['id'], number>;
	private catalog: Catalog<Product>;
	private cardTemplateEl: HTMLTemplateElement;
	private itemListEl: Element;
	private totalPriceEl: Element;
	constructor({
		modal,
		events,
		items,
		itemListEl,
		totalPriceEl,
		cardTemplateEl,
		catalog,
		...modalConfig
	}: BasketModalConstructor) {
		super(modalConfig);
		this.modal = modal;
		this.items = items;
		this.events = events;
		this.catalog = catalog;
		this.itemListEl = itemListEl;
		this.totalPriceEl = totalPriceEl;
		this.cardTemplateEl = cardTemplateEl;

		super.attachListeners(this.modal, () => this.events.emit('basket:close'));
	}

	showModal() {
		super.showModal(this.modal);
	}
	closeModal() {
		super.closeModal(this.modal);
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

	public static initBasketModal({
		queries,
		config,
		modalConfig,
	}: {
		queries: {
			modal: string;
			itemList: string;
			totalPrice: string;
			cardTemplate: string;
		};
		config: BasketModalConfig;
		modalConfig: ModalConfig;
	}) {
		const modal = document.querySelector(queries.modal);
		if (!modal) {
			throw new Error('initBasketModal: Basket modal was not found!');
		}
		const cardTemplateEl = document.querySelector(
			queries.cardTemplate
		) as HTMLTemplateElement | null;
		if (!cardTemplateEl) {
			throw new Error('initBasketModal: Basket card template  was not found!');
		}
		const itemListEl = modal.querySelector(queries.itemList);
		if (!itemListEl) {
			throw new Error(
				'initBasketModal: Basket item list element was not found!'
			);
		}
		const totalPriceEl = modal.querySelector(queries.totalPrice);
		if (!totalPriceEl) {
			throw new Error(
				'initBasketModal: Basket total price element was not found!'
			);
		}

		itemListEl.innerHTML = 'Корзина пуста!';
		totalPriceEl.textContent = '0 синапсов';

		return new BasketModal({
			modal,
			itemListEl,
			totalPriceEl,
			cardTemplateEl,
			...config,
			...modalConfig,
		});
	}
}
