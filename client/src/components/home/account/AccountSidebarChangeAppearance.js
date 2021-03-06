import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
} from "../../../actions/constants/containerNames";

import { updateAccountSettings } from "../../../actions";

import {
	getBaseBackgroundColorClassNameForTheme,
	getBackendErrorsTextColorClassNameForLightOrDarkMode,
} from "../../../utils";

// Components
import ToggleSwitch from "../../basic/ToggleSwitch";

export default function AccountSidebarChangeAppearance() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const onChangeTheme = (e, theme_id) => {
		e.stopPropagation();

		if (theme_id !== reduxState[ACCOUNT_CONTAINER].settings.theme_id) {
			dispatch(
				updateAccountSettings({
					...reduxState[ACCOUNT_CONTAINER].settings,
					theme_id: theme_id,
				})
			);
		}
	};

	const onChangeDarkMode = (e) => {
		dispatch(
			updateAccountSettings({
				...reduxState[ACCOUNT_CONTAINER].settings,
				dark_mode: e.target.checked,
			})
		);
	};

	const getThemeOption = (theme_id) => {
		const theme = reduxState[ACCOUNT_CONTAINER].settingThemes.filter(
			(theme) => theme.theme_id === theme_id
		)[0];

		return (
			<div
				className={
					"content-container__theme-option" +
					getBaseBackgroundColorClassNameForTheme(theme.color)
				}
				onClick={(e) => onChangeTheme(e, theme_id)}
			>
				{reduxState[ACCOUNT_CONTAINER].settings.theme_id === theme_id ? (
					<i
						className="fa fa-check checkmark content-container__theme-option__selected-checkmark"
						aria-hidden="true"
					/>
				) : null}
			</div>
		);
	};

	return (
		<div className="account-sidebar-change-theme-component">
			<div className="content-container">
				<label className="content-container__label">Theme</label>

				{reduxState[ACCOUNT_CONTAINER].settingThemes.map((theme, i) => {
					return <span key={i}>{getThemeOption(theme.theme_id)}</span>;
				})}
			</div>
			<div className="content-container content-container--right">
				<label className="content-container__label">Dark mode</label>
				<div className="content-container__toggle-switch-centering-container">
					<ToggleSwitch
						name="light-dark-mode"
						onChangeFunction={onChangeDarkMode}
						isOn={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
						id="account-settings-light-dark-mode"
						dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
						theme_color={reduxState[ACCOUNT_CONTAINER].settings.theme_color}
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
		</div>
	);
}
