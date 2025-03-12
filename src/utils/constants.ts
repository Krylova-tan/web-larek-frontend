export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	headers: {
		authorization: `${process.env.API_TOKEN}`,
		'Content-Type': 'application/json',
	},
};
// встроенный объект для хранения данных
export const categories = new Map([
	['софт-скил', 'soft'],
	['другое', 'other'],
	['дополнительное', 'additional'],
	['кнопка', 'button'],
	['хард-скил', 'hard']
]);
