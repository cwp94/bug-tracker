import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	SIZE_CONTAINER,
	ACCOUNT_CONTAINER,
	PROJECT_CONTAINER,
	BUG_CONTAINER,
	GENERAL_CONTAINER,
} from "../../../actions/constants/containerNames";

import { setDisplaySizeVariablesBreadcrumbFontSize } from "../../../actions";

import {
	getElementSize,
	getBaseBackgroundColorClassNameForTheme,
	getBrighterBackgroundColorClassNameForTheme,
	getBaseBreadcrumbArrowColorClassNameForTheme,
	getBrighterBreadcrumbArrowColorClassNameForTheme,
	openProjectsListView,
	openProjectsItemView,
	openBugsListView,
	openBugsItemView,
	closeProjectItemView,
	closeBugItemView,
} from "../../../utils";

export default function NavbarBreadcrumb(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// Resizes breacrumb buttons to fit inside the navbar based on the window size
	useEffect(() => {
		const breadcrumbProjectListButtonTextElement = document.getElementsByClassName(
			"js-breadcrumb-project-list-button-text"
		)[0];
		breadcrumbProjectListButtonTextElement.style.fontSize =
			reduxState[SIZE_CONTAINER].constants
				.navbarBreadcrumbButtonTextBaseFontSize + "px";
		let breadcrumbProjectListButtonTextElementWidth = getElementSize(
			breadcrumbProjectListButtonTextElement
		).width;

		if (
			reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem !== null &&
			reduxState[SIZE_CONTAINER].variables.navbar !== null &&
			reduxState[SIZE_CONTAINER].constants.navbarAccountButtonWidth !== null &&
			reduxState[SIZE_CONTAINER].constants.navbarBreadcrumbArrowWidth !==
				null &&
			reduxState[GENERAL_CONTAINER].globalConstants
				.navbarBreadcrumbMinimumFontSize !== null
		) {
			const breadcrumbProjectItemButtonTextElement = document.getElementsByClassName(
				"js-breadcrumb-project-item-button-text"
			)[0];
			breadcrumbProjectItemButtonTextElement.style.fontSize =
				reduxState[SIZE_CONTAINER].constants
					.navbarBreadcrumbButtonTextBaseFontSize + "px";
			let breadcrumbProjectItemButtonTextElementWidth = getElementSize(
				breadcrumbProjectItemButtonTextElement
			).width;

			const breadcrumbBugListButtonTextElement = document.getElementsByClassName(
				"js-breadcrumb-bug-list-button-text"
			)[0];
			breadcrumbBugListButtonTextElement.style.fontSize =
				reduxState[SIZE_CONTAINER].constants
					.navbarBreadcrumbButtonTextBaseFontSize + "px";
			let breadcrumbBugListButtonTextElementWidth = getElementSize(
				breadcrumbBugListButtonTextElement
			).width;

			// Set to null, but will be updated later if button is present
			let breadcrumbBugItemButtonTextElement = null;
			let breadcrumbBugItemButtonTextElementWidth = 0;

			let navbarAvailableSpace =
				reduxState[SIZE_CONTAINER].variables.navbar.width -
				reduxState[SIZE_CONTAINER].constants.navbarAccountButtonWidth -
				reduxState[SIZE_CONTAINER].constants.navbarBreadcrumbArrowWidth * 3;

			// If bug item breadcrumb button is also present
			if (reduxState[BUG_CONTAINER].componentsDisplay.targetItem !== null) {
				breadcrumbBugItemButtonTextElement = document.getElementsByClassName(
					"js-breadcrumb-bug-item-button-text"
				)[0];
				breadcrumbBugItemButtonTextElement.style.fontSize =
					reduxState[SIZE_CONTAINER].constants
						.navbarBreadcrumbButtonTextBaseFontSize + "px";
				breadcrumbBugItemButtonTextElementWidth = getElementSize(
					breadcrumbBugItemButtonTextElement
				).width;

				navbarAvailableSpace -=
					reduxState[SIZE_CONTAINER].constants.navbarBreadcrumbArrowWidth;
			}

			let fontSize =
				reduxState[SIZE_CONTAINER].constants
					.navbarBreadcrumbButtonTextBaseFontSize;

			while (
				fontSize >=
					reduxState[GENERAL_CONTAINER].globalConstants
						.navbarBreadcrumbMinimumFontSize &&
				navbarAvailableSpace -
					(breadcrumbProjectListButtonTextElementWidth +
						breadcrumbProjectItemButtonTextElementWidth +
						breadcrumbBugListButtonTextElementWidth +
						breadcrumbBugItemButtonTextElementWidth) <
					0
			) {
				fontSize -= 1;
				breadcrumbProjectListButtonTextElement.style.fontSize = fontSize + "px";
				breadcrumbProjectItemButtonTextElement.style.fontSize = fontSize + "px";
				breadcrumbBugListButtonTextElement.style.fontSize = fontSize + "px";

				breadcrumbProjectListButtonTextElementWidth = getElementSize(
					breadcrumbProjectListButtonTextElement
				).width;
				breadcrumbProjectItemButtonTextElementWidth = getElementSize(
					breadcrumbProjectItemButtonTextElement
				).width;
				breadcrumbBugListButtonTextElementWidth = getElementSize(
					breadcrumbBugListButtonTextElement
				).width;

				if (breadcrumbBugItemButtonTextElement !== null) {
					breadcrumbBugItemButtonTextElement.style.fontSize = fontSize + "px";

					breadcrumbBugItemButtonTextElementWidth = getElementSize(
						breadcrumbBugItemButtonTextElement
					).width;
				}
			}

			dispatch(setDisplaySizeVariablesBreadcrumbFontSize(fontSize));
		}
		// eslint-disable-next-line
	}, [
		// eslint-disable-next-line
		reduxState[SIZE_CONTAINER].constants,
		// eslint-disable-next-line
		reduxState[SIZE_CONTAINER].variables.navbar,
		// eslint-disable-next-line
		reduxState[GENERAL_CONTAINER].globalConstants,
		// eslint-disable-next-line
		reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem,
		// eslint-disable-next-line
		reduxState[BUG_CONTAINER].componentsDisplay.targetItem,
	]);

	return (
		<div className="breadcrumb-container">
			<div className={props.visible ? "" : "invisible"}>
				<div
					className={
						"breadcrumb-button js-breadcrumb-project-list-button" +
						(reduxState[PROJECT_CONTAINER].componentsDisplay.listView
							? getBrighterBackgroundColorClassNameForTheme(
									reduxState[ACCOUNT_CONTAINER].settings.theme_color
							  )
							: getBaseBackgroundColorClassNameForTheme(
									reduxState[ACCOUNT_CONTAINER].settings.theme_color
							  ))
					}
					onClick={() => openProjectsListView(reduxState, dispatch)}
				>
					<div className="breadcrumb-button__text js-breadcrumb-project-list-button-text">
						<i
							className="fa fa-folder"
							aria-hidden="true"
							alt="Icon of a folder"
						/>{" "}
						Projects
					</div>
					<div
						// Background color must be made that of the navbar
						// ...otherwise selecting the last button will have
						// ... its light color extend past the arrow
						className={
							"breadcrumb-button__end-container" +
							getBaseBackgroundColorClassNameForTheme(
								reduxState[ACCOUNT_CONTAINER].settings.theme_color
							)
						}
					>
						{reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem ===
						null ? (
							<div
								className={
									"breadcrumb-button__end-container__round-border" +
									(reduxState[PROJECT_CONTAINER].componentsDisplay.listView
										? getBrighterBackgroundColorClassNameForTheme(
												reduxState[ACCOUNT_CONTAINER].settings.theme_color
										  )
										: getBaseBackgroundColorClassNameForTheme(
												reduxState[ACCOUNT_CONTAINER].settings.theme_color
										  ))
								}
							/>
						) : (
							<div>
								<div
									className={
										"breadcrumb-button__end-container__arrow" +
										(reduxState[PROJECT_CONTAINER].componentsDisplay.listView
											? getBrighterBreadcrumbArrowColorClassNameForTheme(
													reduxState[ACCOUNT_CONTAINER].settings.theme_color
											  )
											: getBaseBreadcrumbArrowColorClassNameForTheme(
													reduxState[ACCOUNT_CONTAINER].settings.theme_color
											  ))
									}
								/>
								<div className="breadcrumb-button__end-container__border-arrow" />
							</div>
						)}
					</div>
				</div>

				{reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem ===
				null ? null : (
					<div>
						<div
							className={
								"breadcrumb-button breadcrumb-button--breadcrumb-arrow-buffered js-breadcrumb-project-item-button" +
								(reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem !==
									null &&
								reduxState[PROJECT_CONTAINER].componentsDisplay.itemView
									? getBrighterBackgroundColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
									  )
									: getBaseBackgroundColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
									  ))
							}
							onClick={() => openProjectsItemView(reduxState, dispatch)}
						>
							<div className="breadcrumb-button__text breadcrumb-button__text--item-name js-breadcrumb-project-item-button-text">
								{
									reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem
										.name
								}
							</div>
							<div
								// Background-color must be made same as the navbar
								// ...otherwise selecting last visible button will
								// ...have its different color extend past arrow
								className={
									"breadcrumb-button__end-container" +
									getBaseBackgroundColorClassNameForTheme(
										reduxState[ACCOUNT_CONTAINER].settings.theme_color
									)
								}
							>
								<div
									className={
										"breadcrumb-button__end-container__arrow" +
										(reduxState[PROJECT_CONTAINER].componentsDisplay
											.targetItem !== null &&
										reduxState[PROJECT_CONTAINER].componentsDisplay.itemView
											? getBrighterBreadcrumbArrowColorClassNameForTheme(
													reduxState[ACCOUNT_CONTAINER].settings.theme_color
											  )
											: getBaseBreadcrumbArrowColorClassNameForTheme(
													reduxState[ACCOUNT_CONTAINER].settings.theme_color
											  ))
									}
								/>
								<div className="breadcrumb-button__end-container__border-arrow" />
								<i
									className="fa fa-times breadcrumb-button__end-container__close-button"
									aria-hidden="true"
									onClick={(e) => closeProjectItemView(e, reduxState, dispatch)}
								/>
							</div>
						</div>

						<div
							className={
								"breadcrumb-button breadcrumb-button--breadcrumb-arrow-buffered js-breadcrumb-bug-list-button" +
								(reduxState[PROJECT_CONTAINER].componentsDisplay.targetItem !==
									null && reduxState[BUG_CONTAINER].componentsDisplay.listView
									? getBrighterBackgroundColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
									  )
									: getBaseBackgroundColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
									  ))
							}
							onClick={() => openBugsListView(reduxState, dispatch)}
						>
							<div className="breadcrumb-button__text js-breadcrumb-bug-list-button-text">
								<i
									className="fa fa-bug"
									aria-hidden="true"
									alt="Icon of a bug"
								/>{" "}
								Bugs
							</div>
							<div
								// Background-color must be made same as the navbar
								// ...otherwise selecting last visible button will
								// ...have its different color extend past arrow
								className={
									"breadcrumb-button__end-container" +
									getBaseBackgroundColorClassNameForTheme(
										reduxState[ACCOUNT_CONTAINER].settings.theme_color
									)
								}
							>
								{reduxState[BUG_CONTAINER].componentsDisplay.targetItem ===
								null ? (
									<div
										className={
											"breadcrumb-button__end-container__round-border" +
											(reduxState[BUG_CONTAINER].componentsDisplay.listView
												? getBrighterBackgroundColorClassNameForTheme(
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
												  )
												: getBaseBackgroundColorClassNameForTheme(
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
												  ))
										}
									/>
								) : (
									<div>
										<div
											className={
												"breadcrumb-button__end-container__arrow" +
												(reduxState[PROJECT_CONTAINER].componentsDisplay
													.targetItem !== null &&
												reduxState[BUG_CONTAINER].componentsDisplay.listView
													? getBrighterBreadcrumbArrowColorClassNameForTheme(
															reduxState[ACCOUNT_CONTAINER].settings.theme_color
													  )
													: getBaseBreadcrumbArrowColorClassNameForTheme(
															reduxState[ACCOUNT_CONTAINER].settings.theme_color
													  ))
											}
										/>
										<div className="breadcrumb-button__end-container__border-arrow" />
									</div>
								)}
							</div>
						</div>

						{reduxState[BUG_CONTAINER].componentsDisplay.targetItem ===
						null ? null : (
							<div
								className={
									"breadcrumb-button breadcrumb-button--breadcrumb-arrow-buffered js-breadcrumb-bug-item-button" +
									(reduxState[PROJECT_CONTAINER].componentsDisplay
										.targetItem !== null &&
									reduxState[BUG_CONTAINER].componentsDisplay.itemView
										? getBrighterBackgroundColorClassNameForTheme(
												reduxState[ACCOUNT_CONTAINER].settings.theme_color
										  )
										: getBaseBackgroundColorClassNameForTheme(
												reduxState[ACCOUNT_CONTAINER].settings.theme_color
										  ))
								}
								onClick={() => openBugsItemView(reduxState, dispatch)}
							>
								<div className="breadcrumb-button__text breadcrumb-button__text--item-name js-breadcrumb-bug-item-button-text">
									{reduxState[BUG_CONTAINER].componentsDisplay.targetItem.name}
								</div>
								<div
									// Background-color must be made same as the navbar
									// ...otherwise selecting last visible button will
									// ...have its different color extend past arrow
									className={
										"breadcrumb-button__end-container" +
										getBaseBackgroundColorClassNameForTheme(
											reduxState[ACCOUNT_CONTAINER].settings.theme_color
										)
									}
								>
									<div
										className={
											"breadcrumb-button__end-container__round-border" +
											(reduxState[BUG_CONTAINER].componentsDisplay.itemView
												? getBrighterBackgroundColorClassNameForTheme(
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
												  )
												: getBaseBackgroundColorClassNameForTheme(
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
												  ))
										}
									/>
									<i
										className="fa fa-times breadcrumb-button__end-container__close-button"
										aria-hidden="true"
										onClick={(e) => closeBugItemView(e, reduxState, dispatch)}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
