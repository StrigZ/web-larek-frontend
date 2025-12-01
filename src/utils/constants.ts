import { OrderDetails } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const DEFAULT_ORDER_DETAILS: OrderDetails = {
	address: '',
	email: '',
	paymentVariant: 'Онлайн',
	phoneNumber: '',
};

export const settings = {};
