import { CatalogModel, Product } from '../types';

/**
 * Класс модели каталога товаров.
 * Управляет хранением и поиском товаров в каталоге.
 * @implements CatalogModel
 */
export class Catalog implements CatalogModel {
	private items: Product[] = [];

	constructor() {
		this.items = [];
	}

	/**
	 * Возвращает товар по его ID.
	 * @param id - Идентификатор товара.
	 * @returns Товар с указанным ID.
	 * @throws {Error} Если товар с таким ID не найден.
	 */
	public getItemById(id: string) {
		const item = this.items.find((item) => item.id === id);
		if (!item) {
			throw new Error(
				"Catalog:getItemById: Item with this id doesn't exist: " + id
			);
		}

		return item;
	}

	/** Возвращает все товары в каталоге. */
	public getItems() {
		return this.items;
	}

	/**
	 * Устанавливает список товаров в каталоге.
	 * @param items - Массив товаров для установки.
	 */
	public setItems(items: Product[]) {
		this.items = items;
	}
}
