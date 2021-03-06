import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
	PROJECT_CONTAINER,
	BUG_CONTAINER,
	SIZE_CONTAINER,
} from "../../../../actions/constants/containerNames";

import {
	setWhichGeneralDropdownsDisplay,
	setProjectOrBugSearchFilterSort,
	setWhichProjectOrBugComponentsDisplay,
	setWhichBugComponentsDisplay,
	setProjectOrBugMassDeleteList,
} from "../../../../actions";

import {
	getUpdatedDeepCopyFilterArray,
	getTopBarBorderAndBackgroundColorClassNameForLightOrDarkMode,
	getTopBarSearchBarBorderBackgroundTextColorClassNameForThemeWithLightOrDarkMode,
	getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode,
	getTextColorClassNameForThemeWithLightOrDarkMode,
	getItemViewTopBarIconButtonTextColorWithHoverClassNameForLightOrDarkMode,
	getItemViewTopBarOptionsButtonClickedBorderBackgroundTextColorClassNameForLightOrDarkMode,
	getItemViewTopBarOptionsDropdownRowHoverBackgroundColorClassNameForLightOrDarkMode,
} from "../../../../utils";

// Components
import CustomCheckbox from "../../../basic/CustomCheckbox";
import SortArrowsButton from "../../../basic/SortArrowsButton";

