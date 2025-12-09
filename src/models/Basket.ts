import { BasketModel, Product } from '../types';

/**
 * Класс модели корзины покупок.
 * Управляет хранением товаров, их количеством и расчетом стоимости.
 * @implements BasketModel
 */
export class Basket implements BasketModel {
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

	/** Возвращает массив всех товаров в корзине. */
	public getItems() {
		return this.itemsArray;
	}

	/**
	 * Добавляет товар в корзину.
	 * @param product - Товар для добавления.
	 */
	public add(product: Product) {
		if (!product.price) return;

		const doesExist = this.itemsArray.find(({ id }) => id === product.id);
		if (doesExist) return;

		this.itemsArray.push(product);
		this._changed();
	}

	/**
	 * Удаляет товар из корзины.
	 * @param product - Товар для удаления.
	 */
	public remove(product: Product) {
		this.itemsArray = this.itemsArray.filter(({ id }) => {
			id !== product.id;
		});
		this._changed();
	}

	/** Очищает корзину. */
	public clear() {
		this.itemsArray = [];
		this._changed();
	}

	/** Вызывает коллбек при изменении корзины. */
	private _changed() {
		this.onBasketChange();
	}
}
