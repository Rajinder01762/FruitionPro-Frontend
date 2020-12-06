import { toast } from 'react-toastify';

export default (status, message) => {
	let id = '';
	if (status === 200) {
		id = toast.success(message, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 4000,
			hideProgressBar: true,
		});
	} else {
		id = toast.error(message, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 4000,
			hideProgressBar: true,
		});
	}
	return id;
};
