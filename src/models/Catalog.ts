import { CatalogModel, Product } from '../types';

export class Catalog implements CatalogModel {
	private items: Product[] = [];

	constructor() {
		this.items = [];
	}

	public setItems(items: Product[]) {
		this.items = items;
	}
	public getItemById(id: string) {
		const item = this.items.find((item) => item.id === id);
		if (!item) {
			throw new Error(
				"Catalog:getItemById: Item with this id doesn't exist: " + id
			);
		}

		return item;
	}
	public getItems() {
		return this.items;
	}
}
