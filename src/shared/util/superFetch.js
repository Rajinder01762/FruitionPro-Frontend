import { frontendUrl } from '../../api';
// import axios from 'axios';

const getHeader = (token) => ({
	'Content-Type': 'application/json;charset=UTF-8',
	Accept: 'application/json',
	'x-access-token': token,
	authorization: `Bearer ${token}`,
	Connection: 'keep-alive',
	'Content-Length': '509',
	Host: 'https://api.fruitionpro.com',
	operation: 'private',
	'Sec-Fetch-Mode': 'cors',
	'Sec-Fetch-Site': 'cross-site',
});

const base = (method, url, data = {}, token) => {
	let body = undefined;
	if (method !== 'get') {
		body = JSON.stringify(data);
	}
	// if (isAuthenticated()) {
	// 	const user = localStorage.getItem(config.testUser);
	// 	const token = JSON.parse(user).access_token;
	// 	customHeader.Authorization = `Bearer ${token}}`;
	// }
	console.log(method, 'method');
	return fetch(`https://api.fruitionpro.com/${url}`, {
		method,
		headers: getHeader(token),
		body,
	})
		.then((response) => {
			switch (response.status) {
				case 200:
					return response.json();
				default:
					return response;
			}
		})
		.then((res) => res)
		.catch((error) => {
			throw error;
		});
};
const SuperFetch = {};
['get', 'post', 'put', 'delete'].forEach((method) => {
	SuperFetch[method] = base.bind(null, method);
});
export default SuperFetch;