export default function ItemViewTopBar(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const [searchBarText, setSearchBarText] = useState(
		reduxState[props.reduxContainerName].searchFilterSort.searchKeyWordString
	);

	const onChangeSearchBar = (e) => {
		setSearchBarText(e.target.value);
	};

	const updateSearchKeyWordString = () => {
		dispatch(
			setProjectOrBugSearchFilterSort(props.reduxContainerName, {
				...reduxState[props.reduxContainerName].searchFilterSort,
				searchKeyWordString: searchBarText,
			})
		);
	};

	const searchBarKeyDown = (e) => {
		if (e.keyCode === 13) {
			updateSearchKeyWordString();
		}
	};

	const toggleFilterDropdown = (e) => {
		e.stopPropagation();

		dispatch(
			setWhichGeneralDropdownsDisplay({
				itemViewTopBarFilterDropdown: !reduxState[GENERAL_CONTAINER]
					.dropdownsDisplay.itemViewTopBarFilterDropdown,
			})
		);
	};

	const toggleSortDropdown = (e) => {
		e.stopPropagation();

		dispatch(
			setWhichGeneralDropdownsDisplay({
				itemViewTopBarSortDropdown: !reduxState[GENERAL_CONTAINER]
					.dropdownsDisplay.itemViewTopBarSortDropdown,
			})
		);
	};

	const toggleOptionsDropdown = (e) => {
		e.stopPropagation();

		dispatch(
			setWhichGeneralDropdownsDisplay({
				itemViewTopBarOptionsDropdown: !reduxState[GENERAL_CONTAINER]
					.dropdownsDisplay.itemViewTopBarOptionsDropdown,
			})
		);
	};

	const onChangeFilter = (e) => {
		dispatch(
			setProjectOrBugSearchFilterSort(props.reduxContainerName, {
				...reduxState[props.reduxContainerName].searchFilterSort,
				[e.target.name]: getUpdatedDeepCopyFilterArray(
					reduxState,
					props.reduxContainerName,
					e.target.name,
					e.target.value
				),
			})
		);
	};

	const fireSortArrowOnClick = (sortArrowButtonId) => {
		document.getElementById(sortArrowButtonId).click();
	};

	const switchBetweenDisplayAndEditInfo = () => {
		dispatch(
			setWhichProjectOrBugComponentsDisplay(props.reduxContainerName, {
				...reduxState[props.reduxContainerName].componentsDisplay,
				itemViewEditItemInfo: !reduxState[props.reduxContainerName]
					.componentsDisplay.itemViewEditItemInfo,
			})
		);
	};

	const openDeleteItemModal = () => {
		dispatch(
			setWhichProjectOrBugComponentsDisplay(props.reduxContainerName, {
				...reduxState[props.reduxContainerName].componentsDisplay,
				itemViewDeleteModal: true,
			})
		);
	};

	const closeItemView = () => {
		dispatch(
			setWhichProjectOrBugComponentsDisplay(props.reduxContainerName, {
				...reduxState[props.reduxContainerName].componentsDisplay,
				listView: true,
				itemView: false,
				targetItem: null,
			})
		);

		// Resets bug components display if project itemView is closed
		if (props.reduxContainerName === PROJECT_CONTAINER) {
			dispatch(setWhichBugComponentsDisplay({}));
			dispatch(setProjectOrBugMassDeleteList(BUG_CONTAINER));
		}
	};

	return (
		<div
			className={
				"item-vew-top-bar-component js-top-bar" +
				getTopBarBorderAndBackgroundColorClassNameForLightOrDarkMode(
					reduxState[ACCOUNT_CONTAINER].settings.dark_mode
				)
			}
		>
			<div
				className={
					"outer-search-container" +
					getTopBarSearchBarBorderBackgroundTextColorClassNameForThemeWithLightOrDarkMode(
						reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
						reduxState[ACCOUNT_CONTAINER].settings.theme_color
					) +
					(reduxState[GENERAL_CONTAINER].componentsDisplay
						.itemViewListSidebar !== true ||
					(reduxState[SIZE_CONTAINER].variables.window !== null &&
						reduxState[SIZE_CONTAINER].variables.window.width < 400)
						? " outer-search-container--invisible"
						: "")
				}
			>
				<input
					type="text"
					name="searchBarText"
					onChange={(e) => onChangeSearchBar(e)}
					onKeyDown={(e) => searchBarKeyDown(e)}
					value={searchBarText}
					className="outer-search-container__search-bar js-item-search-bar"
				/>
				<div
					className="outer-search-container__search-bar-button js-item-search-button"
					onClick={updateSearchKeyWordString}
				>
					<span className="outer-search-container__search-bar-button__icon">
						<i
							className="fa fa-search"
							aria-hidden="true"
							alt="Icon of a magnifying glass"
						/>
					</span>
				</div>
			</div>
			{reduxState[GENERAL_CONTAINER].componentsDisplay.itemViewListSidebar !==
				true ||
			(reduxState[SIZE_CONTAINER].variables.window !== null &&
				reduxState[SIZE_CONTAINER].variables.window.width < 602) ? null : (
				<div>
					<div className="list-filter-or-sort-container">
						<div
							className={
								"list-filter-or-sort-container__button" +
								getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								) +
								(reduxState[GENERAL_CONTAINER].dropdownsDisplay
									.itemViewTopBarFilterDropdown
									? " list-filter-or-sort-container__button--clicked list-filter-or-sort-container__button--clicked-filter-width"
									: "")
							}
							onClick={(e) => toggleFilterDropdown(e)}
						>
							<span
								className={
									"list-filter-or-sort-container__button__text" +
									(reduxState[props.reduxContainerName].searchFilterSort
										.priorityFilter.length > 0 ||
									reduxState[props.reduxContainerName].searchFilterSort
										.statusFilter.length > 0
										? " list-filter-or-sort-container__button__text--active" +
										  getTextColorClassNameForThemeWithLightOrDarkMode(
												reduxState[ACCOUNT_CONTAINER].settings.dark_mode,
												reduxState[ACCOUNT_CONTAINER].settings.theme_color
										  )
										: "")
								}
							>
								<i
									className="fa fa-filter"
									aria-hidden="true"
									alt="Icon of a filter"
								/>{" "}
								Filter
							</span>
						</div>
						<div
							className={
								"list-filter-or-sort-container__content-dropdown" +
								getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								) +
								(props.reduxContainerName === BUG_CONTAINER
									? " list-filter-or-sort-container__content-dropdown--shorter"
									: "") +
								(reduxState[GENERAL_CONTAINER].dropdownsDisplay
									.itemViewTopBarFilterDropdown
									? " list-filter-or-sort-container__content-dropdown--visible"
									: "")
							}
							onClick={
								/*Keeps clicking dropdown from closing itself*/
								(e) => {
									e.stopPropagation();
								}
							}
						>
							<div className="list-filter-or-sort-container__content-dropdown__filter-content">
								<span className="list-filter-or-sort-container__content-dropdown__filter-content__title">
									Priority
								</span>
								{reduxState[
									props.reduxContainerName
								].priorityStatusOptions.priorityList.map((obj, i) => {
									return (
										<div
											key={i}
											className="list-filter-or-sort-container__content-dropdown__filter-content__block"
										>
											<div className="list-filter-or-sort-container__content-dropdown__filter-content__block__checkbox-container">
												<CustomCheckbox
													name="priorityFilter"
													value={obj.id}
													onChangeFunction={onChangeFilter}
													checked={
														!reduxState[
															props.reduxContainerName
														].searchFilterSort.priorityFilter.includes(obj.id)
													}
													dark_mode={
														reduxState[ACCOUNT_CONTAINER].settings.dark_mode
													}
													theme_color={
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
													}
													id={"list-priority-filter-" + obj.id}
												/>
											</div>
											<label
												htmlFor={"list-priority-filter-" + obj.id}
												className={
													"list-filter-or-sort-container__content-dropdown__filter-content__block__label" +
													(reduxState[
														props.reduxContainerName
													].searchFilterSort.priorityFilter.includes(obj.id)
														? " list-filter-or-sort-container__content-dropdown__filter-content__block__label--active" +
														  getTextColorClassNameForThemeWithLightOrDarkMode(
																reduxState[ACCOUNT_CONTAINER].settings
																	.dark_mode,
																reduxState[ACCOUNT_CONTAINER].settings
																	.theme_color
														  )
														: "")
												}
											>
												{obj.option !== "" ? obj.option : "Not Assigned"}
											</label>
										</div>
									);
								})}
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__filter-content list-filter-or-sort-container__content-dropdown__filter-content--right">
								<span className="list-filter-or-sort-container__content-dropdown__filter-content__title">
									Status
								</span>
								{reduxState[
									props.reduxContainerName
								].priorityStatusOptions.statusList.map((obj, i) => {
									return (
										<div
											key={i}
											className="list-filter-or-sort-container__content-dropdown__filter-content__block"
										>
											<div className="list-filter-or-sort-container__content-dropdown__filter-content__block__checkbox-container">
												<CustomCheckbox
													name="statusFilter"
													value={obj.id}
													onChangeFunction={onChangeFilter}
													checked={
														!reduxState[
															props.reduxContainerName
														].searchFilterSort.statusFilter.includes(obj.id)
													}
													dark_mode={
														reduxState[ACCOUNT_CONTAINER].settings.dark_mode
													}
													theme_color={
														reduxState[ACCOUNT_CONTAINER].settings.theme_color
													}
													id={"list-status-filter-" + obj.id}
												/>
											</div>
											<label
												htmlFor={"list-status-filter-" + obj.id}
												className={
													"list-filter-or-sort-container__content-dropdown__filter-content__block__label" +
													(reduxState[
														props.reduxContainerName
													].searchFilterSort.statusFilter.includes(obj.id)
														? " list-filter-or-sort-container__content-dropdown__filter-content__block__label--active" +
														  getTextColorClassNameForThemeWithLightOrDarkMode(
																reduxState[ACCOUNT_CONTAINER].settings
																	.dark_mode,
																reduxState[ACCOUNT_CONTAINER].settings
																	.theme_color
														  )
														: "")
												}
											>
												{obj.option !== "" ? obj.option : "Not Assigned"}
											</label>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					<div className="list-filter-or-sort-container list-filter-or-sort-container--sort-placement">
						<div
							className={
								"list-filter-or-sort-container__button" +
								getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								) +
								(reduxState[GENERAL_CONTAINER].dropdownsDisplay
									.itemViewTopBarSortDropdown
									? " list-filter-or-sort-container__button--clicked"
									: "")
							}
							onClick={(e) => toggleSortDropdown(e)}
						>
							<span className={"list-filter-or-sort-container__button__text"}>
								<i
									className="fa fa-sort"
									aria-hidden="true"
									alt="Icon representing sorting"
								/>{" "}
								Sort
							</span>
						</div>
						<div
							className={
								"list-filter-or-sort-container__content-dropdown list-filter-or-sort-container__content-dropdown--sort-width" +
								getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
								) +
								(reduxState[GENERAL_CONTAINER].dropdownsDisplay
									.itemViewTopBarSortDropdown
									? " list-filter-or-sort-container__content-dropdown--visible"
									: "")
							}
							onClick={
								/*Keeps clicking dropdown from closing itself*/
								(e) => {
									e.stopPropagation();
								}
							}
						>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={1}
										sortFor="Name"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-name"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-name")
									}
								>
									Name
								</span>
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={2}
										sortFor="Status"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-status"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-status")
									}
								>
									Status
								</span>
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={3}
										sortFor="Priority"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-priority"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-priority")
									}
								>
									Priority
								</span>
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={4}
										sortFor="Created on"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-created-on"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-created-on")
									}
								>
									Created on
								</span>
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={5}
										sortFor="Start Date"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-start-date"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-start-date")
									}
								>
									Start Date
								</span>
							</div>
							<div className="list-filter-or-sort-container__content-dropdown__sort-content-block">
								<span className="list-filter-or-sort-container__content-dropdown__sort-content-block__sort-arrows-container">
									<SortArrowsButton
										sortId={6}
										sortFor="Due Date"
										reduxContainerName={props.reduxContainerName}
										dark_mode={reduxState[ACCOUNT_CONTAINER].settings.dark_mode}
										uniqueId="item-view-sort-arrow-due-date"
									/>
								</span>
								<span
									className="list-filter-or-sort-container__content-dropdown__sort-content-block__title"
									onClick={() =>
										fireSortArrowOnClick("item-view-sort-arrow-due-date")
									}
								>
									Due Date
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="item-options-container">
				<div
					className={
						"item-options-container__button" +
						getItemViewTopBarIconButtonTextColorWithHoverClassNameForLightOrDarkMode(
							reduxState[ACCOUNT_CONTAINER].settings.dark_mode
						) +
						(reduxState[GENERAL_CONTAINER].dropdownsDisplay
							.itemViewTopBarOptionsDropdown
							? getItemViewTopBarOptionsButtonClickedBorderBackgroundTextColorClassNameForLightOrDarkMode(
									reduxState[ACCOUNT_CONTAINER].settings.dark_mode
							  )
							: "")
					}
					onClick={(e) => toggleOptionsDropdown(e)}
				>
					<span className="item-options-container__button__text">
						<i
							className="fa fa-ellipsis-h"
							aria-hidden="true"
							alt="Icon of an ellipsis (three dots)"
						/>
					</span>
				</div>
				<div
					className={
						"item-options-container__dropdown" +
						getTopBarButtonBorderBackgroundTextColorClassNameForLightOrDarkMode(
							reduxState[ACCOUNT_CONTAINER].settings.dark_mode
						) +
						(reduxState[GENERAL_CONTAINER].dropdownsDisplay
							.itemViewTopBarOptionsDropdown
							? " item-options-container__dropdown--visible"
							: "")
					}
					onClick={
						/*Keeps clicking dropdown from closing itself*/
						(e) => {
							e.stopPropagation();
						}
					}
				>
					<span
						className={
							"item-options-container__dropdown__option" +
							getItemViewTopBarOptionsDropdownRowHoverBackgroundColorClassNameForLightOrDarkMode(
								reduxState[ACCOUNT_CONTAINER].settings.dark_mode
							)
						}
						onClick={switchBetweenDisplayAndEditInfo}
					>
						{reduxState[props.reduxContainerName].componentsDisplay
							.itemViewEditItemInfo
							? "Cancel"
							: props.reduxContainerName === PROJECT_CONTAINER
							? "Edit Project"
							: "Edit Bug"}
					</span>
					<span
						className={
							"item-options-container__dropdown__option item-options-container__dropdown__option--no-border" +
							getItemViewTopBarOptionsDropdownRowHoverBackgroundColorClassNameForLightOrDarkMode(
								reduxState[ACCOUNT_CONTAINER].settings.dark_mode
							)
						}
						onClick={openDeleteItemModal}
					>
						{props.reduxContainerName === PROJECT_CONTAINER
							? "Delete Project"
							: "Delete Bug"}
					</span>
				</div>
			</div>
			<div
				className={
					"x-button" +
					getItemViewTopBarIconButtonTextColorWithHoverClassNameForLightOrDarkMode(
						reduxState[ACCOUNT_CONTAINER].settings.dark_mode
					)
				}
				onClick={closeItemView}
			>
				<i className="fa fa-times" aria-hidden="true" alt="Icon of an X"></i>
			</div>
		</div>
	);
}
