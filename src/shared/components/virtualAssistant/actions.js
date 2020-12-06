import {
	TEST,
	SET_VA,
	GET_ALL_PARTICIPANTS,
	GET_ALL_PARTICIPANTS_SUCCESS,
	CREATE_MEETING_VA,
	CREATE_MEETING_VA_SUCCESS,
	CREATE_MEETING_VA_FAILURE,
} from './constants';

export const test = () => ({
	type: TEST,
});

export const setVA = (VA) => ({
	type: SET_VA,
	VA,
});

export const createMeetingVA = (data) => ({
	type: CREATE_MEETING_VA,
	data
});

export const createMeetingSuccessVA = (res) => ({
	type: CREATE_MEETING_VA_SUCCESS,
	res
});

export const createMeetingFailureVA = err => ({
	type: CREATE_MEETING_VA_FAILURE,
	err
});


