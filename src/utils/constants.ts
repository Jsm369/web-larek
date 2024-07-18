export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings: { [key: string]: string } = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	кнопка: 'button',
	дополнительное: 'additional',
	другое: 'other',
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^(\+7|8)?[\d]{10}$/;
export const addressRegex = /^(?=.*\d)(?=.*[a-zA-Zа-яА-ЯёЁ]).{6,}$/;

export const BasketStorageKey = 'basket-items';
