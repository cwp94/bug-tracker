import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	projectContainerName,
	bugContainerName,
} from "../../reducers/containerNames";

import {
	setDisplaySizeConstants,
	setDisplaySizeVariables,
	setWhichAccountComponentsDisplay,
	setWhichProjectComponentsDisplay,
	setWhichBugComponentsDisplay,
} from "../../actions";

import {
	getWindowSize,
	getElementSize,
	getElementStyle,
	stripNonDigits,
	calcScrollbarWidth,
	calcViewItemTopBarHeight,
	calcItemContainerListSidebarWidth,
} from "../../utils/displaySizeUtils";

import { setNavbarButtonColor } from "../../utils/navbarUtils";

import "../../SCSS/home/navbar.scss";

export default function Navbar() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// Makes sure the current size of the window and navbar are stored in redux,
	useEffect(() => {
		dispatch(
			setDisplaySizeConstants({
				home: {
					minWidth: stripNonDigits(
						getElementStyle(
							document.getElementsByClassName("js-home-container")[0]
						).minWidth
					),
				},
				scrollbar: calcScrollbarWidth(),
				viewItemTopBar: calcViewItemTopBarHeight(),
				miniListTable: calcItemContainerListSidebarWidth(),
			})
		);

		dispatch(
			setDisplaySizeVariables({
				window: getWindowSize(),
				navbar: getElementSize(document.getElementsByClassName("js-navbar")[0]),
			})
		);

		// Adds event to update navbar size on a resize
		window.addEventListener("resize", () => {
			dispatch(
				setDisplaySizeVariables({
					window: getWindowSize(),
					navbar: getElementSize(
						document.getElementsByClassName("js-navbar")[0]
					),
				})
			);
		});

		return () => {
			window.removeEventListener("resize", () => {
				dispatch(
					setDisplaySizeVariables({
						window: getWindowSize(),
						navbar: getElementSize(
							document.getElementsByClassName("js-navbar")[0]
						),
					})
				);
			});
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		setNavbarButtonColor(
			reduxState[projectContainerName].componentsDisplay.listContainer ||
				reduxState[projectContainerName].componentsDisplay.itemContainer,
			document.getElementsByClassName("js-project-button")[0],
			"navbar-button--selected"
		);
		// Prevents error of js-bug-button not exisiting
		if (
			reduxState[projectContainerName].componentsDisplay.targetItem !== null
		) {
			setNavbarButtonColor(
				reduxState[bugContainerName].componentsDisplay.listContainer ||
					reduxState[bugContainerName].componentsDisplay.itemContainer,
				document.getElementsByClassName("js-bug-button")[0],
				"navbar-button--selected"
			);
		}
		// eslint-disable-next-line
	}, [
		reduxState.accountContainer.componentsDisplay,
		// eslint-disable-next-line
		reduxState[projectContainerName].componentsDisplay,
		// eslint-disable-next-line
		reduxState[bugContainerName].componentsDisplay,
	]);

	const openAccountSidebar = () => {
		dispatch(
			setWhichProjectComponentsDisplay({
				...reduxState[projectContainerName].componentsDisplay,
				listContainerCreateItemSidbar: false,
				itemContainerDeleteModal: false,
				listContainerMassDeleteItemsModal: false,
			})
		);
		dispatch(
			setWhichBugComponentsDisplay({
				...reduxState[bugContainerName].componentsDisplay,
				listContainerCreateItemSidbar: false,
				itemContainerDeleteModal: false,
				listContainerMassDeleteItemsModal: false,
			})
		);
		dispatch(
			setWhichAccountComponentsDisplay({
				accountSidebar: !reduxState.accountContainer.componentsDisplay
					.accountSidebar,
			})
		);
	};

	const openProjectsTable = () => {
		if (
			reduxState[projectContainerName].componentsDisplay.listContainer !== true &&
			reduxState[projectContainerName].componentsDisplay.itemContainer !== true
		) {
			dispatch(
				setWhichBugComponentsDisplay({
					targetItem: reduxState[bugContainerName].componentsDisplay.targetItem,
					previousState:
						reduxState[bugContainerName].componentsDisplay.listContainer === true ||
						reduxState[bugContainerName].componentsDisplay.itemContainer ===
							true
							? reduxState[bugContainerName].componentsDisplay
							: null,
				})
			);
			if (
				reduxState[projectContainerName].componentsDisplay.previousState !==
				null
			) {
				dispatch(
					setWhichProjectComponentsDisplay({
						...reduxState[projectContainerName].componentsDisplay.previousState,
					})
				);
			} else {
				dispatch(
					setWhichProjectComponentsDisplay({
						listContainer: true,
						targetItem:
							reduxState[projectContainerName].componentsDisplay.targetItem,
					})
				);
			}
		}
	};

	const openBugsTable = () => {
		if (
			reduxState[bugContainerName].componentsDisplay.listContainer !== true &&
			reduxState[bugContainerName].componentsDisplay.itemContainer !== true
		) {
			dispatch(
				setWhichProjectComponentsDisplay({
					targetItem:
						reduxState[projectContainerName].componentsDisplay.targetItem,
					previousState:
						reduxState[projectContainerName].componentsDisplay.listContainer ===
							true ||
						reduxState[projectContainerName].componentsDisplay.itemContainer ===
							true
							? reduxState[projectContainerName].componentsDisplay
							: null,
				})
			);
			if (
				reduxState[bugContainerName].componentsDisplay.previousState !== null
			) {
				dispatch(
					setWhichBugComponentsDisplay({
						...reduxState[bugContainerName].componentsDisplay.previousState,
					})
				);
			} else {
				dispatch(
					setWhichBugComponentsDisplay({
						listContainer: true,
					})
				);
			}
		}
	};

	return (
		<div className="navbar-and-other-components-container">
			<div className="navbar-component js-navbar">
				<div
					className="navbar-button js-project-button"
					onClick={openProjectsTable}
				>
					<div className="navbar-button__text-container">
						<i className="fa fa-folder" aria-hidden="true" />{" "}
						{reduxState[projectContainerName].componentsDisplay.targetItem ===
						null
							? "Projects"
							: reduxState[projectContainerName].componentsDisplay.targetItem
									.name}
					</div>
				</div>
				{reduxState[projectContainerName].componentsDisplay.targetItem !==
				null ? (
					<div className="navbar-button js-bug-button" onClick={openBugsTable}>
						<div className="navbar-button__text-container js-bug-button-text">
							<i className="fa fa-bug" aria-hidden="true" />{" "}
							{reduxState[bugContainerName].componentsDisplay.targetItem ===
							null
								? "Bugs"
								: reduxState[bugContainerName].componentsDisplay.targetItem
										.name}
						</div>
					</div>
				) : null}
				<div
					className="navbar-button navbar-button--right js-account-button"
					onClick={openAccountSidebar}
				>
					<div className="navbar-button__text-container">
						<i className="fa fa-fw fa-user" />
						Account
					</div>
				</div>
			</div>
		</div>
	);
}
