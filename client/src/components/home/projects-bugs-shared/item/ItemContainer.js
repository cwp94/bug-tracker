import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	sizeContainerName,
	generalContainerName,
	projectContainerName,
	bugContainerName,
	commentContainerName,
} from "../../../../reducers/containerNames";

import { setWhichGeneralComponentsDisplay } from "../../../../actions";

import { getWindowSize } from "../../../../utils/displaySizeUtils";

// Components
import ItemContainerTopBar from "./ItemContainerTopBar";
import ItemContainerListSidebar from "./ItemContainerListSidebar";
import ItemContainerDisplayInfo from "./ItemContainerDisplayInfo";
import ItemContainerEditInfo from "./ItemContainerEditInfo";
import ItemContainerDeleteModal from "./ItemContainerDeleteModal";
import ItemContainerCommentsBox from "./ItemContainerCommentsBox";
import ItemContainerCommentsBoxIndividualCommentDeleteModal from "./ItemContainerCommentsBoxIndividualCommentDeleteModal";

import "../../../../SCSS/home/projects-bugs-shared/item/itemContainer.scss";

export default function ItemContainer(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// Adjusts the height and width of the modal to fit the screen
	useEffect(() => {
		if (
			reduxState[sizeContainerName].variables.window !== null &&
			reduxState[sizeContainerName].variables.navbar !== null &&
			reduxState[sizeContainerName].constants.itemContainerTopBar !== null &&
			reduxState[sizeContainerName].constants.itemContainerListSidebar !== null
		) {
			const itemContainerElement = document.getElementsByClassName(
				"js-item-container"
			)[0];

			itemContainerElement.style.height =
				reduxState[sizeContainerName].variables.window.height -
				reduxState[sizeContainerName].variables.navbar.height -
				reduxState[sizeContainerName].constants.itemContainerTopBar.height +
				"px";

			if (
				reduxState[generalContainerName].componentsDisplay
					.itemContainerListSidebar
			) {
				itemContainerElement.style.width =
					reduxState[sizeContainerName].variables.window.width -
					reduxState[sizeContainerName].constants.itemContainerListSidebar
						.width +
					"px";
			} else {
				itemContainerElement.style.width =
					reduxState[sizeContainerName].variables.window.width + "px";
			}
		}
		// eslint-disable-next-line
	}, [
		// eslint-disable-next-line
		reduxState[sizeContainerName],
		// eslint-disable-next-line
		reduxState[generalContainerName].componentsDisplay.itemContainerListSidebar,
	]);

	// If user has not set itemContainerListSidebar, then whether it is
	// ...open or closed will be decided based on the current window size
	useEffect(() => {
		if (
			reduxState[generalContainerName].componentsDisplay
				.itemContainerListSidebarUserSet === false &&
			reduxState[sizeContainerName].constants.itemContainerListSidebar !==
				null &&
			reduxState[sizeContainerName].constants
				.itemContainerOuterDividingContainerMinWidth !== null &&
			reduxState[sizeContainerName].constants
				.itemContainerPaddingContainerPadding !== null
		) {
			// Instead of putting inn the optimization to re-run once no longer
			// ...null since it would also re-run every window resize
			const windowSize =
				reduxState[sizeContainerName].variables.window === null
					? getWindowSize()
					: reduxState[sizeContainerName].variables.window;

			const minWidthNeededForNoItemBoxOverflow =
				reduxState[sizeContainerName].constants
					.itemContainerOuterDividingContainerMinWidth +
				reduxState[sizeContainerName].constants
					.itemContainerPaddingContainerPadding *
					2;

			dispatch(
				setWhichGeneralComponentsDisplay({
					...reduxState[generalContainerName].componentsDisplay,
					itemContainerListSidebar:
						windowSize.width -
							reduxState[sizeContainerName].constants.itemContainerListSidebar
								.width >=
						minWidthNeededForNoItemBoxOverflow,
				})
			);
		}
		// eslint-disable-next-line
	}, [
		// eslint-disable-next-line
		reduxState[sizeContainerName].constants,
	]);

	return (
		<div>
			<ItemContainerTopBar reduxContainerName={props.reduxContainerName} />
			<ItemContainerListSidebar reduxContainerName={props.reduxContainerName} />
			{/* Located outside item-container-component so topBar doesn't cover it */}
			{reduxState[props.reduxContainerName].componentsDisplay
				.itemContainerDeleteModal ? (
				<ItemContainerDeleteModal
					reduxContainerName={props.reduxContainerName}
				/>
			) : null}
			{reduxState[bugContainerName].componentsDisplay.itemContainer === true &&
			reduxState[commentContainerName].componentsDisplay.commentDeleteModal ===
				true ? (
				<ItemContainerCommentsBoxIndividualCommentDeleteModal />
			) : null}
			<div className="item-container-component">
				<div
					className={
						"item-container js-item-container" +
						(reduxState[generalContainerName].componentsDisplay
							.itemContainerListSidebar
							? " item-container--shifted-right"
							: "")
					}
				>
					<div className="item-content-container js-item-content-container">
						<div className="padding-container">
							{!reduxState[props.reduxContainerName].componentsDisplay
								.itemContainerEditInfo ? (
								<div>
									<ItemContainerDisplayInfo
										reduxContainerName={props.reduxContainerName}
									/>
								</div>
							) : (
								<div>
									<ItemContainerEditInfo
										reduxContainerName={props.reduxContainerName}
									/>
								</div>
							)}
							{props.reduxContainerName === projectContainerName ? null : (
								<ItemContainerCommentsBox />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
