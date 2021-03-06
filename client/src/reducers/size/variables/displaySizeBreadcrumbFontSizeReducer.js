import { SET_DISPLAY_SIZE_VARIABLES_BREADCRUMB_FONT_SIZE } from "../../../actions/constants/types";

// Default state for the Window and NAvbar HTML elements
const initialState = null;

/**
 * Used to set current font size of the breadcrumb menu button text elements
 * 
 * @param {Number} state - Number of current font size of the breadcrumb menu
 * button text elements
 * @param {JSON} action - JSON containing a container name and type (used to
 * determin where and what to do in the redux state), and any data addition
 * data needed based on the container name and type (typically data to updated
 * in the redux state)
 * @returns {Number} - Number of current font size of the breadcrumb menu
 * button text elements to be stored in the size container of the redux state
 */
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_DISPLAY_SIZE_VARIABLES_BREADCRUMB_FONT_SIZE:
			return action.fontSize;
		default:
			return state;
	}
}