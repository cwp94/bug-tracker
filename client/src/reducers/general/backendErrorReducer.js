import { SET_BACKEND_ERRORS } from "../../actions/constants/types";

// Default state for backend errors (no backend errors appear by default)
const initialState = {};

/**
 * Used to set JSON for form backend errors in the general container of the redux
 * state
 * 
 * @param {JSON} state - JSON for the current form backend errors in the redux state
 * @param {JSON} action - JSON containing a container name and type (used to
 * determin where and what to do in the redux state), and any data addition
 * data needed based on the container name and type (typically data to updated
 * in the redux state)
 * @returns {JSON} - JSON for form backend errors to be stored in the general
 * container of the redux state
 */
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_BACKEND_ERRORS:
			return action.backendErrors;
		default:
			return state;
	}
}
