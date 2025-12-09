import { EventEmitter } from '../components/base/events';
import {
	AppStateModel,
	BasketModel,
	CatalogModel,
	OrderDetails,
	OrderRequestBody,
} from '../types';

/**
 * Класс центрального состояния приложения.
 * Управляет состоянием корзины, каталога и данными заказа.
 * @implements AppStateModel
 */
export class AppState implements AppStateModel {
	private catalog: CatalogModel;
	private events: EventEmitter;
	private basket: BasketModel;
	private orderDetails: Partial<OrderDetails>;

	/**
	 * Создает экземпляр AppState.
	 * @param basket - Модель корзины.
	 * @param catalog - Модель каталога.
	 * @param events - Модель шины событий.
	 */
	constructor(
		basket: BasketModel,
		catalog: CatalogModel,
		events: EventEmitter
	) {
		this.basket = basket;
		this.events = events;
		this.catalog = catalog;
		this.orderDetails = { paymentVariant: 'Онлайн' };
	}

	/** Возвращает модель корзины. */
	public getBasket() {
		return this.basket;
	}

	/** Возвращает модель каталога. */
	public getCatalog() {
		return this.catalog;
	}

	/** Возвращает шину событий. */
	public getEvents() {
		return this.events;
	}

	/**
	 * Формирует данные для создания заказа.
	 * @returns Данные для отправки на сервер.
	 */
	public getOrderRequestBody(): OrderRequestBody {
		const paymentVariant =
			this.orderDetails.paymentVariant === 'Онлайн' ? 'online' : 'cash';

		return {
			address: this.orderDetails.address ?? '',
			email: this.orderDetails.email ?? '',
			phone: this.orderDetails.phoneNumber ?? '',
			payment: paymentVariant,
			total: this.basket.getTotal(),
			items: this.basket.getItems().map(({ id }) => id),
		};
	}

	/**
	 * Обновляет данные заказа.
	 * @param details - Частичные данные заказа для обновления.
	 */
	public setOrderDetails(details: Partial<OrderDetails>) {
		this.orderDetails = { ...this.orderDetails, ...details };
	}

	/**
	 * Валидирует данные заказа и возвращает текст ошибки
	 */
	public getValidationError() {
		if (this.orderDetails.address?.trim() === '') {
			return 'Адрес не может быть пустым!';
		}
		if (this.orderDetails.email?.trim() === '') {
			return 'Email не может быть пустым';
		}
		if (this.orderDetails.phoneNumber?.trim() === '') {
			return 'Номер телефона не может быть пустым!';
		}

		return '';
	}
}
