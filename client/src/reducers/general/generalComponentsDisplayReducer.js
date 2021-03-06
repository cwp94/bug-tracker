import { SET_WHICH_GENERAL_COMPONENTS_DISPLAY } from "../../actions/constants/types";

// Default state for which general components should be displayed by the app
const initialState = {
	register: false,
	login: true,
	home: false,
	// Has the user set itemViewListSidebar, or has it only been auto decided
	// ...based on the size of the window
	itemViewListSidebarUserSet: false,
	// In general container since value should be the same for projects and bugs
	itemViewListSidebar: true,
};

/**
 * Used to set JSON in the general container of the redux state for which
 * general components should display by the app
 *
 * @param {JSON} state - JSON for which general components are currently being
 * displayed by the app
 * @param {JSON} action - JSON containing a container name and type (used to
 * determin where and what to do in the redux state), and any data addition
 * data needed based on the container name and type (typically data to updated
 * in the redux state)
 * @returns {JSON} - JSON for which general components should displayed by the
 * app to be stored in the general container of the redux state
 */
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_WHICH_GENERAL_COMPONENTS_DISPLAY:
			return {
				// Ternary operator is used to set undefined components to
				// ...their default, so you only have to pass the components
				// ...you want to set differently, to make using this redux
				// ...action easier
				register:
					action.displays.register !== undefined
						? action.displays.register
						: false,
				login:
					action.displays.login !== undefined ? action.displays.login : false,
				home: action.displays.home !== undefined ? action.displays.home : false,
				itemViewListSidebarUserSet:
					action.displays.itemViewListSidebarUserSet !== undefined
						? action.displays.itemViewListSidebarUserSet
						: false,
				// If undefined then true since default is true
				itemViewListSidebar:
					action.displays.itemViewListSidebar !== undefined
						? action.displays.itemViewListSidebar
						: true,
			};
		default:
			return state;
	}
}
