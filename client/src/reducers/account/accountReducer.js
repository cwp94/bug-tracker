import { SET_ACCOUNT } from "../../actions/constants/types";

// Default state for account (empty since no account is logged in by default)
const initialState = {}

/**
 * Used to set JSON containing account data from the database in the account
 * container of the redux state
 * 
 * @param {JSON} state - JSON for the current account data in the redux state
 * @param {JSON} action - JSON containing a container name and type (used to
 * determin where and what to do in the redux state), and any data addition
 * data needed based on the container name and type (typically data to updated
 * in the redux state)
 * @returns {JSON} - JSON for an account to be stored in the account container
 * of the redux state
 */
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_ACCOUNT:
			return action.account;
		default:
			return state;
	}
}