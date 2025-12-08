import { BasketModel, Product } from '../types';

export class Basket implements BasketModel {
	private items = new Map<string, number>();
	private itemsArray: Product[] = [];
	private onBasketChange: () => void;
	constructor({ onBasketChange }: { onBasketChange: () => void }) {
		this.onBasketChange = onBasketChange;
	}

	public getTotal() {
		return this.itemsArray.reduce((prev, curr) => prev + (curr.price ?? 0), 0);
	}
	public getItemsCount() {
		return this.itemsArray.length;
	}
	public getItemsMap() {
		return this.items;
	}
	public getItemsArray() {
		return this.itemsArray;
	}

	public add(product: Product) {
		if (!product.price) return;

		this.itemsArray.push(product);

		const doesExist = this.items.has(product.id);
		if (doesExist) {
			const currIndex = this.items.get(product.id);
			if (!currIndex) return;

			this.items.set(product.id, currIndex + 1);
		} else {
			this.items.set(product.id, 1);
		}
		this._changed();
	}

	public remove(product: Product) {
		const idx = this.itemsArray.findIndex(({ id }) => id === product.id);
		if (idx > 0) {
			this.itemsArray.splice(idx, 1);
		}

		const doesExist = this.items.has(product.id);
		if (!doesExist) {
			return;
		}

		const currIndex = this.items.get(product.id);
		if (!currIndex) return;

		if (currIndex === 1) {
			this.items.delete(product.id);
			this._changed();
			return;
		}

		this.items.set(product.id, currIndex - 1);
		this._changed();
	}

	public clear() {
		this.items = new Map<string, number>();
		this.itemsArray = [];
		this._changed();
	}
	private _changed() {
		this.onBasketChange();
	}
}
