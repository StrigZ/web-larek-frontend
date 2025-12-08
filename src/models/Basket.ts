import { BasketModel, Product } from '../types';

/**
 * Класс модели корзины покупок.
 * Управляет хранением товаров, их количеством и расчетом стоимости.
 * @implements BasketModel
 */
export class Basket implements BasketModel {
	private items = new Map<string, number>();
	private itemsArray: Product[] = [];
	private onBasketChange: () => void;

	/**
	 * Создает экземпляр Basket.
	 * @param onBasketChange - Коллбек, вызываемый при изменении корзины.
	 */
	constructor({ onBasketChange }: { onBasketChange: () => void }) {
		this.onBasketChange = onBasketChange;
	}

	/** Вычисляет общую стоимость всех товаров в корзине. */
	public getTotal() {
		return this.itemsArray.reduce((prev, curr) => prev + (curr.price ?? 0), 0);
	}

	/** Возвращает количество уникальных товаров в корзине. */
	public getItemsCount() {
		return this.itemsArray.length;
	}

	/** Возвращает карту товаров (ID → количество). */
	public getItemsMap() {
		return this.items;
	}

	/** Возвращает массив всех товаров в корзине. */
	public getItemsArray() {
		return this.itemsArray;
	}

	/**
	 * Добавляет товар в корзину.
	 * @param product - Товар для добавления.
	 */
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

	/**
	 * Удаляет товар из корзины.
	 * @param product - Товар для удаления.
	 */
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

	/** Очищает корзину. */
	public clear() {
		this.items = new Map<string, number>();
		this.itemsArray = [];
		this._changed();
	}

	/** Вызывает коллбек при изменении корзины. */
	private _changed() {
		this.onBasketChange();
	}
}
