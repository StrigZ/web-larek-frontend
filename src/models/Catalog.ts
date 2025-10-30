import { EventEmitter } from '../components/base/events';
import { CatalogModel } from '../types';

export class Catalog<T extends { id: string }> implements CatalogModel<T> {
	items: T[] = [];
	events: EventEmitter;

	constructor(events: EventEmitter) {
		this.items = [];
		this.events = events;
	}

	setItems(items: T[]) {
		this.items = items;
		this._loaded();
	}
	getItemById(id: string) {
		return this.items.find((item) => item.id === id);
	}
	getItems() {
		return this.items;
	}

	protected _loaded() {
		this.events.emit('catalog:loaded');
	}
}
