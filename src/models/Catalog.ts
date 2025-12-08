import { CatalogModel, Product } from '../types';

export class Catalog implements CatalogModel {
	items: Product[] = [];

	constructor() {
		this.items = [];
	}

	setItems(items: Product[]) {
		this.items = items;
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
}
