import { EventEmitter } from '../components/base/events';
import { CatalogModel, Product } from '../types';

export class Catalog implements CatalogModel {
	items: Product[] = [];
	events: EventEmitter;

	constructor(events: EventEmitter) {
		this.items = [];
		this.events = events;
	}

	setItems(items: Product[]) {
		this.items = items;
		this._loaded();
	}
	getItemById(id: string) {
		const item = this.items.find((item) => item.id === id);
		if (!item) {
			throw new Error(
				"Catalog:getItemById: Item with this id doesn't exist: " + id
			);
		}

		return item;
	}
	getItems() {
		return this.items;
	}

	protected _loaded() {
		this.events.emit('catalog:loaded');
	}
}
