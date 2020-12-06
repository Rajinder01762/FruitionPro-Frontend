import { TEST, SET_VA } from './constants';

const initialState = {
	testState: 'testing',
};

const viReducer = (state = initialState, action) => {
	switch (action.type) {
		case TEST:
			return {
				...state,
				fromReducer: true,
			};
		case SET_VA:
			return {
				...state,
				VA: action.VA,
			};
		default:
			return state;
	}
};

export default viReducer;
