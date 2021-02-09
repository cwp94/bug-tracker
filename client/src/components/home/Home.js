import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
	PROJECT_CONTAINER,
	BUG_CONTAINER,
} from "../../actions/constants/containerNames";

import {
	setWhichGeneralDropdownsDisplay,
	setProjectOrBugSearchFilterSort,
} from "../../actions";

import {
	getUpdatedDeepCopyFilterArray,
	getHomeBackgroundColorClassNameForLightOrDarkMode,
} from "../../utils";

// Components
// Navbar
import Navbar from "./menu/Navbar";
// Account
import AccountBlurredBackground from "./account/AccountBlurredBackground";
import AccountSidebar from "./account/AccountSidebar";
import AccountModal from "./account/AccountModal";
// Projects & Bugs
import ListView from "./projects-bugs-shared/list/ListView";
import ItemView from "./projects-bugs-shared/item/ItemView";

export default function Home() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// Updates list filters to match the account settings
	useEffect(() => {
		if (
			reduxState[ACCOUNT_CONTAINER].settings.filter_completed_projects !==
			reduxState[PROJECT_CONTAINER].searchFilterSort.statusFilter.includes(
				reduxState[PROJECT_CONTAINER].priorityStatusOptions.statusCompletionId
			)
		) {
			dispatch(
				setProjectOrBugSearchFilterSort(PROJECT_CONTAINER, {
					...reduxState[PROJECT_CONTAINER].searchFilterSort,
					statusFilter: getUpdatedDeepCopyFilterArray(
						reduxState,
						PROJECT_CONTAINER,
						"statusFilter",
						reduxState[PROJECT_CONTAINER].priorityStatusOptions
							.statusCompletionId
					),
				})
			);
		}

		if (
			reduxState[ACCOUNT_CONTAINER].settings.filter_completed_bugs !==
			reduxState[BUG_CONTAINER].searchFilterSort.statusFilter.includes(
				reduxState[BUG_CONTAINER].priorityStatusOptions.statusCompletionId
			)
		) {
			dispatch(
				setProjectOrBugSearchFilterSort(BUG_CONTAINER, {
					...reduxState[BUG_CONTAINER].searchFilterSort,
					statusFilter: getUpdatedDeepCopyFilterArray(
						reduxState,
						BUG_CONTAINER,
						"statusFilter",
						reduxState[BUG_CONTAINER].priorityStatusOptions.statusCompletionId
					),
				})
			);
		}
		// eslint-disable-next-line
	}, [
		// eslint-disable-next-line
		reduxState[ACCOUNT_CONTAINER].settings.filter_completed_projects,
		// eslint-disable-next-line
		reduxState[ACCOUNT_CONTAINER].settings.filter_completed_bugs,
	]);

	// Closes general dropdowns whenever they are open and user anywhere
	const closeDropdownsWhenOpen = () => {
		if (
			Object.values(reduxState[GENERAL_CONTAINER].dropdownsDisplay).indexOf(
				true
			) > -1
		) {
			dispatch(setWhichGeneralDropdownsDisplay({}));
		}
	};

	return (
		<div
			className={
				"home-container" +
				getHomeBackgroundColorClassNameForLightOrDarkMode(
					reduxState[ACCOUNT_CONTAINER].settings.dark_mode
				)
			}
			onClick={closeDropdownsWhenOpen}
		>
			<Navbar />
			{/*Account components*/}
			{/*Displays blurred background when an account component is open*/}
			{Object.values(reduxState[ACCOUNT_CONTAINER].componentsDisplay).indexOf(
				true
			) > -1 ? (
				<AccountBlurredBackground />
			) : null}
			{reduxState[ACCOUNT_CONTAINER].componentsDisplay.accountSidebar ? (
				<AccountSidebar />
			) : null}
			{/*If any account component other than accountSidebar is true, display modal*/}
			{Object.values(reduxState[ACCOUNT_CONTAINER].componentsDisplay).indexOf(
				true
			) > -1 &&
			!reduxState[ACCOUNT_CONTAINER].componentsDisplay.accountSidebar ? (
				<AccountModal />
			) : null}
			{/*Project components*/}
			{reduxState[PROJECT_CONTAINER].componentsDisplay.listView ? (
				<ListView reduxContainerName={PROJECT_CONTAINER} />
			) : null}
			{reduxState[PROJECT_CONTAINER].componentsDisplay.itemView ? (
				<ItemView reduxContainerName={PROJECT_CONTAINER} />
			) : null}
			{/*Bug components*/}
			{reduxState[BUG_CONTAINER].componentsDisplay.listView ? (
				<ListView reduxContainerName={BUG_CONTAINER} />
			) : null}
			{reduxState[BUG_CONTAINER].componentsDisplay.itemView ? (
				<ItemView reduxContainerName={BUG_CONTAINER} />
			) : null}
		</div>
	);
}
