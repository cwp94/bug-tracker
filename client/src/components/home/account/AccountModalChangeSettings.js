import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
} from "../../../actions/constants/containerNames";

import {
	clearBackendErrors,
	setWhichAccountComponentsDisplay,
	updateAccountSettings,
} from "../../../actions";

import {
	getAccountModalChangeSettingsCategoryContainerBorderBackgroundTextColorClassNameForLightOrDarkMode,
	getTextColorClassNameForThemeWithLightOrDarkMode,
	getBackendErrorsTextColorClassNameForLightOrDarkMode,
} from "../../../utils";

// Components
import ToggleSwitch from "../../basic/ToggleSwitch";

export default function AccountModalChangeSettings() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// clears prior backend errors when closing the component
	useEffect(() => {
		return () => {
			dispatch(clearBackendErrors());
		};
		// eslint-disable-next-line
	}, []);

	const onChangeFilterCompletedProjects = () => {
		dispatch(
			updateAccountSettings({
				...reduxState[ACCOUNT_CONTAINER].settings,
				filter_completed_projects: !reduxState[ACCOUNT_CONTAINER].settings
					.filter_completed_projects,
			})
		);
	};

	const onChangeFilterCompletedBugs = () => {
		dispatch(
			updateAccountSettings({
				...reduxState[ACCOUNT_CONTAINER].settings,
				filter_completed_bugs: !reduxState[ACCOUNT_CONTAINER].settings
					.filter_completed_bugs,
			})
		);
	};

	const backToAccountSidebar = () => {
		dispatch(setWhichAccountComponentsDisplay({ accountSidebar: true }));
	};

	return (
		<div>
			<h1 className="title">Account Settings</h1>
			<div
				className={
					"category-container category-container--larger-top-margin" +
					getAccountModalChangeSettingsCategoryContainerBorderBackgroundTextColorClassNameForLightOrDarkMode(
						reduxState[ACCOUNT_CONTAINER].settings.dark_mode
					)
				}
			>
				<h2
					className={
						"category-container__heading" +
						getTextColorClassNameForThemeWithLightOrDarkMode(
							reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
							reduxState[ACCOUNT_CONTAINER].settings.theme_color
						)
					}
				>
					Filter
				</h2>
				<div className="category-container__content-container category-container__content-container--smaller-top-margin">
					<label className="category-container__content-container__label">
						Filter out completed projects (by default)
					</label>
					<ToggleSwitch
						dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
						isOn={
							reduxState[ACCOUNT_CONTAINER].settings.filter_completed_projects
						}
						onChangeFunction={onChangeFilterCompletedProjects}
					/>
				</div>
				<div className="category-container__content-container">
					<label className="category-container__content-container__label">
						Filter out completed bugs (by default)
					</label>
					<ToggleSwitch
						dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
						isOn={reduxState[ACCOUNT_CONTAINER].settings.filter_completed_bugs}
						onChangeFunction={onChangeFilterCompletedBugs}
					/>
				</div>
			</div>
			<span
				className={
					"backend-errors" +
					getBackendErrorsTextColorClassNameForLightOrDarkMode(
						reduxState[ACCOUNT_CONTAINER].settings.dark_mode
					)
				}
			>
				{reduxState[GENERAL_CONTAINER].backendErrors.authorization}
				{reduxState[GENERAL_CONTAINER].backendErrors.serverSettings}
				{reduxState[GENERAL_CONTAINER].backendErrors.serverConnection}
			</span>
			<div className="modal-links-container">
				<span
					onClick={backToAccountSidebar}
					className={
						"modal-link" +
						getTextColorClassNameForThemeWithLightOrDarkMode(
							reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
							reduxState[ACCOUNT_CONTAINER].settings.theme_color
						)
					}
				>
					Close
				</span>
			</div>
		</div>
	);
}
